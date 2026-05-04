import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

/* =========================
   PAYPAL TOKEN
========================= */
async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const secretKey = process.env.PAYPAL_SECRET!;

  const auth = Buffer.from(`${clientId}:${secretKey}`).toString("base64");

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
    console.error("PayPal token error:", data);
    throw new Error("Failed to get PayPal access token");
  }

  return data.access_token;
}

/* =========================
   CREATE PAYPAL ORDER
========================= */
export async function POST(req: Request) {
  try {
    /* 🔐 AUTH */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

    /* 📦 BODY */
    const { planId } = await req.json();

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    /* 💳 PAYPAL */
    const accessToken = await getAccessToken();

    const res = await fetch(
      "https://api-m.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",

          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: plan.price.toString(), // ✅ plan price
              },
              custom_id: `${userId}:${plan.id}`, // 🔥 important
            },
          ],

          application_context: {
            return_url: `${process.env.NEXT_PUBLIC_URL}/payment-success`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/products/invoice-recovery/account`,
          },
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("PayPal order error:", data);
      return NextResponse.json(
        { error: "Failed to create PayPal order" },
        { status: 500 }
      );
    }

    /* 🔥 SEND APPROVAL URL */
    return NextResponse.json(data);

  } catch (err) {
    console.error("CHECKOUT ERROR:", err);
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}