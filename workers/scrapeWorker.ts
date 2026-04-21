import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { scrapeLinkedIn } from "@/lib/linkedin";
import { getRedis } from "@/lib/redis";
import { enrichQueue } from "@/lib/queue";

// ==============================
// 🔌 REDIS CONNECTION
// ==============================
const connection = getRedis();

if (!connection) {
  throw new Error("❌ Redis not available");
}

console.log("🕷 Scrape Worker Started");

// ==============================
// 🚀 WORKER
// ==============================
new Worker(
  "scrape",
  async (job) => {
    const { queryId, text, userId } = job.data; // ✅ FIXED

    console.log("🔥 SCRAPE JOB:", job.data);

    try {
      // ==============================
      // 🚀 STEP 1: MARK RUNNING
      // ==============================
      await prisma.query.update({
        where: { id: queryId },
        data: { scrapeStatus: "running" },
      });

      // ==============================
      // 🕷 STEP 2: SCRAPE DATA
      // ==============================
      const leads = await scrapeLinkedIn(text);

      console.log("📊 Profiles found:", leads.length);

      // ==============================
      // 💾 STEP 3: SAVE LEADS (DEDUP SAFE)
      // ==============================
      for (const lead of leads) {
        try {
          await prisma.lead.upsert({
            where: {
              profileUrl:
                lead.profileUrl || `temp_${Math.random()}`,
            },
            update: {
              name: lead.name || undefined,
              company: lead.company || undefined,
              location: lead.location || undefined,
            },
            create: {
              name: lead.name || "Unknown",
              email: lead.email || "",
              company: lead.company || "",
              location: lead.location || "",
              profileUrl: lead.profileUrl,

              // 🔥 IMPORTANT RELATION
              queryId,

              // ✅ REAL USER
              userId,

              // ⚠️ TEMP (replace later if needed)
              teamId: "default",
              projectId: "default",
            },
          });
        } catch (err) {
          console.error("❌ Lead insert error:", err);
        }
      }

      // ==============================
      // ✅ STEP 4: MARK DONE
      // ==============================
      await prisma.query.update({
        where: { id: queryId },
        data: { scrapeStatus: "done" },
      });

      console.log("✅ SCRAPE DONE:", queryId);

      // ==============================
      // 🔥 STEP 5: TRIGGER ENRICH
      // ==============================
      if (enrichQueue) {
        await enrichQueue.add("enrich-job", { queryId });
        console.log("➡️ Enrich job queued");
      } else {
        console.warn("⚠️ enrichQueue not available");
      }

      return true;
    } catch (err) {
      console.error("❌ Scrape worker error:", err);

      await prisma.query.update({
        where: { id: queryId },
        data: { scrapeStatus: "failed" },
      });

      throw err;
    }
  },
  {
    connection,
    concurrency: 2,
  }
);