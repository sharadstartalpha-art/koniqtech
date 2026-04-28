import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* 📦 GET ALL PRODUCTS */
export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

/* ➕ CREATE PRODUCT */
export async function POST(req: Request) {
  const { name, price } = await req.json();

  if (!name || !price) {
    return NextResponse.json(
      { error: "Name and price required" },
      { status: 400 }
    );
  }

  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const product = await prisma.product.create({
    data: {
      name,
      price: Number(price),
      slug,
    },
  });

  return NextResponse.json(product);
}

/* ❌ DELETE PRODUCT */
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing id" },
      { status: 400 }
    );
  }

  await prisma.product.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}