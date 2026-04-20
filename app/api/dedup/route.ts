import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ==============================
// 🚀 RUN DEDUP JOB
// ==============================
export async function POST() {
  try {
    // 🆕 Create job
    const job = await prisma.job.create({
      data: {
        type: "dedup",
        status: "running",
      },
    });

    try {
      // 👉 YOUR DEDUP LOGIC HERE
      // e.g. remove duplicates, merge leads, etc.

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
      console.error("Dedup error:", err);

      // ❌ Mark as failed
      await prisma.job.update({
        where: { id: job.id },
        data: { status: "failed" },
      });

      return NextResponse.json(
        { error: "Dedup failed" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Job creation error:", err);

    return NextResponse.json(
      { error: "Failed to start dedup job" },
      { status: 500 }
    );
  }
}