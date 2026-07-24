const PAYPAL_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

/**
 * Get PayPal OAuth Access Token
 */
export async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString("base64");

  const response = await fetch(
    `${PAYPAL_BASE_URL}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `PayPal authentication failed: ${error}`
    );
  }

  const json = await response.json();

  return json.access_token;
}

/**
 * PayPal API Base URL
 */
export function getPayPalBaseUrl() {
  return PAYPAL_BASE_URL;
}

/**
 * Get Plan ID from environment
 */
export function getPayPalPlanId(
  plan: "starter" | "growth" | "professional"
) {
  switch (plan) {
    case "starter":
      return process.env.PAYPAL_STARTER_PLAN_ID!;

    case "growth":
      return process.env.PAYPAL_GROWTH_PLAN_ID!;

    case "professional":
      return process.env.PAYPAL_PROFESSIONAL_PLAN_ID!;

    default:
      throw new Error("Invalid PayPal plan.");
  }
}