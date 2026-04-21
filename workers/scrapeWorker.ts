import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";

const connection = getRedis();

if (!connection) {
  throw new Error("❌ Redis not available");
}

console.log("🕷 Scrape Worker Started");

new Worker(
  "scrape",
  async (job) => {
    const { jobId, query } = job.data;

    console.log("🔥 JOB RECEIVED:", job.data);

    try {
      // ==============================
      // 🚀 STEP 1: START
      // ==============================
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "running",
            progress: 10,
            logs: "Scraping started...",
          },
        });
      }

      // 🧪 simulate scraping
      await new Promise((r) => setTimeout(r, 2000));

      // ==============================
      // 🔍 STEP 2: PROCESS
      // ==============================
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            progress: 60,
            logs: "Processing profiles...",
          },
        });
      }

      await new Promise((r) => setTimeout(r, 2000));

      // ==============================
      // ✅ FINAL STEP
      // ==============================
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "done",
            progress: 100,
            logs: "Scraping completed ✅",
          },
        });
      }

      console.log("✅ SCRAPE DONE:", jobId);

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
    connection,
    concurrency: 2,
  }
);