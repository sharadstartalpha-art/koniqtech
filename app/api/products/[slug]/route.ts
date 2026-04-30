import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> } // ✅ FIXED
) {
  const { slug } = await context.params; // ✅ MUST await

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      plans: true,
    },
  });

  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}