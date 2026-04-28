import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ GET USER FROM COOKIE
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ VALIDATION
    if (!body.clientEmail || !body.amount || !body.dueDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ CREATE INVOICE
    const invoice = await prisma.invoice.create({
      data: {
        userId: user.id,
        productId: "invoice-recovery",
        clientEmail: body.clientEmail,
        clientName: "",
        amount: Number(body.amount),
        dueDate: new Date(body.dueDate),
        status: "unpaid",
      },
    });

    // ✅ PAYMENT LINK
    const paymentLink = `https://www.paypal.com/paypalme/koniqtech/${invoice.amount}?note=${invoice.id}`;

    const updated = await prisma.invoice.update({
      where: { id: invoice.id },
      data: { paymentLink },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("CREATE INVOICE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}