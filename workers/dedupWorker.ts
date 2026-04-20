import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { connection } from "@/lib/redis";

// ==============================
// 🧹 DEDUP WORKER
// ==============================
new Worker(
  "dedup",
  async (job) => {
    const { jobId } = job.data;

    console.log("🧹 Running dedup job:", job.data);

    try {
      // 🔄 Mark job as running
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

      // ==============================
      // 🔍 STEP 1: Find duplicates
      // ==============================
      // 👉 Replace with real logic
      /*
      const duplicates = await prisma.lead.findMany({
        where: {
          email: { not: null },
        },
      });
      */

      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            progress: 50,
            logs: "Processing duplicates...",
          },
        });
      }

      // ==============================
      // 🧹 STEP 2: Remove / merge duplicates
      // 👉 Your logic here
      // ==============================

      // ==============================
      // ✅ FINAL STEP
      // ==============================
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

      // ❌ Mark job as failed
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "failed",
            logs: "Dedup failed ❌",
          },
        });
      }

      throw err; // 🔥 enables retries
    }
  },
  {
    connection,

    // ⚡ control parallel jobs
    concurrency: 2,
  }
);