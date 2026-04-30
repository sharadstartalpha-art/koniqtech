import { NextResponse } from "next/server";
import axios from "axios";
import { prisma } from "@/lib/prisma";

//const PAYPAL_API = "https://api-m.paypal.com";
const PAYPAL_API = "https://api-m.sandbox.paypal.com";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subscriptionId = searchParams.get("subscriptionId");

  if (!subscriptionId) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    // Get access token
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

    // Get subscription status
    const subRes = await axios.get(
      `${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const status = subRes.data.status;

    if (status === "ACTIVE") {
      await prisma.subscription.updateMany({
        where: {
          paypalSubscriptionId: subscriptionId,
        },
        data: {
          status: "ACTIVE",
        },
      });
    }

    return NextResponse.json({ status });

  } catch (err) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}