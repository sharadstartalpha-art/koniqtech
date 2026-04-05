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
    const planId = resource?.custom_id; // ✅ ONLY SOURCE OF TRUTH

    if (!email || !planId) {
      return NextResponse.json(
        { error: "Missing email or planId" },
        { status: 400 }
      );
    }

    // 👤 Find user
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

    // 🔥 Fetch plan (ONLY THIS — no duplicate!)
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // 💳 Add balance
    if (user.balance) {
      await prisma.userBalance.update({
        where: { userId: user.id },
        data: {
          balance: {
            increment: plan.balance,
          },
        },
      });
    } else {
      await prisma.userBalance.create({
        data: {
          userId: user.id,
          balance: plan.balance,
        },
      });
    }

    // 🧾 Create transaction
    await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: plan.price,
        balance: plan.balance,
        type: "CREDIT_PURCHASE",
        status: "SUCCESS",
        provider: "paypal",
      },
    });

    // 📦 Update subscription
    await prisma.subscription.upsert({
      where: {
        userId_planId: {
          userId: user.id,
          planId: plan.id,
        },
      },
      update: {
        status: "ACTIVE",
      },
      create: {
        userId: user.id,
        planId: plan.id,
        status: "ACTIVE",
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