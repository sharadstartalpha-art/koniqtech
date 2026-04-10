import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { planId } = await req.json();

  const planMap: any = {
    starter: "P-XXXXXXXX", // 🔥 PayPal Plan ID
    pro: "P-YYYYYYYY",
    enterprise: "P-ZZZZZZZ",
  };

  const paypalPlanId = planMap[planId];

  const res = await fetch(
    "https://api-m.sandbox.paypal.com/v1/billing/subscriptions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        plan_id: paypalPlanId,
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paypal/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        },
      }),
    }
  );

  const data = await res.json();

  return NextResponse.json({
    approveUrl: data.links.find((l: any) => l.rel === "approve").href,
  });
}