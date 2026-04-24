import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";
import { dedupQueue } from "@/lib/queue";
import { scoreLead } from "@/lib/scoring";

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
      // 🔍 GET ALL LEADS FOR QUERY
      // =================================
      const leads = await prisma.lead.findMany({
        where: { queryId },
      });

      // =================================
      // 🔬 ENRICH + SCORE
      // =================================
      for (const lead of leads) {
        try {
          // 👉 (Future: add real enrichment here)

          const score = scoreLead(lead);

          await prisma.lead.update({
            where: { id: lead.id },
            data: {
              score,
              isContactable: !!lead.email,
            },
          });
        } catch (err) {
          console.log("⚠️ Enrich skipped:", err);
        }
      }

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