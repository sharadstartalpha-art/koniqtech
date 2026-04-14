import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// GET → all products
export async function GET() {
  const products = await prisma.product.findMany();

  return NextResponse.json(products);
}

// POST → create product
export async function POST(req: Request) {
  const body = await req.json();

  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug: body.slug,
      price: body.price,
    },
  });

  return NextResponse.json(product);
}