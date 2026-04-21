import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";

console.log("🧹 Dedup Worker Started");

new Worker(
  "dedup",
  async (job) => {
    const { jobId } = job.data;

    console.log("🧹 Running dedup job:", job.data);

    try {
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "running",
            progress: 10,
            logs: "Starting dedup...",
          },
        });
      }

      // 👉 Your dedup logic here

      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "done",
            progress: 100,
            logs: "Dedup completed ✅",
          },
        });
      }

      return true;
    } catch (err) {
      console.error("❌ Dedup worker error:", err);

      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "failed",
            logs: "Dedup failed ❌",
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