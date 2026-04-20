import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ==============================
// 🚀 RUN SCRAPE JOB
// ==============================
export async function POST() {
  try {
    // 🆕 Create job
    const job = await prisma.job.create({
      data: {
        type: "scrape",
        status: "running",
      },
    });

    try {
      // 👉 YOUR SCRAPING LOGIC HERE

      // ✅ Mark as done
      await prisma.job.update({
        where: { id: job.id },
        data: { status: "done" },
      });

      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("Scrape error:", err);

      // ❌ Mark as failed
      await prisma.job.update({
        where: { id: job.id },
        data: { status: "failed" },
      });

      return NextResponse.json(
        { error: "Scrape failed" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Job creation error:", err);

    return NextResponse.json(
      { error: "Failed to start job" },
      { status: 500 }
    );
  }
}