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
      // 🚀 mark running
      await prisma.query.update({
        where: { id: queryId },
        data: { enrichStatus: "running" },
      });

      // 🧪 simulate enrichment
      await new Promise((r) => setTimeout(r, 3000));

      // ✅ mark done
      await prisma.query.update({
        where: { id: queryId },
        data: { enrichStatus: "done" },
      });

      console.log("✅ ENRICH DONE:", queryId);

      // 🔥 SAFE QUEUE CALL
      if (dedupQueue) {
        await dedupQueue.add("dedup-job", { queryId });
      } else {
        console.warn("⚠️ dedupQueue not available");
      }

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