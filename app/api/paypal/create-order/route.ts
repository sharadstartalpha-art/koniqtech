import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { plan } = await req.json();

  const prices: any = {
    STARTER: "10.00",
    PRO: "29.00",
    ENTERPRISE: "99.00",
  };

  const price = prices[plan];

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

          // 🔥 IMPORTANT (used in webhook)
          custom_id: "USER_ID_HERE",
          invoice_id: "TEAM_ID_HERE",
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paypal/success?plan=${plan}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      },
    }),
  });

  const data = await order.json();

  return NextResponse.json({
    approveUrl: data.links.find((l: any) => l.rel === "approve").href,
  });
}