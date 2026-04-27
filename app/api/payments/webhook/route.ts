import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("📩 PAYPAL WEBHOOK:", body.event_type);

    // ✅ Handle subscription activation
    if (body.event_type === "BILLING.SUBSCRIPTION.ACTIVATED") {
      const sub = body.resource;

      const userId = sub.custom_id; // 🔥 mapped from subscribe API
      const subscriptionId = sub.id;

      if (!userId) {
        console.error("❌ Missing custom_id");
        return NextResponse.json(
          { error: "Missing user mapping" },
          { status: 400 }
        );
      }

      // ✅ Prevent duplicate subscriptions
      const existing = await prisma.subscription.findFirst({
        where: {
          paypalSubscriptionId: subscriptionId,
        },
      });

      if (!existing) {
        await prisma.subscription.create({
          data: {
            userId,
            productId: "invoice-recovery", // 🔥 keep consistent
            paypalSubscriptionId: subscriptionId,
            status: "active",
          },
        });

        console.log("✅ Subscription created for user:", userId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);

    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 }
    );
  }
}