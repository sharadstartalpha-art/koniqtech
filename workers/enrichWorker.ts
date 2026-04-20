import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { connection } from "@/lib/redis";

// ==============================
// ✨ ENRICH WORKER
// ==============================
new Worker(
  "enrich",
  async (job) => {
    const { jobId, data } = job.data;

    console.log("✨ Running enrich job:", job.data);

    try {
      // 🔄 Mark as running
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

      // ==============================
      // 🔍 STEP 1: Find emails
      // ==============================
      // 👉 your logic here
      // await findEmails(data);

      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            progress: 30,
            logs: "Finding emails...",
          },
        });
      }

      // ==============================
      // 📬 STEP 2: Verify emails
      // ==============================
      // 👉 your logic here
      // await verifyEmails();

      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            progress: 70,
            logs: "Verifying emails...",
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
            logs: "Completed ✅",
          },
        });
      }

      return true;
    } catch (err) {
      console.error("❌ Enrich worker error:", err);

      // ❌ Mark as failed
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "failed",
            logs: "Enrichment failed ❌",
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