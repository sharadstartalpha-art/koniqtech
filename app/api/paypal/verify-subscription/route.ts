import { NextRequest, NextResponse } from "next/server";

import { Prisma } from "@prisma/client";
import prisma from "@/shared/lib/prisma";
import { getPayPalAccessToken, getPayPalBaseUrl } from "@/shared/lib/paypal";


export async function POST(req: NextRequest) {
  try {
  

   const { subscriptionId, orgId } = await req.json();

    if (!subscriptionId || !orgId) {
  return NextResponse.json(
    {
      message: "Subscription ID or Organization ID missing.",
    },
    {
      status: 400,
    }
  );
}

   const organization = await prisma.organization.findUnique({
  where: {
    id: orgId,
  },
});

if (!organization) {
  return NextResponse.json(
    {
      message: "Organization not found.",
    },
    {
      status: 404,
    }
  );
}

   const accessToken = await getPayPalAccessToken();

const response = await fetch(
  `${getPayPalBaseUrl()}/v1/billing/subscriptions/${subscriptionId}`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  }
);

if (!response.ok) {
  return NextResponse.json(
    {
      message: "Unable to verify subscription.",
    },
    {
      status: 400,
    }
  );
}

const subscription = await response.json();

    if (subscription.status !== "ACTIVE") {
      return NextResponse.json(
        {
          message:
            "Subscription is not active yet.",
        },
        { status: 400 }
      );
    }

    let plan = "starter";

    if (
      subscription.plan_id ===
      process.env.PAYPAL_GROWTH_PLAN_ID
    ) {
      plan = "growth";
    }

    if (
      subscription.plan_id ===
      process.env.PAYPAL_PROFESSIONAL_PLAN_ID
    ) {
      plan = "professional";
    }

    await prisma.subscription.upsert({
      where: {
        orgId,
      },

      update: {
        provider: "paypal",

        externalId: subscription.id,

        customerId: subscription.subscriber?.payer_id,

        plan,

        status: "active",

        currency:
          subscription.billing_info
            ?.last_payment?.amount?.currency_code ??
          "USD",

        amount: new Prisma.Decimal(
  subscription.billing_info
    ?.last_payment?.amount?.value ?? "0"
),

        renewAt: subscription.billing_info
          ?.next_billing_time
          ? new Date(
              subscription.billing_info.next_billing_time
            )
          : null,

        nextInvoiceDate:
          subscription.billing_info
            ?.next_billing_time
            ? new Date(
                subscription.billing_info.next_billing_time
              )
            : null,
      },

      create: {
        orgId,

        provider: "paypal",

        externalId: subscription.id,

        customerId:
          subscription.subscriber?.payer_id,

        plan,

        status: "active",

        billingCycle: "monthly",

       amount: new Prisma.Decimal(
  subscription.billing_info
    ?.last_payment?.amount?.value ?? "0"
),

        currency:
          subscription.billing_info
            ?.last_payment?.amount?.currency_code ??
          "USD",

        renewAt: subscription.billing_info
          ?.next_billing_time
          ? new Date(
              subscription.billing_info.next_billing_time
            )
          : null,

        nextInvoiceDate:
          subscription.billing_info
            ?.next_billing_time
            ? new Date(
                subscription.billing_info.next_billing_time
              )
            : null,
      },
    });

    await prisma.organization.update({
      where: {
        id: orgId,
      },

      data: {
        plan,

        subscriptionEndsAt:
          subscription.billing_info
            ?.next_billing_time
            ? new Date(
                subscription.billing_info.next_billing_time
              )
            : null,
      },
    });

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Unable to verify subscription.",
      },
      { status: 500 }
    );
  }
}