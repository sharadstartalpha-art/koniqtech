import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const PAYPAL_API = "https://api-m.sandbox.paypal.com";

export async function POST(req: Request) {
  try {
    const { paypalPlanId } = await req.json();

    // ✅ Get logged-in user (for webhook mapping)
    const cookieStore = await cookies();
    const userId = cookieStore.get("user")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!paypalPlanId) {
      return NextResponse.json(
        { error: "Missing plan id" },
        { status: 400 }
      );
    }

    /* =======================================================
       🔐 1. GET ACCESS TOKEN (REQUIRED)
    ======================================================= */
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

    /* =======================================================
       💳 2. CREATE SUBSCRIPTION
    ======================================================= */
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const subRes = await axios.post(
      `${PAYPAL_API}/v1/billing/subscriptions`,
      {
        plan_id: paypalPlanId,

        // 🔥 CRITICAL (used in webhook)
        custom_id: userId,

        application_context: {
          return_url: `${baseUrl}/success`,
          cancel_url: `${baseUrl}/products/invoice-recovery/subscribe`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // ✅ FIX
          "Content-Type": "application/json",
        },
      }
    );

    const approvalUrl = subRes.data.links.find(
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