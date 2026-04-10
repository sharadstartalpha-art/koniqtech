import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { planId } = await req.json();

  // Map plan → price
  const prices: any = {
    starter: 10,
    pro: 29,
  };

  const price = prices[planId];

  const res = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
        ).toString("base64"),
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: price.toString(),
          },
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/paypal/capture`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      },
    }),
  });

  const data = await res.json();

  const approveUrl = data.links.find((l: any) => l.rel === "approve").href;

  return NextResponse.json({ approveUrl });
}