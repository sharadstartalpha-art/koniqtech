import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { planId } = await req.json();

    // 🔍 Get plan from DB
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // 🔐 PayPal API call
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    // 1️⃣ Get access token
    const tokenRes = await fetch(
      "https://api-m.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2️⃣ Create order
    const orderRes = await fetch(
      "https://api-m.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: plan.price.toString(),
              },
              custom_id: plan.id, // 🔥 THIS IS CRITICAL
            },
          ],
          application_context: {
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
          },
        }),
      }
    );

    const orderData = await orderRes.json();

    return NextResponse.json(orderData);
  } catch (error) {
    console.error("PAYPAL CHECKOUT ERROR:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}