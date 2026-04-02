import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { name, slug } = await req.json()

  const product = await prisma.product.create({
    data: { name, slug },
  })

  return NextResponse.json(product)
}