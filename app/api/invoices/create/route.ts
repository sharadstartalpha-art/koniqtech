import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔐 AUTH
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

    const { clientEmail, amount, dueDate } = body;

    if (!clientEmail || !amount || !dueDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ PRODUCT
    const product = await prisma.product.findUnique({
      where: { slug: "invoice-recovery" },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 400 }
      );
    }

    // 🔥 SUBSCRIPTION + PLAN
    const sub = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: "desc", // ✅ always latest
      },
    });

    if (!sub) {
      return NextResponse.json(
        { error: "No active subscription" },
        { status: 403 }
      );
    }

    const limit = sub.plan.invoiceLimit;

    const count = await prisma.invoice.count({
      where: { userId },
    });

    if (limit !== null && count >= limit) {
      return NextResponse.json(
        { error: "Invoice limit reached" },
        { status: 403 }
      );
    }

    // ✅ CREATE INVOICE
    const invoice = await prisma.invoice.create({
      data: {
        userId,
        productId: product.id,
        clientEmail,
        clientName: "",
        amount: Number(amount),
        dueDate: new Date(dueDate),
        status: "UNPAID",
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
    console.error("CREATE INVOICE ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}