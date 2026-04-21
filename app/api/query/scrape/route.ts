import { prisma } from "@/lib/prisma";
import { scrapeQueue } from "@/lib/queue";

// ==============================
// 🚀 RUN SCRAPE FOR QUERY
// ==============================
export async function POST(req: Request) {
  try {
    // ❌ queue not available (build / misconfig)
    if (!scrapeQueue) {
      return Response.json(
        { error: "Queue not available (Redis missing)" },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => null);
    const queryId = body?.queryId;

    if (!queryId) {
      return Response.json(
        { error: "queryId is required" },
        { status: 400 }
      );
    }

    // 🔍 fetch query
    const query = await prisma.query.findUnique({
      where: { id: queryId },
    });

    if (!query) {
      return Response.json(
        { error: "Query not found" },
        { status: 404 }
      );
    }

    // 🚀 mark as running
    await prisma.query.update({
      where: { id: queryId },
      data: { scrapeStatus: "running" },
    });

    // 📥 add to queue
    await scrapeQueue.add("scrape-job", {
      queryId,
      text: query.text,
    });

    console.log("🕷 Scrape queued:", queryId);

    return Response.json({ success: true });

  } catch (err) {
    console.error("❌ Scrape API error:", err);

    return Response.json(
      { error: "Failed to start scrape" },
      { status: 500 }
    );
  }
}