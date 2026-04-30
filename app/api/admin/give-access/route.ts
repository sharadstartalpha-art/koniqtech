import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "Missing userId or productId" },
        { status: 400 }
      );
    }

    // ✅ Find product by slug
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

    // ✅ Pick default plan (FREE or first plan)
    const defaultPlan =
      product.plans.find((p) => p.price === 0) || product.plans[0];

    if (!defaultPlan) {
      return NextResponse.json(
        { error: "No plan found for this product" },
        { status: 400 }
      );
    }

    // ✅ Prevent duplicate subscription
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

    // ✅ Create subscription (FIXED 🔥)
    await prisma.subscription.create({
      data: {
        userId,
        productId: product.id,
        planId: defaultPlan.id, // ⭐ REQUIRED FIX
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