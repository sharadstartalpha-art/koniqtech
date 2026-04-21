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
        query: "enrich", // ✅ REQUIRED FIX
        logs: "Starting enrichment...",
        progress: 10,
      },
    });

    try {
      // 👉 simulate work
      await new Promise((r) => setTimeout(r, 1500));

      await prisma.job.update({
        where: { id: job.id },
        data: {
          progress: 60,
          logs: "Enriching leads...",
        },
      });

      await new Promise((r) => setTimeout(r, 1500));

      // ✅ DONE
      await prisma.job.update({
        where: { id: job.id },
        data: {
          status: "done",
          progress: 100,
          logs: "Enrichment completed ✅",
        },
      });

      return NextResponse.json({
        success: true,
        jobId: job.id,
      });

    } catch (err) {
      console.error("❌ Enrich error:", err);

      await prisma.job.update({
        where: { id: job.id },
        data: {
          status: "failed",
          logs: "Enrichment failed ❌",
        },
      });

      return NextResponse.json(
        { error: "Enrich failed" },
        { status: 500 }
      );
    }

  } catch (err) {
    console.error("❌ Job creation error:", err);

    return NextResponse.json(
      { error: "Failed to start enrich job" },
      { status: 500 }
    );
  }
}