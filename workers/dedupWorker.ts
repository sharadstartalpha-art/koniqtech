import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";

const connection = getRedis();

if (!connection) {
  throw new Error("❌ Redis not available");
}

console.log("🧹 Dedup Worker Started");

new Worker(
  "dedup",
  async (job) => {
    const { queryId } = job.data;

    console.log("🧹 DEDUP JOB:", job.data);

    try {
      // 🚀 mark running
      await prisma.query.update({
        where: { id: queryId },
        data: {
          dedupStatus: "running",
        },
      });

      // 🧪 simulate dedup
      await new Promise((r) => setTimeout(r, 2000));

      // ✅ mark done
      await prisma.query.update({
        where: { id: queryId },
        data: {
          dedupStatus: "done",
        },
      });

      console.log("✅ DEDUP DONE:", queryId);

      return true;
    } catch (err) {
      console.error("❌ Dedup error:", err);

      await prisma.query.update({
        where: { id: queryId },
        data: {
          dedupStatus: "failed",
        },
      });

      throw err;
    }
  },
  {
    connection,
    concurrency: 2,
  }
);