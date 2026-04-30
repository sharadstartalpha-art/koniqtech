import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* 📦 GET ALL PRODUCTS */
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
    include: { plans: true }, // 👈 optional but useful
  });

  return NextResponse.json(products);
}

/* ➕ CREATE PRODUCT + DEFAULT PLAN */
export async function POST(req: Request) {
  try {
    const { name, price, invoiceLimit } = await req.json();

    if (!name || !price) {
      return NextResponse.json(
        { error: "Name and price required" },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    // ✅ Create product + plan together
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        plans: {
          create: [
            {
              name: "Default", // or "Pro"
              price: Number(price),
              invoiceLimit: invoiceLimit
                ? Number(invoiceLimit)
                : null,
            },
          ],
        },
      },
      include: { plans: true },
    });

    return NextResponse.json(product);

  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

/* ❌ DELETE PRODUCT */
export async function DELETE(req: Request) {
  try {
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

  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}