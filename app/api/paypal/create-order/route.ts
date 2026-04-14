import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan, teamId } = await req.json();

  const prices: any = {
    STARTER: "10.00",
    PRO: "29.00",
    ENTERPRISE: "99.00",
  };

  const price = prices[plan];

  if (!price) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

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
          amount: {
            currency_code: "USD",
            value: price,
          },

          // 🔥 REAL DATA (VERY IMPORTANT)
          custom_id: session.user.id,   // 👈 USER
          invoice_id: teamId || null,   // 👈 TEAM
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