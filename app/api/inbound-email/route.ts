import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const content = body.text || "";

    // 📧 Extract email
    const emailMatch = content.match(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
    );

    // 💰 Extract amount
    const amountMatch = content.match(/\$?(\d+)/);

    if (!emailMatch || !amountMatch) {
      return NextResponse.json(
        { error: "Invalid email content" },
        { status: 400 }
      );
    }

    const clientEmail = emailMatch[0];
    const amount = Number(amountMatch[1]);

    // 🔥 GET PRODUCT (VERY IMPORTANT FIX)
    const product = await prisma.product.findFirst({
      where: { slug: "invoice-recovery" },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 500 }
      );
    }

    // ⚠️ TEMP: assign to first user (replace later with real logic)
    const user = await prisma.user.findFirst();

    if (!user) {
      return NextResponse.json(
        { error: "No user found" },
        { status: 500 }
      );
    }

    // 📅 Default due date (3 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    // ✅ CREATE INVOICE
    const invoice = await prisma.invoice.create({
      data: {
        userId: user.id,
        productId: product.id, // ✅ FIXED (REAL FK)
        clientEmail,
        clientName: "",
        amount,
        dueDate,
        status: "unpaid",
        paymentLink: `https://paypal.me/YOURNAME/${amount}`,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("❌ INBOUND EMAIL ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}