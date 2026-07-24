import paypalClient from "./client";

export type SubscriptionPlan =
  | "starter"
  | "growth"
  | "professional";

export function getPayPalPlanId(
  plan: SubscriptionPlan
): string {
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

export async function createSubscription(
  plan: SubscriptionPlan,
  customId: string
) {
  const planId = getPayPalPlanId(plan);

  const response = await paypalClient.subscriptions.create({
    body: {
      planId,

      customId,

      applicationContext: {
        brandName: "KoniqTech",

        locale: "en-US",

        shippingPreference: "NO_SHIPPING",

        userAction: "SUBSCRIBE_NOW",

        paymentMethod: {
          payerSelected: "PAYPAL",

          payeePreferred: "IMMEDIATE_PAYMENT_REQUIRED",
        },

        returnUrl:
          `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,

        cancelUrl:
          `${process.env.NEXT_PUBLIC_APP_URL}/register/plan`,
      },
    },
  });

  return response;
}

export async function getSubscription(
  subscriptionId: string
) {
  return paypalClient.subscriptions.get({
    id: subscriptionId,
  });
}

export async function cancelSubscription(
  subscriptionId: string,
  reason = "Cancelled by customer"
) {
  return paypalClient.subscriptions.cancel({
    id: subscriptionId,

    body: {
      reason,
    },
  });
}

export async function activateSubscription(
  subscriptionId: string,
  reason = "Activated"
) {
  return paypalClient.subscriptions.activate({
    id: subscriptionId,

    body: {
      reason,
    },
  });
}