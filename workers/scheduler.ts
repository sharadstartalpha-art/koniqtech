import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { scrapeQueue } from "@/lib/queue";

console.log("⏰ Scheduler started");

// run every 2 minutes
setInterval(async () => {
  try {
    console.log("🔄 Running scheduled scrape...");

    // ❗ FIX: ensure queue exists
    if (!scrapeQueue) {
      console.error("❌ scrapeQueue not initialized");
      return;
    }

    const queries = await prisma.query.findMany({
      where: {
        scrapeStatus: "idle",
      },
      take: 2,
    });

    for (const q of queries) {
      await scrapeQueue.add("scrape-job", {
        queryId: q.id,
        text: q.text,
        userId: q.userId,
      });

      await prisma.query.update({
        where: { id: q.id },
        data: { scrapeStatus: "queued" },
      });
    }
  } catch (err) {
    console.error("❌ Scheduler error:", err);
  }
}, 300000);