import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// 🔐 VERIFY PAYPAL WEBHOOK
async function verifyWebhook(req: NextRequest, body: any) {
  const res = await fetch(
    "https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        transmission_id: req.headers.get("paypal-transmission-id"),
        transmission_time: req.headers.get("paypal-transmission-time"),
        cert_url: req.headers.get("paypal-cert-url"),
        auth_algo: req.headers.get("paypal-auth-algo"),
        transmission_sig: req.headers.get("paypal-transmission-sig"),
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: body,
      }),
    }
  );

  const data = await res.json();

  return data.verification_status === "SUCCESS";
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // 🔐 VERIFY
  const isValid = await verifyWebhook(req, body);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }

  try {
    const eventType = body.event_type;
    const resource = body.resource;

    const userId = resource.custom_id; // from PayPal
    const teamId = resource.invoice_id;

    // 🔥 PLAN CONFIG
    const PLAN_DATA: any = {
      STARTER: { credits: 1000 },
      PRO: { credits: 5000 },
      ENTERPRISE: { credits: 20000 },
    };

    const plan = resource.plan_id || "PRO"; // fallback

    const selectedPlan = PLAN_DATA[plan];

    // =============================
    // ✅ PAYMENT SUCCESS
    // =============================
    if (eventType === "PAYMENT.SALE.COMPLETED") {
      if (teamId) {
        await prisma.team.update({
          where: { id: teamId },
          data: {
            credits: {
              increment: selectedPlan.credits,
            },
          },
        });
      } else {
        await prisma.user.update({
          where: { id: userId },
          data: {
            credits: {
              increment: selectedPlan.credits,
            },
          },
        });
      }

      await prisma.payment.create({
        data: {
          userId,
          amount: Number(resource.amount?.total || 0),
          status: "PAID",
        },
      });
    }

    // =============================
    // 🔁 SUBSCRIPTION RENEWAL
    // =============================
    if (eventType === "BILLING.SUBSCRIPTION.RENEWED") {
      if (teamId) {
        await prisma.team.update({
          where: { id: teamId },
          data: {
            credits: {
              increment: selectedPlan.credits,
            },
          },
        });
      }
    }

    // =============================
    // ❌ PAYMENT FAILED
    // =============================
    if (eventType === "PAYMENT.SALE.DENIED") {
      await prisma.subscription.updateMany({
        where: { userId },
        data: {
          status: "PAST_DUE",
        },
      });
    }

    // =============================
    // ❌ CANCELLED
    // =============================
    if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
      await prisma.subscription.updateMany({
        where: { userId },
        data: {
          status: "CANCELLED",
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}