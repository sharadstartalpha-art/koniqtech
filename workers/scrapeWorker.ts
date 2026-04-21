import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";
import { searchLeads } from "@/lib/search";

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
      throw new Error("Missing userId");
    }

    try {
      // ==============================
      // 🔍 FETCH QUERY (for relations)
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
      // 🔍 STEP 2: SEARCH LEADS
      // ==============================
      const results = await searchLeads(text);

      console.log("📊 Total results:", results.length);

      // ==============================
      // 💾 STEP 3: SAVE LEADS
      // ==============================
      for (const item of results) {
        try {
          console.log("💾 Inserting lead:", {
            name: item.name,
            profileUrl: item.profileUrl,
            userId,
          });

          await prisma.lead.create({
            data: {
              name: item.name || "Unknown",
              profileUrl: item.profileUrl || null,
              company: item.company || null,
              location: item.location || null,
              email: item.email || null,

              // 🔥 RELATIONS (REAL DATA)
              queryId,
              userId,
              teamId: query.teamId,
              projectId: query.projectId,

              source: "search",
            },
          });
        } catch (err) {
          // ⚠️ likely duplicate (unique constraint)
          console.log("⚠️ Duplicate skipped");
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

      return true;

    } catch (err) {
      console.error("❌ Worker error:", err);

      await prisma.query.update({
        where: { id: queryId },
        data: { scrapeStatus: "failed" },
      });

      throw err;
    }
  },
  {
    connection,
    concurrency: 2, // 🔥 keep parallel jobs
  }
);