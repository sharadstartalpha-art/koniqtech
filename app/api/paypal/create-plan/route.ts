import { NextResponse } from "next/server";

export async function POST() {
  const res = await fetch("https://api-m.sandbox.paypal.com/v1/billing/plans", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      product_id: process.env.PAYPAL_PRODUCT_ID,
      name: "Pro Plan",
      billing_cycles: [
        {
          frequency: {
            interval_unit: "MONTH",
            interval_count: 1,
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: "29",
              currency_code: "USD",
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
      },
    }),
  });

  const data = await res.json();

  return NextResponse.json(data);
}