import { Worker } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "@/lib/prisma";

const connection = new IORedis();

// ==============================
// 🕷 SCRAPE WORKER
// ==============================
new Worker(
  "scrape",
  async (job) => {
    const { jobId, query } = job.data;

    console.log("Running scrape job:", job.data);

    try {
      // 🔄 Mark job as running
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: { status: "running" },
        });
      }

      // 👉 YOUR SCRAPING LOGIC HERE
      // Example:
      // const leads = await scrapeLinkedIn(query);

      // 👉 Optionally save leads
      // await prisma.lead.createMany({ data: leads });

      // ✅ Mark job as done
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: { status: "done" },
        });
      }

      return true;
    } catch (err) {
      console.error("Scrape worker error:", err);

      // ❌ Mark job as failed
      if (jobId) {
        await prisma.job.update({
          where: { id: jobId },
          data: { status: "failed" },
        });
      }

      throw err; // 🔥 enables retries in BullMQ
    }
  },
  { connection }
);