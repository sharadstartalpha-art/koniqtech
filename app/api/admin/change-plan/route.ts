import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, planId } = await req.json();

    if (!userId || !planId) {
      return NextResponse.json(
        { error: "Missing userId or planId" },
        { status: 400 }
      );
    }

    /* =========================
       1. FIND ACTIVE SUB
    ========================= */
    const existing = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    /* =========================
       2. UPDATE PLAN
    ========================= */
    await prisma.subscription.update({
      where: {
        id: existing.id,
      },
      data: {
        planId, // ✅ THIS IS KEY
        expiresAt: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ), // reset expiry
      },
    });

    return NextResponse.json({
      success: true,
      message: "Plan updated",
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update plan" },
      { status: 500 }
    );
  }
}