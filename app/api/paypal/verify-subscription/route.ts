import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";
import prisma from "@/shared/lib/prisma";
import { getPayPalAccessToken, getPayPalBaseUrl } from "@/shared/lib/paypal";


export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { message: "Subscription ID missing." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        organization: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
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
        orgId: user.orgId,
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
        orgId: user.orgId,

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
        id: user.orgId,
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