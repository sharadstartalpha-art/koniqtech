import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust if your path differs

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Get logged-in user
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // ✅ Validate input
    if (!body.clientEmail || !body.amount || !body.dueDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Step 1: create invoice (no payment link yet)
    const invoice = await prisma.invoice.create({
      data: {
        userId,
        productId: "invoice-recovery", // keep fixed for this SaaS
        clientEmail: body.clientEmail,
        clientName: body.clientName || "",
        amount: Number(body.amount),
        dueDate: new Date(body.dueDate),
        status: "unpaid",
      },
    });

    // ✅ Step 2: generate PayPal link with invoiceId
    const paymentLink = `https://www.paypal.com/paypalme/koniqtech/${invoice.amount}?note=${invoice.id}`;

    // ✅ Step 3: update invoice
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoice.id },
      data: { paymentLink },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("❌ CREATE INVOICE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}