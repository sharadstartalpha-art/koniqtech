import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeQueue } from "@/lib/queue";

// ==============================
// 🚀 QUEUE SCRAPE JOB
// ==============================
export async function POST() {
  try {
    // ❌ Handle missing queue (build / no Redis)
    if (!scrapeQueue) {
      return NextResponse.json(
        { error: "Queue not available (Redis missing)" },
        { status: 503 }
      );
    }

    // 🆕 Create DB job record
    const job = await prisma.job.create({
      data: {
        type: "scrape",
        status: "queued",
      },
    });

    // 📥 Add to BullMQ queue
    await scrapeQueue.add("scrape-job", {
      jobId: job.id,
      query: "saas founders usa",
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: "Scrape job queued 🚀",
    });

  } catch (err) {
    console.error("Queue error:", err);

    return NextResponse.json(
      { error: "Failed to queue scrape job" },
      { status: 500 }
    );
  }
}