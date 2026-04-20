import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ==============================
// 🚀 RUN ENRICH JOB
// ==============================
export async function POST() {
  try {
    // 🆕 Create job
    const job = await prisma.job.create({
      data: {
        type: "enrich",
        status: "running",
      },
    });

    try {
      // 👉 YOUR ENRICH LOGIC HERE
      // e.g. enrich leads, fetch extra data, etc.

      // ✅ Mark as done
      await prisma.job.update({
        where: { id: job.id },
        data: { status: "done" },
      });

      return NextResponse.json({
        success: true,
        jobId: job.id,
      });
    } catch (err) {
      console.error("Enrich error:", err);

      // ❌ Mark as failed
      await prisma.job.update({
        where: { id: job.id },
        data: { status: "failed" },
      });

      return NextResponse.json(
        { error: "Enrich failed" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Job creation error:", err);

    return NextResponse.json(
      { error: "Failed to start enrich job" },
      { status: 500 }
    );
  }
}