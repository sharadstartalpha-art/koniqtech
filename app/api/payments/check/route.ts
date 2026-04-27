import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { invoiceId } = await req.json();

  // simulate detection (later real PayPal API)
  const invoice = await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status: "paid",
      paidAt: new Date(),
    },
  });

  return NextResponse.json(invoice);
}