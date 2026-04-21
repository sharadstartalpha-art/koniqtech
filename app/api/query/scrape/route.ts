import { prisma } from "@/lib/prisma";
import { scrapeQueue } from "@/lib/queue";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ==============================
// 🚀 RUN SCRAPE FOR QUERY
// ==============================
export async function POST(req: Request) {
  try {
    // 🔐 AUTH (🔥 REQUIRED)
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ❌ queue not available
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

    // 📥 add to queue (🔥 FIXED)
    await scrapeQueue.add("scrape-job", {
      queryId,
      text: query.text,
      userId: session.user.id, // ✅ IMPORTANT FIX
    });

    console.log("🕷 Scrape queued:", {
      queryId,
      userId: session.user.id,
    });

    return Response.json({ success: true });

  } catch (err) {
    console.error("❌ Scrape API error:", err);

    return Response.json(
      { error: "Failed to start scrape" },
      { status: 500 }
    );
  }
}