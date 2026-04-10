import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { planId } = await req.json();

  const prices: any = {
    starter: "10.00",
    pro: "29.00",
  };

  const price = prices[planId];

  // 🔥 attach planId in return URL
  const order = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: "USD", value: price },
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paypal/success?planId=${planId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      },
    }),
  });

  const data = await order.json();

  return NextResponse.json({
    approveUrl: data.links.find((l: any) => l.rel === "approve").href,
  });
}