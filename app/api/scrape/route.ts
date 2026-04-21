import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeQueue } from "@/lib/queue";

// ==============================
// 🚀 QUEUE SCRAPE JOB
// ==============================
export async function POST(req: Request) {
  try {
    if (!scrapeQueue) {
      return NextResponse.json(
        { error: "Queue not available (Redis missing)" },
        { status: 503 }
      );
    }

    // 📥 Parse body
    const body = await req.json().catch(() => null);
    const query = body?.query?.trim();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // 🆕 Create DB job
    const job = await prisma.job.create({
      data: {
        type: "scrape",
        status: "queued",
        query, // ✅ FIX
        logs: "Queued for scraping...",
        progress: 0,
      },
    });

    // 📥 Add to queue
    await scrapeQueue.add("scrape-job", {
      jobId: job.id,
      query,
    });

    console.log("🚀 Scrape queued:", job.id, query);

    return NextResponse.json({
      success: true,
      jobId: job.id,
    });

  } catch (err) {
    console.error("❌ Queue error:", err);

    return NextResponse.json(
      { error: "Failed to queue scrape job" },
      { status: 500 }
    );
  }
}