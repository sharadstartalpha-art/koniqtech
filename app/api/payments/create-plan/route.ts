import { NextResponse } from "next/server";
import axios from "axios";

const PAYPAL_API = "https://api-m.sandbox.paypal.com";

export async function GET() {
  try {
    // 🔐 1. Create Basic Auth
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    // 🔑 2. Get Access Token
    const tokenRes = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // 🧱 3. CREATE PRODUCT FIRST
    const productRes = await axios.post(
      `${PAYPAL_API}/v1/catalogs/products`,
      {
        name: "Invoice Recovery",
        type: "SERVICE",
        category: "SOFTWARE",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const productId = productRes.data.id;

    // 💳 4. CREATE PLAN
    const planRes = await axios.post(
      `${PAYPAL_API}/v1/billing/plans`,
      {
        product_id: productId,
        name: "Growth Plan",
        billing_cycles: [
          {
            frequency: {
              interval_unit: "MONTH",
              interval_count: 1,
            },
            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: 0,
            pricing_scheme: {
              fixed_price: {
                value: "39",
                currency_code: "USD",
              },
            },
          },
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee: {
            value: "0",
            currency_code: "USD",
          },
          setup_fee_failure_action: "CONTINUE",
          payment_failure_threshold: 3,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 🎉 THIS IS WHAT YOU NEED
    return NextResponse.json({
      productId,
      planId: planRes.data.id,
    });

  } catch (err: any) {
    console.error("CREATE PLAN ERROR:", err?.response?.data || err);

    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 }
    );
  }
}