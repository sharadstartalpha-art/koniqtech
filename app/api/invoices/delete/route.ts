import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  await prisma.invoice.delete({
    where: { id: body.id },
  });

  return NextResponse.json({ success: true });
}