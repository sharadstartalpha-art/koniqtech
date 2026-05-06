import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

export async function POST(req: Request) {
  try {
    /* =========================
       📥 1. INPUT
    ========================= */
    const body = await req.json();

    const {
      clientEmail,
      clientName,
      amount,
      dueDate,
      mode, // ✅ NEW
    } = body;

    if (!clientEmail || !amount || !dueDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* =========================
       🔐 2. AUTH
    ========================= */
    const cookieStore = await cookies();

    const token =
      cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(
      token,
      JWT_SECRET
    );

    const userId = payload.id as string;

    /* =========================
       🔍 3. PRODUCT
    ========================= */
    const product =
      await prisma.product.findUnique({
        where: {
          slug: "invoice-recovery",
        },
      });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 400 }
      );
    }

    /* =========================
       💳 4. SUBSCRIPTION
    ========================= */
    const sub =
      await prisma.subscription.findFirst({
        where: {
          userId,
          productId: product.id,
          status: {
            equals: "ACTIVE",
            mode: "insensitive",
          },
        },

        include: {
          plan: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    if (!sub) {
      return NextResponse.json(
        { error: "No active subscription" },
        { status: 403 }
      );
    }

    /* =========================
       📊 5. LIMIT CHECK
    ========================= */
    const limit =
      sub.plan?.invoiceLimit ?? null;

    const count = await prisma.invoice.count({
      where: {
        userId,
        productId: product.id,
      },
    });

    if (
      limit !== null &&
      limit !== -1 &&
      count >= limit
    ) {
      return NextResponse.json(
        { error: "Invoice limit reached" },
        { status: 403 }
      );
    }

    /* =========================
       💾 6. CREATE INVOICE
    ========================= */
    const invoice =
      await prisma.invoice.create({
        data: {
          userId,
          productId: product.id,

          clientEmail,
          clientName,

          amount: Number(amount),

          dueDate: new Date(dueDate),

          status: "UNPAID",

          // ✅ FIXED
          mode: mode || "manual",
        },
      });

    /* =========================
       💳 7. PAYMENT LINK
    ========================= */
    const paymentLink = `https://www.paypal.com/paypalme/koniqtech/${invoice.amount}?note=${invoice.id}`;

    const updatedInvoice =
      await prisma.invoice.update({
        where: {
          id: invoice.id,
        },

        data: {
          paymentLink,
        },
      });

    return NextResponse.json(
      updatedInvoice
    );

  } catch (error: any) {
    console.error(
      "CREATE INVOICE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to create invoice",
        details: error?.message || null,
      },
      { status: 500 }
    );
  }
}