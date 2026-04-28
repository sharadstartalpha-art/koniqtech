import { NextResponse } from "next/server";

/* 🔑 PAYPAL ACCESS TOKEN */
async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_SECRET!;

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(
    "https://api-m.paypal.com/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  );

  const data = await res.json();

  if (!data.access_token) {
    console.error("❌ PayPal token error:", data);
    throw new Error("Failed to get PayPal access token");
  }

  return data.access_token;
}

/* 💳 CREATE ORDER */
export async function POST(req: Request) {
  try {
    const { invoiceId, amount } = await req.json();

    if (!invoiceId || !amount) {
      return NextResponse.json(
        { error: "Missing invoiceId or amount" },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();

    const res = await fetch(
      "https://api-m.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: amount,
              },
              custom_id: invoiceId, // 🔥 IMPORTANT
            },
          ],
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ PayPal order error:", data);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ CREATE ORDER ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}