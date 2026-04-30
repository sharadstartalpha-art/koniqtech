import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPayPalAccessToken } from "@/lib/paypal";

export async function POST(req: Request) {
  let planId;

  const contentType = req.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const body = await req.json();
    planId = body.planId;
  } else {
    const formData = await req.formData();
    planId = formData.get("planId");
  }

  if (!planId) {
    return NextResponse.json({ error: "Missing planId" }, { status: 400 });
  }

  const plan = await prisma.plan.findUnique({
    where: { id: String(planId) },
  });

  if (!plan || !plan.paypalPlanId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const accessToken = await getPayPalAccessToken();

  const res = await fetch(
    "https://api-m.sandbox.paypal.com/v1/billing/subscriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: plan.paypalPlanId,
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        },
      }),
    }
  );

  const data = await res.json();

  return NextResponse.json(data);
}