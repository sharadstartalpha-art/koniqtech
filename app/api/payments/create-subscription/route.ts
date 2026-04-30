import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { paypalPlanId } = await req.json();

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    const { data } = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/billing/subscriptions",
      {
        plan_id: paypalPlanId,
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_URL}/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_URL}/subscribe`,
        },
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    const approvalUrl = data.links.find(
      (l: any) => l.rel === "approve"
    )?.href;

    return NextResponse.json({ approvalUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}