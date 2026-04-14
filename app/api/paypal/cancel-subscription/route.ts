import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { subscriptionId } = await req.json();

  await fetch(`https://api-m.paypal.com/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
    },
  });

  return NextResponse.json({ success: true });
}