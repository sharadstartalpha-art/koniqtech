import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // ✅ Get logged-in user
    const cookieStore = await cookies();
    const userId = cookieStore.get("user")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Create PayPal subscription
    const res = await fetch(
      "https://api-m.paypal.com/v1/billing/subscriptions",
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.PAYPAL_CLIENT_ID +
                ":" +
                process.env.PAYPAL_SECRET
            ).toString("base64"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_id: process.env.PAYPAL_PLAN_ID,

          // 🔥 VERY IMPORTANT (link PayPal → your user)
          custom_id: userId,

          application_context: {
            return_url: "https://koniqtech.com/success",
            cancel_url:
              "https://koniqtech.com/products/invoice-recovery/dashboard",
          },
        }),
      }
    );

    const data = await res.json();

    console.log("PAYPAL RESPONSE:", data);

    // ✅ Extract approval URL
    const approveLink = data.links?.find(
      (l: any) => l.rel === "approve"
    );

    if (!approveLink) {
      return NextResponse.json(
        { error: "No approval URL from PayPal" },
        { status: 400 }
      );
    }

    return NextResponse.json({ url: approveLink.href });
  } catch (error) {
    console.error("PAYPAL ERROR:", error);

    return NextResponse.json(
      { error: "Payment failed" },
      { status: 500 }
    );
  }
}