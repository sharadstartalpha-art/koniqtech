import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("WEBHOOK EVENT:", body.event_type);

    const eventType = body.event_type;

    /* =========================
       SUBSCRIPTION ACTIVATED
    ========================= */
    if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
      const subscriptionId = body.resource.id;
      const userId = body.resource.custom_id;

      console.log("ACTIVATED:", subscriptionId, userId);

      await prisma.subscription.updateMany({
        where: {
          paypalSubscriptionId: subscriptionId,
          userId,
        },
        data: {
          status: "ACTIVE",
        },
      });
    }

    /* =========================
       SUBSCRIPTION CANCELLED
    ========================= */
    if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
      const subscriptionId = body.resource.id;

      await prisma.subscription.updateMany({
        where: {
          paypalSubscriptionId: subscriptionId,
        },
        data: {
          status: "CANCELLED",
        },
      });
    }

    return NextResponse.json({ received: true });

  } catch (err) {
    console.error("WEBHOOK ERROR:", err);

    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 }
    );
  }
}