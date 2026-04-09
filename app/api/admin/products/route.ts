import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ✅ GET PRODUCTS
export async function GET() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const products = await prisma.product.findMany();

  return NextResponse.json(products);
}

// ✅ CREATE PRODUCT
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { name, slug } = await req.json();

  const product = await prisma.product.create({
  data: {
    name,
    slug,
    price: 10, // ✅ REQUIRED
  },
});

  return NextResponse.json(product);
}