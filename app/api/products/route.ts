import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* GET PRODUCTS */
export async function GET() {
  try {
    const products = await prisma.product.findMany();

    return NextResponse.json(products);
  } catch (error) {
    console.error("PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}