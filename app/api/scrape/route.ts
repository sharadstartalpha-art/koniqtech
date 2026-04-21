import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeQueue } from "@/lib/queue";

// ==============================
// 🚀 QUEUE SCRAPE JOB
// ==============================
export async function POST(req: Request) {
  try {
    // ❌ Redis / Queue not available (build time / misconfig)
    if (!scrapeQueue) {
      return NextResponse.json(
        { error: "Queue not available (Redis missing)" },
        { status: 503 }
      );
    }

    // 📥 Parse body
    const body = await req.json().catch(() => null);
    const query = body?.query?.trim();

    // ❌ Validate input
    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // 🆕 Create DB job record
    const job = await prisma.job.create({
      data: {
        type: "scrape",
        status: "queued",
        logs: "Queued for scraping...",
      },
    });

    // 📥 Add to BullMQ queue
    await scrapeQueue.add("scrape-job", {
      jobId: job.id,
      query,
    });

    console.log("🚀 Scrape job queued:", job.id, query);

    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: "Scrape job queued 🚀",
    });

  } catch (err) {
    console.error("❌ Queue error:", err);

    return NextResponse.json(
      { error: "Failed to queue scrape job" },
      { status: 500 }
    );
  }
}