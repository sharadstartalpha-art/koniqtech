import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Step 1: create invoice FIRST (no payment link yet)
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

    // ✅ Step 2: generate unique PayPal link with invoiceId
    const paymentLink = `https://www.paypal.com/paypalme/koniqtech/${invoice.amount}?note=${invoice.id}`;

    // ✅ Step 3: update invoice with payment link
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoice.id },
      data: { paymentLink },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("CREATE INVOICE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}