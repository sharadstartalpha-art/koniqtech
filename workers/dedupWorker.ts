import { Worker } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "@/lib/prisma";

const connection = new IORedis();

// ==============================
// 🧹 DEDUP WORKER
// ==============================
new Worker(
  "dedup",
  async (job) => {
    const { jobId } = job.data;

    console.log("Running dedup job:", job.data);

    try {
      // 🔄 Mark job as running
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: { status: "running" },
        });
      }

      // 👉 YOUR DEDUP LOGIC HERE
      // Example:
      // 1. Find duplicate leads (same email OR same name+companyKey)
      // 2. Keep one, remove others

      /*
      const duplicates = await prisma.lead.findMany({
        where: {
          email: { not: null },
        },
      });

      // ⚠️ Replace with real dedup logic
      */

      // ✅ Mark job as done
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: { status: "done" },
        });
      }

      return true;
    } catch (err) {
      console.error("Dedup worker error:", err);

      // ❌ Mark job as failed
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: { status: "failed" },
        });
      }

      throw err; // 🔥 enables BullMQ retries
    }
  },
  { connection }
);