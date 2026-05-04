import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* =========================
   PAYPAL ACCESS TOKEN
========================= */
async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_SECRET!;

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(
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

  const data = await res.json();

  if (!data.access_token) {
    console.error("❌ PayPal token error:", data);
    throw new Error("Failed to get PayPal access token");
  }

  return data.access_token;
}

/* =========================
   CAPTURE PAYMENT
========================= */
export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    /* 🔐 GET TOKEN */
    const accessToken = await getAccessToken();

    /* 💳 CAPTURE */
    const res = await fetch(
      `https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Capture error:", data);
      return NextResponse.json(
        { error: "Capture failed" },
        { status: 500 }
      );
    }

    /* =========================
       EXTRACT METADATA
    ========================= */
    const capture =
      data.purchase_units?.[0]?.payments?.captures?.[0];

    const custom = capture?.custom_id;

    if (!custom) {
      return NextResponse.json(
        { error: "Missing custom_id" },
        { status: 400 }
      );
    }

    const [userId, planId] = custom.split(":");

    if (!userId || !planId) {
      return NextResponse.json(
        { error: "Invalid custom_id" },
        { status: 400 }
      );
    }

    /* =========================
       CANCEL OLD
    ========================= */
    await prisma.subscription.updateMany({
      where: {
        userId,
        status: "ACTIVE",
      },
      data: {
        status: "CANCELLED",
      },
    });

    /* =========================
       CREATE NEW SUB
    ========================= */
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.subscription.create({
      data: {
        userId,
        planId: plan.id,
        productId: plan.productId,
        status: "ACTIVE",
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (err) {
    console.error("❌ CAPTURE ERROR:", err);

    return NextResponse.json(
      { error: "Capture error" },
      { status: 500 }
    );
  }
}