import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id } = await req.json();

  const invoice = await prisma.invoice.update({
    where: { id },
    data: {
      status: "paid",
      paidAt: new Date(),
    },
  });

  return NextResponse.json(invoice);
}