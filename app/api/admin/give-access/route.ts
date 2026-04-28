import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, productId } = await req.json();

  await prisma.subscription.create({
    data: {
      userId,
      productId,
      status: "active",
    },
  });

  return NextResponse.json({ success: true });
}