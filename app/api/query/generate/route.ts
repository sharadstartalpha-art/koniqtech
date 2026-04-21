import { scrapeQueue } from "@/lib/queue";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const { queryId, text } = body || {};

    // ❌ Validate input
    if (!queryId || !text) {
      return Response.json(
        { error: "Missing fields (queryId, text required)" },
        { status: 400 }
      );
    }

    // ❌ Queue not initialized (VERY IMPORTANT for build/runtime)
    if (!scrapeQueue) {
      return Response.json(
        { error: "Queue not initialized (Redis missing)" },
        { status: 500 }
      );
    }

    // 🚀 Push job to worker
    await scrapeQueue.add("scrape", {
      queryId,
      text,
    });

    console.log("🕷 Scrape job added:", { queryId, text });

    return Response.json({ success: true });

  } catch (err) {
    console.error("❌ Generate error:", err);

    return Response.json(
      { error: "Failed to generate" },
      { status: 500 }
    );
  }
}