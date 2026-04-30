import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      plans: true, // 🔥 include plans
    },
  });

  return NextResponse.json(products);
}