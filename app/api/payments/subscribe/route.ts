import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = await fetch(
      "https://api-m.sandbox.paypal.com/v1/billing/subscriptions",
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.PAYPAL_CLIENT_ID +
                ":" +
                process.env.PAYPAL_SECRET
            ).toString("base64"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_id: process.env.PAYPAL_PLAN_ID,
          application_context: {
            return_url: "https://koniqtech.com/success",
            cancel_url: "https://koniqtech.com/dashboard",
          },
        }),
      }
    );

    const data = await res.json();

    console.log("PAYPAL RESPONSE:", data);

    const approveLink = data.links?.find(
      (l: any) => l.rel === "approve"
    );

    if (!approveLink) {
      return NextResponse.json(
        { error: "No approval URL" },
        { status: 400 }
      );
    }

    return NextResponse.json({ url: approveLink.href });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Payment failed" });
  }
}