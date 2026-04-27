import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await prisma.product.findMany();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { name, price } = await req.json();

  const product = await prisma.product.create({
    data: {
      name,
      price,
      slug: name.toLowerCase().replace(/\s/g, "-"),
    },
  });

  return NextResponse.json(product);
}