import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const body = await req.formData();

  const planId = body.get("planId");
  const teamId = body.get("teamId");

  const res = await fetch("https://api-m.sandbox.paypal.com/v1/billing/subscriptions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      plan_id: planId, // 🔥 PayPal plan ID (NOT your DB plan)
      custom_id: session?.user?.id,
      application_context: {
        brand_name: "KoniqTech",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paypal/success?teamId=${teamId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
      },
    }),
  });

  const data = await res.json();

  return NextResponse.redirect(
    data.links.find((l: any) => l.rel === "approve").href
  );
}