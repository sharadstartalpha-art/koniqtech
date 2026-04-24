import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";
import { dedupQueue } from "@/lib/queue";

const connection = getRedis();

if (!connection) {
  throw new Error("❌ Redis not available");
}

console.log("✨ Enrich Worker Started");

new Worker(
  "enrich",
  async (job) => {
    const { queryId } = job.data;

    console.log("✨ ENRICH JOB:", job.data);

    try {
      // 🔄 STATUS → RUNNING
      await prisma.query.update({
        where: { id: queryId },
        data: { enrichStatus: "running" },
      });

      // =================================
      // 🔬 ENRICH LOGIC (placeholder)
      // =================================
      // TODO: Add real enrichment (emails, domains, company data)
      await new Promise((r) => setTimeout(r, 2000));

      // =================================
      // ✅ STATUS → DONE
      // =================================
      await prisma.query.update({
        where: { id: queryId },
        data: { enrichStatus: "done" },
      });

      // =================================
      // 🚀 TRIGGER DEDUP (SAFE)
      // =================================
      if (dedupQueue) {
        await dedupQueue.add("dedup-job", { queryId });
      }

      console.log("✅ ENRICH DONE:", queryId);

      return true;
    } catch (err) {
      console.error("❌ Enrich error:", err);

      await prisma.query.update({
        where: { id: queryId },
        data: { enrichStatus: "failed" },
      });

      throw err;
    }
  },
  {
    connection,
    concurrency: 2,
  }
);