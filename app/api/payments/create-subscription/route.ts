import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const PAYPAL_API = "https://api-m.sandbox.paypal.com";
//const PAYPAL_API = "https://api-m.paypal.com"; // 🔥 use sandbox if testing
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  try {
    const { paypalPlanId, planId, productId } = await req.json();

   if (!paypalPlanId || !planId || !productId) {
      return NextResponse.json(
        { error: "Missing plan data" },
        { status: 400 }
      );
    }

    /* =========================
       🔐 AUTH (JWT)
    ========================= */
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

    /* =========================
       🔑 1. GET ACCESS TOKEN
    ========================= */
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

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
       💳 2. CREATE SUBSCRIPTION
    ========================= */
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const subRes = await axios.post(
      `${PAYPAL_API}/v1/billing/subscriptions`,
      {
        plan_id: paypalPlanId,
        custom_id: userId, // 🔥 CRITICAL
        application_context: {
          return_url: `${baseUrl}/success`,
          cancel_url: `${baseUrl}/products/invoice-recovery/subscribe`,
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
       🧠 3. SAVE TO DATABASE
    ========================= */
    await prisma.subscription.create({
      data: {
        userId,
        planId, // from frontend
        productId,
        paypalSubscriptionId, // 🔥 VERY IMPORTANT
        status: "PENDING",
      },
    });

    /* =========================
       🔗 4. GET APPROVAL URL
    ========================= */
    const approvalUrl = subRes.data.links?.find(
      (l: any) => l.rel === "approve"
    )?.href;

    if (!approvalUrl) {
      return NextResponse.json(
        { error: "No approval URL" },
        { status: 400 }
      );
    }

    return NextResponse.json({ approvalUrl });

  } catch (err: any) {
    console.error("PAYPAL CREATE ERROR:", err?.response?.data || err);

    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}