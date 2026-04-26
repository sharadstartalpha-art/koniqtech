import { getAccessToken } from "@/lib/paypal";
import { NextResponse } from "next/server";

export async function POST() {
  const token = await getAccessToken();

  const res = await fetch(
    "https://api-m.sandbox.paypal.com/v1/billing/subscriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: process.env.PAYPAL_PLAN_ID,
      }),
    }
  );

  const data = await res.json();

  return NextResponse.json({
    url: data.links.find((l: any) => l.rel === "approve").href,
  });
}