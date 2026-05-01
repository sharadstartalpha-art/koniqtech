import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    /* =========================
       📥 1. PARSE BODY
    ========================= */
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "Missing userId or productId" },
        { status: 400 }
      );
    }

    /* =========================
       🔍 2. FIND PRODUCT (by slug)
    ========================= */
    const product = await prisma.product.findUnique({
      where: { slug: productId },
      include: { plans: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (!product.plans || product.plans.length === 0) {
      return NextResponse.json(
        { error: "No plans found for this product" },
        { status: 400 }
      );
    }

    // 👉 Pick default plan (first one)
    const plan = product.plans[0];

    /* =========================
       🚫 3. PREVENT DUPLICATES
    ========================= */
    const existing = await prisma.subscription.findFirst({
      where: {
        userId,
        productId: product.id,
        status: "ACTIVE", // ✅ only block if already active
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "User already has access",
      });
    }

    /* =========================
       ✅ 4. CREATE SUBSCRIPTION
    ========================= */
    await prisma.subscription.create({
      data: {
        userId,
        productId: product.id,
        planId: plan.id,
        paypalSubscriptionId: `manual-${Date.now()}`, // ✅ required for consistency
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Access granted",
    });

  } catch (error: any) {
    console.error("GIVE ACCESS ERROR:", error?.message || error);

    return NextResponse.json(
      { error: "Failed to grant access" },
      { status: 500 }
    );
  }
}