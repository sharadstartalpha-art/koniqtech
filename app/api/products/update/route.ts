import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id, name, price } = await req.json();

  await prisma.product.update({
    where: { id },
    data: { name, price },
  });

  return NextResponse.json({ success: true });
}