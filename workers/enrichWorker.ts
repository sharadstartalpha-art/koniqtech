import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";

console.log("✨ Enrich Worker Started");

new Worker(
  "enrich",
  async (job) => {
    const { jobId, data } = job.data;

    console.log("✨ Running enrich job:", job.data);

    try {
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "running",
            progress: 10,
            logs: "Starting enrichment...",
          },
        });
      }

      // 👉 Step 1: Find emails
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            progress: 30,
            logs: "Finding emails...",
          },
        });
      }

      // 👉 Step 2: Verify emails
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            progress: 70,
            logs: "Verifying emails...",
          },
        });
      }

      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "done",
            progress: 100,
            logs: "Completed ✅",
          },
        });
      }

      return true;
    } catch (err) {
      console.error("❌ Enrich worker error:", err);

      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "failed",
            logs: "Enrichment failed ❌",
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