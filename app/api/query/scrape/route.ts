import { prisma } from "@/lib/prisma";
import { scrapeQueue } from "@/lib/queue";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ==============================
// 🚀 RUN SCRAPE FOR QUERY
// ==============================
export async function POST(req: Request) {
  try {
    // 🔐 AUTH
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ❌ Queue not available
    if (!scrapeQueue) {
      return Response.json(
        { error: "Queue not available (Redis missing)" },
        { status: 503 }
      );
    }

    // 📥 Parse body
    const body = await req.json().catch(() => null);
    const queryId = body?.queryId;

    if (!queryId) {
      return Response.json(
        { error: "queryId is required" },
        { status: 400 }
      );
    }

    // 🔍 Fetch query
    const query = await prisma.query.findUnique({
      where: { id: queryId },
    });

    if (!query) {
      return Response.json(
        { error: "Query not found" },
        { status: 404 }
      );
    }

    // ==============================
    // 🔥 GET REAL DB USER
    // ==============================
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!dbUser) {
      return Response.json(
        { error: "User not found in DB" },
        { status: 404 }
      );
    }

    // 🚀 Mark running
    await prisma.query.update({
      where: { id: queryId },
      data: { scrapeStatus: "running" },
    });

    // ==============================
    // 📥 ADD TO QUEUE
    // ==============================
    await scrapeQueue.add("scrape", {
      queryId: query.id,
      text: query.text,
      userId: dbUser.id, // ✅ CORRECT USER ID
    });

    console.log("🕷 Scrape queued:", {
      queryId,
      userId: dbUser.id,
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