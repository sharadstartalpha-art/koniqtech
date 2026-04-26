import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const invoice = await prisma.invoice.create({
    data: {
      userId: body.userId,
      productId: body.productId,
      clientEmail: body.clientEmail,
      clientName: body.clientName,
      amount: body.amount,
      dueDate: new Date(body.dueDate),
      status: "unpaid",
    },
  });

  return NextResponse.json(invoice);
}