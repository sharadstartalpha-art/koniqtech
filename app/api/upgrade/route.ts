import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  try {
    /* =========================
       🔐 AUTH
    ========================= */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

    /* =========================
       📥 BODY
    ========================= */
    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json(
        { error: "Plan required" },
        { status: 400 }
      );
    }

    /* =========================
       📦 GET PLAN (IMPORTANT)
    ========================= */
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    /* =========================
       ❌ CANCEL OLD
    ========================= */
    await prisma.subscription.updateMany({
      where: {
        userId,
        status: "ACTIVE",
      },
      data: {
        status: "CANCELLED",
      },
    });

    /* =========================
       ✅ CREATE NEW SUB
    ========================= */
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.subscription.create({
      data: {
        userId,
        planId: plan.id,
        productId: plan.productId, // ✅ FIX HERE
        status: "ACTIVE",
        expiresAt,
      },
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("UPGRADE ERROR:", err);

    return NextResponse.json(
      { error: "Upgrade failed" },
      { status: 500 }
    );
  }
}