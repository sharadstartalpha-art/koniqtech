import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
      return NextResponse.json({ ok: true });
    }

    const resource = body.resource;

    const email = resource?.payer?.email_address;
    const planId = resource?.custom_id;

    if (!email || !planId) {
      return NextResponse.json(
        { error: "Missing email or planId" },
        { status: 400 }
      );
    }

    // 👤 user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { balance: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 📦 product = plan
    const plan = await prisma.product.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // 💰 Add credits (use amount)
    if (user.balance) {
      await prisma.balance.update({
        where: { userId: user.id },
        data: {
          amount: {
            increment: plan.price, // or credits if you add later
          },
        },
      });
    } else {
      await prisma.balance.create({
        data: {
          userId: user.id,
          amount: plan.price,
        },
      });
    }

    // 🧾 transaction
    await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: plan.price,
        type: "CREDIT_PURCHASE",
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("PAYPAL WEBHOOK ERROR:", error);

    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 }
    );
  }
}