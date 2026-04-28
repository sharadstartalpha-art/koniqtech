import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔐 GET TOKEN
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔐 VERIFY JWT
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

    // 📦 VALIDATION
    const { clientEmail, amount, dueDate } = body;

    if (!clientEmail || !amount || !dueDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ GET PRODUCT BY SLUG (IMPORTANT FIX)
    const product = await prisma.product.findFirst({
      where: { slug: "invoice-recovery" },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 400 }
      );
    }

    // ✅ CREATE INVOICE
    const invoice = await prisma.invoice.create({
      data: {
        userId,
        productId: product.id, // ✅ FIXED
        clientEmail,
        clientName: "",
        amount: Number(amount),
        dueDate: new Date(dueDate),
        status: "unpaid",
      },
    });

    // 💳 PAYMENT LINK
    const paymentLink = `https://www.paypal.com/paypalme/koniqtech/${invoice.amount}?note=${invoice.id}`;

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