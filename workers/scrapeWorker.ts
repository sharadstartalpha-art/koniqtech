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
    const { queryId, text } = job.data;

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
      const profiles = await scrapeLinkedIn(text);

      console.log("📊 Profiles found:", profiles.length);

      // ==============================
      // 💾 STEP 3: SAVE LEADS
      // ==============================
      for (const p of profiles) {
        try {
          await prisma.lead.upsert({
            where: {
              // fallback to avoid null crash
              profileUrl: p.profileUrl || `temp_${Math.random()}`,
            },
            update: {},
            create: {
              name: p.name,
              email: null,
              company: p.company,
              profileUrl: p.profileUrl,
              location: p.location,

              // 🔥 IMPORTANT RELATION
              queryId,

              // ⚠️ TEMP (replace later with auth)
              userId: "admin",
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