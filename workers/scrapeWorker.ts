import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";
import { enrichQueue } from "@/lib/queue";

const connection = getRedis();

if (!connection) {
  throw new Error("❌ Redis not available");
}

console.log("🕷 Scrape Worker Started");

new Worker(
  "scrape",
  async (job) => {
    const { queryId, text } = job.data;

    console.log("🔥 SCRAPE JOB:", job.data);

    try {
      // 🚀 mark running
      await prisma.query.update({
        where: { id: queryId },
        data: { scrapeStatus: "running" },
      });

      // 🧪 simulate scraping
      await new Promise((r) => setTimeout(r, 3000));

      // ✅ mark done
      await prisma.query.update({
        where: { id: queryId },
        data: { scrapeStatus: "done" },
      });

      console.log("✅ SCRAPE DONE:", queryId);

      // 🔥 SAFE QUEUE CALL
      if (enrichQueue) {
        await enrichQueue.add("enrich-job", { queryId });
      } else {
        console.warn("⚠️ enrichQueue not available");
      }

      return true;
    } catch (err) {
      console.error("❌ Scrape error:", err);

      await prisma.query.update({
        where: { id: queryId },
        data: { scrapeStatus: "failed" },
      });

      throw err;
    }
  },
  {
    connection,
    concurrency: 2,
  }
);