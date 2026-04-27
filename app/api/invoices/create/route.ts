import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Generate PayPal payment link
    const paymentLink = `https://www.paypal.com/paypalme/koniqtech/${body.amount}`;

    const invoice = await prisma.invoice.create({
      data: {
        userId: body.userId,
        productId: body.productId,
        clientEmail: body.clientEmail,
        clientName: body.clientName,
        amount: body.amount,
        dueDate: new Date(body.dueDate),
        status: "unpaid",
        paymentLink, // ✅ ADDED HERE
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("CREATE INVOICE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}