import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPayPalAccessToken } from "@/lib/paypal";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  try {
    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: "Missing planId" }, { status: 400 });
    }

    const plan = await prisma.plan.findUnique({
      where: { id: String(planId) },
    });

    if (!plan || !plan.paypalPlanId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // 🔐 GET USER FROM COOKIE
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

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
          custom_id: userId, // 🔥 IMPORTANT (for webhook)
          application_context: {
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${plan.productId}/dashboard`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${plan.productId}/subscribe`,
          },
        }),
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("PAYPAL CREATE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}