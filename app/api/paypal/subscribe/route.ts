import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { plan, userId } = await req.json();

  // map plan → price
  const prices: any = {
    PRO: 29,
    ENTERPRISE: 99,
  };

  const amount = prices[plan];

  // TODO: real PayPal API
  const approvalUrl = `https://www.sandbox.paypal.com/checkout?amount=${amount}&userId=${userId}&plan=${plan}`;

  return NextResponse.json({ approvalUrl });
}