import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 👉 PayPal event
    const eventType = body.event_type;

    if (eventType === "CHECKOUT.ORDER.APPROVED") {
      const email =
        body.resource?.payer?.email_address || "unknown@user.com";

      const amount = body.resource?.purchase_units?.[0]?.amount?.value;

      // 🎯 MAP PLAN → CREDITS
      let credits = 0;

      if (amount == "10") credits = 1000;
      if (amount == "29") credits = 5000;
      if (amount == "99") credits = 20000;

      // ✅ FIND USER
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            credits: {
              increment: credits,
            },
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook Error", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}