import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const { plan } = await req.json();

  // 🔥 Map plans → price
  const priceMap: any = {
    starter: {
      amount: 1900,
      credits: 500,
    },
    growth: {
      amount: 4900,
      credits: 2000,
    },
    pro: {
      amount: 9900,
      credits: 5000,
    },
  };

  const selected = priceMap[plan];

  if (!selected) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

metadata: {
  userId: "USER_ID_HERE",
},

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${plan} plan`,
          },
          unit_amount: selected.amount,
        },
        quantity: 1,
      },
    ],

    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}