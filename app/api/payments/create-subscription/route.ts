import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const PAYPAL_API = "https://api-m.paypal.com";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  try {
    /* =========================
       📥 1. INPUT VALIDATION
    ========================= */
    const body = await req.json();

    const { paypalPlanId, planId, productId } = body;

    if (!paypalPlanId || !planId || !productId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* =========================
       🔐 2. AUTH (JWT)
    ========================= */
    const cookieStore = await cookies(); // ✅ FIXED
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id as string;

    /* =========================
       🔑 3. PAYPAL ACCESS TOKEN
    ========================= */
    const clientId = process.env.PAYPAL_CLIENT_ID!;
    const secret = process.env.PAYPAL_SECRET!;

    if (!clientId || !secret) {
      throw new Error("Missing PayPal credentials");
    }

    const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

    const tokenRes = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    /* =========================
       💳 4. CREATE SUBSCRIPTION
    ========================= */
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      throw new Error("Missing NEXT_PUBLIC_BASE_URL");
    }

    const subRes = await axios.post(
      `${PAYPAL_API}/v1/billing/subscriptions`,
      {
        plan_id: paypalPlanId,
        custom_id: userId,
        application_context: {
          brand_name: "KoniqTech",
          return_url: `${baseUrl}/success`,
          cancel_url: `${baseUrl}/products/invoice-recovery/subscribe`,
          user_action: "SUBSCRIBE_NOW",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paypalSubscriptionId = subRes.data.id;

    /* =========================
       🧠 5. SAVE TO DATABASE
    ========================= */
    await prisma.subscription.create({
      data: {
        userId,
        planId,
        productId,
        paypalSubscriptionId,
        status: "PENDING",
      },
    });

    /* =========================
       🔗 6. APPROVAL URL
    ========================= */
    const approvalUrl = subRes.data.links?.find(
      (l: any) => l.rel === "approve"
    )?.href;

    if (!approvalUrl) {
      return NextResponse.json(
        { error: "Approval URL not found" },
        { status: 400 }
      );
    }

    return NextResponse.json({ approvalUrl });

  } catch (err: any) {
    console.error(
      "🔥 PAYPAL CREATE ERROR:",
      err?.response?.data || err.message || err
    );

    return NextResponse.json(
      {
        error: "Failed to create subscription",
        details: err?.response?.data || null,
      },
      { status: 500 }
    );
  }
}