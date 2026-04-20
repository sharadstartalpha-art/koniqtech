import { Worker } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "@/lib/prisma";

const connection = new IORedis();

// ==============================
// ✨ ENRICH WORKER
// ==============================
new Worker(
  "enrich",
  async (job) => {
    const { jobId, data } = job.data;

    console.log("Running enrich job:", job.data);

    try {
      // 🔄 Mark as running
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: { status: "running" },
        });
      }

      // 👉 YOUR ENRICH LOGIC HERE
      // Example:
      // await enrichLeads(data);

      // ✅ Mark as done
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: { status: "done" },
        });
      }

      return true;
    } catch (err) {
      console.error("Enrich worker error:", err);

      // ❌ Mark as failed
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: { status: "failed" },
        });
      }

      throw err; // important for BullMQ retries
    }
  },
  { connection }
);