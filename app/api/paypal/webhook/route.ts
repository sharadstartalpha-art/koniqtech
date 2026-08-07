/**
 * ==========================================================
 * PayPal Webhook API
 * ==========================================================
 *
 * Supported Events
 *
 * BILLING.SUBSCRIPTION.CREATED
 * BILLING.SUBSCRIPTION.ACTIVATED
 * BILLING.SUBSCRIPTION.CANCELLED
 * PAYMENT.SALE.COMPLETED
 * PAYMENT.SALE.DENIED
 * PAYMENT.SALE.REFUNDED
 *
 * Responsibilities
 *
 * ✔ Verify PayPal Signature
 * ✔ Validate Payload
 * ✔ Update Subscription
 * ✔ Log Webhook Delivery
 * ✔ Audit Processing
 *
 * ==========================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { Prisma, SubscriptionStatus } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";

import {
  verifyPayPalWebhookSignature,
} from "@/shared/lib/paypal";

import {
  webhookVerificationSchema,
} from "@/shared/lib/validators/paypal";

function badRequest(
  message: string
) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    {
      status: 400,
    }
  );
}

function internalError(
  error: unknown
) {
  console.error(
    "PayPal Webhook",
    error
  );

  return NextResponse.json(
    {
      success: false,
      message:
        "Internal Server Error",
    },
    {
      status: 500,
    }
  );
}

export async function POST(
  request: NextRequest
) {

  let delivery:
    Awaited<
      ReturnType<
        typeof prisma.webhookDelivery.create
      >
    > | null = null;

  try {
    const body =
      await request.json();

    const parsed =
      webhookVerificationSchema.safeParse(
        body
      );

    if (!parsed.success) {
      return badRequest(
        "Invalid webhook payload."
      );
    }

    const verified =
      await verifyPayPalWebhookSignature(
        parsed.data
      );

    if (!verified) {
      return badRequest(
        "Webhook signature verification failed."
      );
    }

    const event =
      parsed.data.webhookEvent as {
        id: string;

        event_type: string;

        resource: Record<
          string,
          unknown
        >;
      };


      const SUPPORTED_EVENTS = [
  "BILLING.SUBSCRIPTION.CREATED",
  "BILLING.SUBSCRIPTION.ACTIVATED",
  "BILLING.SUBSCRIPTION.CANCELLED",
  "PAYMENT.SALE.COMPLETED",
  "PAYMENT.SALE.DENIED",
  "PAYMENT.SALE.REFUNDED",
] as const;

if (
  !SUPPORTED_EVENTS.includes(
    event.event_type as (typeof SUPPORTED_EVENTS)[number]
  )
) {
  return NextResponse.json(
    {
      success: true,
      message: "Event ignored.",
    },
    {
      status: 200,
    }
  );
}

      const payloadString =
  JSON.stringify(
    parsed.data.webhookEvent
  );

const existingDelivery =
  await prisma.webhookDelivery.findFirst({
    where: {
      event:
        event.event_type,

      payload: {
        equals:
          JSON.parse(
            payloadString
          ),
      },

      success: true,
    },

    select: {
      id: true,
    },
  });

if (existingDelivery) {
  return NextResponse.json(
    {
      success: true,

      message:
        "Webhook already processed.",
    },
    {
      status: 200,
    }
  );
}



      const webhook =
  await prisma.webhook.findFirst({
    where: {
      active: true,
    },

    select: {
      id: true,
    },
  });

if (!webhook) {
  return badRequest(
    "No active webhook configuration found."
  );
}


delivery =
await prisma.webhookDelivery.create({
   data: {

  webhookId:
    webhook.id,

  event:
    event.event_type,

  payload:
parsed.data.webhookEvent as Prisma.JsonObject,

  retryCount: 0,

  success: false,

},
  });

   switch (event.event_type) {

  case "BILLING.SUBSCRIPTION.CREATED": {

    const subscriptionId =
      event.resource.id as string;

    await prisma.subscription.updateMany({
      where: {
        externalId: subscriptionId,
      },

      data: {
        status:
          SubscriptionStatus.trial,
      },
    });

    break;
  }

  case "BILLING.SUBSCRIPTION.ACTIVATED": {

    const resource =
      event.resource as Record<string, unknown>;

    const subscriptionId =
      resource.id as string;

    await prisma.subscription.updateMany({
      where: {
        externalId: subscriptionId,
      },

      data: {
        status:
          SubscriptionStatus.active,

        renewAt:
          resource[
            "billing_info"
          ] &&
          typeof resource[
            "billing_info"
          ] === "object"
            ? new Date(
                (
                  resource[
                    "billing_info"
                  ] as Record<
                    string,
                    unknown
                  >
                )[
                  "next_billing_time"
                ] as string
              )
            : null,
      },
    });

    break;
  }

  case "BILLING.SUBSCRIPTION.CANCELLED": {

    const subscriptionId =
      event.resource.id as string;

    await prisma.subscription.updateMany({
      where: {
        externalId: subscriptionId,
      },

      data: {
        status:
          SubscriptionStatus.cancelled,

        cancelAtPeriodEnd:
          true,
      },
    });

    break;
  }

  case "PAYMENT.SALE.COMPLETED": {

    const resource =
      event.resource as Record<
        string,
        unknown
      >;

    const billingAgreement =
      resource[
        "billing_agreement_id"
      ] as string;

    const saleTime =
      resource[
        "create_time"
      ] as string;

    await prisma.subscription.updateMany({
      where: {
        externalId:
          billingAgreement,
      },

      data: {
        nextInvoiceDate:
          new Date(saleTime),
      },
    });

    break;
  }

  case "PAYMENT.SALE.DENIED": {

    break;
  }

  case "PAYMENT.SALE.REFUNDED": {

    break;
  }

  default:

    console.info(
      "Unhandled PayPal event:",
      event.event_type
    );

    break;
}

   await prisma.webhookDelivery.update({
  where: {
    id: delivery.id,
  },

  data: {

  success: true,

  responseCode: 200,

  responseBody:
    JSON.stringify({
      success: true,
    }),

  deliveredAt:
    new Date(),

},
});

return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );

  } 
catch (error) {

  console.error(
    "PayPal Webhook Error",
    error
  );

  if (delivery) {

    await prisma.webhookDelivery.update({
      where: {
        id: delivery.id,
      },

      data: {

        success: false,

        retryCount: {
          increment: 1,
        },

        responseCode: 500,

        responseBody:
          error instanceof Error
            ? error.message
            : "Unknown error",

      },
    });

  }

  if (
    error instanceof
    Prisma.PrismaClientKnownRequestError
  ) {

    return NextResponse.json(
      {
        success: false,

        message:
          "Database operation failed.",

        code:
          error.code,
      },
      {
        status: 400,
      }
    );

  }

  return internalError(
    error
  );

}
}