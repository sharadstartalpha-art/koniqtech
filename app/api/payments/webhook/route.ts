import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  if (body.event_type === "BILLING.SUBSCRIPTION.ACTIVATED") {
    const subId = body.resource.id;

    await prisma.subscription.create({
      data: {
        userId: "TEMP_USER_ID",
        productId: "TEMP_PRODUCT_ID",
        paypalSubscriptionId: subId,
        status: "active",
      },
    });
  }

  return NextResponse.json({ received: true });
}