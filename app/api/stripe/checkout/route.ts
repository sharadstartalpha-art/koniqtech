import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-03-25.dahlia",
    });

    const { plan } = await req.json();

    // 🔥 Plan mapping
    const priceMap: Record<string, { amount: number; balance: number }> = {
      starter: {
        amount: 1900,
        balance: 500,
      },
      growth: {
        amount: 4900,
        balance: 2000,
      },
      pro: {
        amount: 9900,
        balance: 5000,
      },
    };

    const selected = priceMap[plan];

    if (!selected) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    // 🔥 TODO: replace with real user session later
    const userId = "TEMP_USER_ID";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      metadata: {
        userId,
        balance: selected.balance.toString(),
      },

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.toUpperCase()} Plan`,
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

  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return new Response("Stripe error", { status: 500 });
  }
}