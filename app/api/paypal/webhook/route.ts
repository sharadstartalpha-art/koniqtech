import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const eventType = body.event_type;
    const resource = body.resource;

    const userId = resource?.custom_id;
    const teamId = resource?.invoice_id;
    const plan = resource?.plan_id || resource?.billing_plan_id;

    const PLAN_DATA: any = {
      STARTER: { credits: 1000, price: 10 },
      PRO: { credits: 5000, price: 29 },
      ENTERPRISE: { credits: 20000, price: 99 },
    };

    const selectedPlan = PLAN_DATA[plan];

    // ============================
    // 💳 ONE-TIME PAYMENT
    // ============================
    if (eventType === "PAYMENT.SALE.COMPLETED") {
      if (!selectedPlan) {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
      }

      // 🔥 CREDIT SYSTEM
      if (teamId) {
        await prisma.team.update({
          where: { id: teamId },
          data: {
            credits: { increment: selectedPlan.credits },
          },
        });
      } else {
        await prisma.user.update({
          where: { id: userId },
          data: {
            credits: { increment: selectedPlan.credits },
          },
        });
      }

      // 🧾 PAYMENT LOG
      await prisma.payment.create({
        data: {
          userId,
          amount: selectedPlan.price,
          status: "PAID",
        },
      });

      // 📊 TRANSACTION LOG
      await prisma.transaction.create({
        data: {
          userId,
          type: "PAYMENT",
          amount: selectedPlan.credits,
        },
      });

      // 🔁 SUBSCRIPTION
      await prisma.subscription.upsert({
        where: { userId },
        update: { status: "ACTIVE" },
        create: {
          user: { connect: { id: userId } },
          plan: { connect: { id: plan } }, // make sure plan exists
          status: "ACTIVE",
        },
      });
    }

    // ============================
    // 🔁 RENEWAL
    // ============================
    if (eventType === "BILLING.SUBSCRIPTION.RENEWED") {
      if (!selectedPlan) return NextResponse.json({ received: true });

      if (teamId) {
        await prisma.team.update({
          where: { id: teamId },
          data: {
            credits: { increment: selectedPlan.credits },
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}