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
    const { queryId, text, userId } = job.data;

    console.log("🔥 SCRAPE JOB:", job.data);

    // ❌ HARD STOP
    if (!userId) {
      throw new Error("Missing userId in job");
    }

    try {
      // ==============================
      // 🔍 FETCH QUERY (for team/project)
      // ==============================
      const query = await prisma.query.findUnique({
        where: { id: queryId },
      });

      if (!query) {
        throw new Error("Query not found");
      }

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
      // 💾 STEP 3: SAVE LEADS
      // ==============================
      for (const lead of leads) {
        try {
          // 🔥 DEBUG LOG (IMPORTANT)
          console.log("💾 Inserting lead:", {
            name: lead.name,
            email: lead.email,
            userId,
          });

          await prisma.lead.create({
            data: {
              name: lead.name || "Unknown",
              email: lead.email || null,
              company: lead.company || null,
              location: lead.location || null,
              profileUrl: lead.profileUrl || null,

              // 🔥 RELATIONS
              queryId,
              userId,
              teamId: query.teamId,
              projectId: query.projectId,
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