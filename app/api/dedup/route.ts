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
        query: "dedup", // ✅ REQUIRED FIX
        logs: "Starting dedup...",
        progress: 10,
      },
    });

    try {
      // ==============================
      // 🧹 YOUR DEDUP LOGIC HERE
      // ==============================

      await new Promise((r) => setTimeout(r, 1500));

      await prisma.job.update({
        where: { id: job.id },
        data: {
          progress: 70,
          logs: "Processing duplicates...",
        },
      });

      await new Promise((r) => setTimeout(r, 1500));

      // ==============================
      // ✅ DONE
      // ==============================
      await prisma.job.update({
        where: { id: job.id },
        data: {
          status: "done",
          progress: 100,
          logs: "Dedup completed ✅",
        },
      });

      return NextResponse.json({
        success: true,
        jobId: job.id,
      });

    } catch (err) {
      console.error("❌ Dedup error:", err);

      await prisma.job.update({
        where: { id: job.id },
        data: {
          status: "failed",
          logs: "Dedup failed ❌",
        },
      });

      return NextResponse.json(
        { error: "Dedup failed" },
        { status: 500 }
      );
    }

  } catch (err) {
    console.error("❌ Job creation error:", err);

    return NextResponse.json(
      { error: "Failed to start dedup job" },
      { status: 500 }
    );
  }
}