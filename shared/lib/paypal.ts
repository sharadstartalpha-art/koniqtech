import { SubscriptionPlan } from "@prisma/client";

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
 * Get PayPal Plan ID
 */
export function getPayPalPlanId(
  plan: SubscriptionPlan
): string {
  switch (plan) {
    case SubscriptionPlan.starter:
      return process.env.PAYPAL_STARTER_PLAN_ID!;

    case SubscriptionPlan.professional:
      return process.env.PAYPAL_PROFESSIONAL_PLAN_ID!;

    case SubscriptionPlan.enterprise:
      return process.env.PAYPAL_ENTERPRISE_PLAN_ID!;

    default:
      throw new Error("Invalid PayPal plan.");
  }
}

export interface CreateSubscriptionOptions {
  subscription: {
    id: string;
    plan: SubscriptionPlan;
  };

  returnUrl: string;

  cancelUrl: string;
}

export async function createPayPalSubscription(
  options: CreateSubscriptionOptions
) {
  const accessToken =
    await getPayPalAccessToken();

  const planId =
    getPayPalPlanId(
      options.subscription.plan
    );

  const response =
    await fetch(
      `${getPayPalBaseUrl()}/v1/billing/subscriptions`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          plan_id: planId,

          application_context: {
            brand_name:
              "KoniqTech",

            user_action:
              "SUBSCRIBE_NOW",

            return_url:
              options.returnUrl,

            cancel_url:
              options.cancelUrl,
          },
        }),
      }
    );

  const json =
    await response.json();

  if (!response.ok) {
    throw new Error(
      json.message ??
        "Unable to create PayPal subscription."
    );
  }

  return json;
}

export async function getPayPalSubscription(
  subscriptionId: string
) {
  const accessToken =
    await getPayPalAccessToken();

  const response =
    await fetch(
      `${getPayPalBaseUrl()}/v1/billing/subscriptions/${subscriptionId}`,
      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },

        cache: "no-store",
      }
    );

  const json =
    await response.json();

  if (!response.ok) {
    throw new Error(
      json.message ??
        "Unable to fetch subscription."
    );
  }

  return json;
}


export async function cancelPayPalSubscription(
  subscriptionId: string,
  reason =
    "Cancelled by administrator."
) {
  const accessToken =
    await getPayPalAccessToken();

  const response =
    await fetch(
      `${getPayPalBaseUrl()}/v1/billing/subscriptions/${subscriptionId}/cancel`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          reason,
        }),
      }
    );

  if (!response.ok) {
    const error =
      await response.text();

    throw new Error(error);
  }

  return true;
}

export async function activatePayPalSubscription(
  subscriptionId: string,
  reason =
    "Activated by administrator."
) {
  const accessToken =
    await getPayPalAccessToken();

  const response =
    await fetch(
      `${getPayPalBaseUrl()}/v1/billing/subscriptions/${subscriptionId}/activate`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          reason,
        }),
      }
    );

  if (!response.ok) {
    const error =
      await response.text();

    throw new Error(error);
  }

  return true;
}

export function validatePayPalConfig() {
  const required = [
    "PAYPAL_CLIENT_ID",
    "PAYPAL_SECRET",
    "PAYPAL_STARTER_PLAN_ID",
    "PAYPAL_PROFESSIONAL_PLAN_ID",
    "PAYPAL_ENTERPRISE_PLAN_ID",
  ];

  const missing =
    required.filter(
      (key) =>
        !process.env[key]
    );

  if (missing.length) {
    throw new Error(
      `Missing PayPal environment variables: ${missing.join(
        ", "
      )}`
    );
  }
}

export interface VerifyWebhookOptions {
  transmissionId: string;

  transmissionTime: string;

  transmissionSig: string;

  certUrl: string;

  authAlgo: string;

  webhookId: string;

  webhookEvent: unknown;
}

export async function verifyPayPalWebhookSignature(
  options: VerifyWebhookOptions
): Promise<boolean> {
  validatePayPalConfig();

  const accessToken =
    await getPayPalAccessToken();

  const response =
    await fetch(
      `${getPayPalBaseUrl()}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          transmission_id:
            options.transmissionId,

          transmission_time:
            options.transmissionTime,

          transmission_sig:
            options.transmissionSig,

          cert_url:
            options.certUrl,

          auth_algo:
            options.authAlgo,

          webhook_id:
            options.webhookId,

          webhook_event:
            options.webhookEvent,
        }),
      }
    );

  const json =
    await response.json();

  if (!response.ok) {
    throw new Error(
      json.message ??
        "Unable to verify PayPal webhook."
    );
  }

  return (
    json.verification_status ===
    "SUCCESS"
  );
}