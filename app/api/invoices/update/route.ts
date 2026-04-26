import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const invoice = await prisma.invoice.update({
    where: { id: body.id },
    data: {
      status: body.status,
    },
  });

  return NextResponse.json(invoice);
}