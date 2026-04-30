import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* 📦 GET ALL PRODUCTS */
export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      plans: true, // 🔥 include plans now
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(products);
}

/* ➕ CREATE PRODUCT */
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Name required" },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    // ✅ Create product ONLY
    const product = await prisma.product.create({
      data: {
        name,
        slug,
      },
    });

    // 🔥 OPTIONAL: create default FREE plan
    await prisma.plan.create({
      data: {
        name: "Free",
        price: 0,
        invoiceLimit: -1,
        productId: product.id,
      },
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

    // 🔥 delete plans first (important for FK)
    await prisma.plan.deleteMany({
      where: { productId: id },
    });

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