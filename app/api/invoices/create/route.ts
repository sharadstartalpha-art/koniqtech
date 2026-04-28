import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔐 Get logged-in user (JWT cookie)
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🧾 Validate input
    const { clientEmail, amount, dueDate } = body;

    if (!clientEmail || !amount || !dueDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 📦 Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        userId: user.id,
        productId: "invoice-recovery",
        clientEmail,
        clientName: "",
        amount: Number(amount),
        dueDate: new Date(dueDate),
        status: "unpaid",
      },
    });

    // 💳 Generate payment link
    const paymentLink = `https://www.paypal.com/paypalme/koniqtech/${invoice.amount}?note=${invoice.id}`;

    // 🔄 Update invoice with payment link
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoice.id },
      data: { paymentLink },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("❌ CREATE INVOICE ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}