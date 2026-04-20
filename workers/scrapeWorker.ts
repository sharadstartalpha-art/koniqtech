import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { connection } from "@/lib/redis";

// ==============================
// 🕷 SCRAPE WORKER
// ==============================
new Worker(
  "scrape",
  async (job) => {
    const { jobId, query } = job.data;

    console.log("🕷 Running scrape job:", job.data);

    try {
      // 🔄 Mark job as running
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "running",
            progress: 10,
            logs: "Starting scrape...",
          },
        });
      }

      // ==============================
      // 🔍 STEP 1: Scrape data
      // ==============================
      // 👉 Replace with real scraping logic
      /*
      const leads = await scrapeLinkedIn(query);
      */

      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            progress: 50,
            logs: "Scraping leads...",
          },
        });
      }

      // ==============================
      // 💾 STEP 2: Save leads
      // ==============================
      /*
      if (leads?.length) {
        await prisma.lead.createMany({
          data: leads,
          skipDuplicates: true,
        });
      }
      */

      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            progress: 80,
            logs: "Saving leads...",
          },
        });
      }

      // ==============================
      // ✅ FINAL STEP
      // ==============================
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "done",
            progress: 100,
            logs: "Scrape completed ✅",
          },
        });
      }

      return true;
    } catch (err) {
      console.error("❌ Scrape worker error:", err);

      // ❌ Mark job as failed
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "failed",
            logs: "Scrape failed ❌",
          },
        });
      }

      throw err; // 🔥 enables retries
    }
  },
  {
    connection,

    // ⚡ control parallel scraping jobs
    concurrency: 2,
  }
);