import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";

console.log("🕷 Scrape Worker Started");

new Worker(
  "scrape",
  async (job) => {
    const { jobId, query } = job.data;

    console.log("🕷 Running scrape job:", job.data);

    try {
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

      // 👉 Step 1: Scrape data

      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            progress: 50,
            logs: "Scraping leads...",
          },
        });
      }

      // 👉 Step 2: Save leads

      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            progress: 80,
            logs: "Saving leads...",
          },
        });
      }

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

      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "failed",
            logs: "Scrape failed ❌",
          },
        });
      }

      throw err;
    }
  },
  {
    connection: getRedis()!, // ✅ FIXED
    concurrency: 2,
  }
);