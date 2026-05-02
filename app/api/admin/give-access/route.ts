import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, productId, planId } = await req.json();

    if (!userId || !productId || !planId) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    /* =========================
       1. FIND PRODUCT
    ========================= */
    const product = await prisma.product.findUnique({
      where: { slug: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    /* =========================
       2. FIND ACTIVE SUB
    ========================= */
    const existing = await prisma.subscription.findFirst({
      where: {
        userId,
        productId: product.id,
        status: "ACTIVE",
      },
    });

    /* =========================
       3. UPDATE OR CREATE
    ========================= */
    if (existing) {
      // 🔁 CHANGE PLAN
      await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          planId, // ✅ USE SELECTED PLAN
          expiresAt: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ),
        },
      });
    } else {
      // ✅ NEW ACCESS
      await prisma.subscription.create({
        data: {
          userId,
          productId: product.id,
          planId, // ✅ USE SELECTED PLAN
          paypalSubscriptionId: `manual-${Date.now()}`,
          status: "ACTIVE",
          expiresAt: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Plan updated",
    });

  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}