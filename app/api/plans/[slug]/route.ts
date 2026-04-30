import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // ✅ Await params (required in latest Next.js)
    const { slug } = await context.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: { plans: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product.plans);

  } catch (err) {
    console.error("GET PLANS ERROR:", err);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}