import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "Missing userId or productId" },
        { status: 400 }
      );
    }

    // 🔥 Find product by slug
    const product = await prisma.product.findUnique({
      where: { slug: productId },
      include: { plans: true }, // 👈 include plans
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // 🔥 Pick a plan (e.g. first / default)
    const plan = product.plans[0];

    if (!plan) {
      return NextResponse.json(
        { error: "No plan found for this product" },
        { status: 400 }
      );
    }

    // 🔥 Prevent duplicate subscription
    const existing = await prisma.subscription.findFirst({
      where: {
        userId,
        productId: product.id,
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Already has access",
      });
    }

    // ✅ Create subscription (NOW includes planId)
    await prisma.subscription.create({
      data: {
        userId,
        productId: product.id,
        planId: plan.id, // ✅ REQUIRED FIX
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("GIVE ACCESS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to grant access" },
      { status: 500 }
    );
  }
}