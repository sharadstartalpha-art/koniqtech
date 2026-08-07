import { NextRequest, NextResponse } from "next/server";

import {
  BillingCycle,
  Prisma,
  SubscriptionPlan,
  SubscriptionStatus,
  UserRole,
} from "@prisma/client";

import { auth } from "@/auth";

import { prisma } from "@/shared/lib/prisma";
import {
  createSubscriptionSchema,
} from "@/shared/lib/validators/subscription";

function unauthorized() {
  return NextResponse.json(
    {
      success: false,
      message: "Unauthorized",
    },
    {
      status: 401,
    }
  );
}

function forbidden() {
  return NextResponse.json(
    {
      success: false,
      message: "Forbidden",
    },
    {
      status: 403,
    }
  );
}

function internalError(error: unknown) {
  console.error(error);

  return NextResponse.json(
    {
      success: false,
      message: "Internal Server Error",
    },
    {
      status: 500,
    }
  );
}

export async function GET(
  request: NextRequest
) {
  try {
    const session = await auth();

    if (!session) {
      return unauthorized();
    }

    if (
      session.user.role !==
      UserRole.super_admin
    ) {
      return forbidden();
    }

    const { searchParams } =
      new URL(request.url);

    const search =
      searchParams.get("search") ??
      "";

    const plan =
      searchParams.get("plan");

    const status =
      searchParams.get("status");

    const billingCycle =
      searchParams.get(
        "billingCycle"
      );

    const pageValue = Number(
      searchParams.get("page")
    );

    const limitValue = Number(
      searchParams.get("limit")
    );

    const page =
      Number.isFinite(pageValue) &&
      pageValue > 0
        ? pageValue
        : 1;

    const limit =
      Number.isFinite(limitValue) &&
      limitValue > 0
        ? Math.min(limitValue, 100)
        : 20;

    const where: Prisma.SubscriptionWhereInput =
      {};

    if (search.trim()) {
      where.OR = [
        {
          organization: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          provider: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          externalId: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (
      plan &&
      Object.values(
        SubscriptionPlan
      ).includes(
        plan as SubscriptionPlan
      )
    ) {
      where.plan =
        plan as SubscriptionPlan;
    }

    if (
      status &&
      Object.values(
        SubscriptionStatus
      ).includes(
        status as SubscriptionStatus
      )
    ) {
      where.status =
        status as SubscriptionStatus;
    }

    if (
      billingCycle &&
      Object.values(
        BillingCycle
      ).includes(
        billingCycle as BillingCycle
      )
    ) {
      where.billingCycle =
        billingCycle as BillingCycle;
    }

    const [subscriptions, total] =
      await prisma.$transaction([
        prisma.subscription.findMany({
          where,

          include: {
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
                active: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },

          skip:
            (page - 1) * limit,

          take: limit,
        }),

        prisma.subscription.count({
          where,
        }),
      ]);

    return NextResponse.json(
      {
        success: true,

        data: subscriptions,

        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(
            total / limit
          ),
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return internalError(error);
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const session = await auth();

    if (!session) {
      return unauthorized();
    }

    if (
      session.user.role !==
      UserRole.super_admin
    ) {
      return forbidden();
    }

    const rawBody =
  await request.json();

const parsed =
  createSubscriptionSchema.safeParse(
    rawBody
  );

if (!parsed.success) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Validation failed.",
      errors:
        parsed.error.flatten(),
    },
    {
      status: 400,
    }
  );
}

const body = parsed.data;

    const {
      orgId,
      provider,
      externalId,
      customerId,
      plan,
      billingCycle,
      amount,
      currency,
      renewAt,
      nextInvoiceDate,
      trialStart,
      trialEnd,
      interval,
      cancelAtPeriodEnd,
      userLimit,
      storageLimit,
      aiCredits,
    } = body;

    
const normalizedProvider =
  provider.trim();

const normalizedExternalId =
  externalId?.trim() || undefined;

const normalizedCustomerId =
  customerId?.trim() || undefined;

const normalizedCurrency =
  currency.toUpperCase();
    const organization =
      await prisma.organization.findUnique({
        where: {
          id: orgId,
        },
        select: {
          id: true,
          active: true,
        },
      });

    if (!organization) {
      return NextResponse.json(
        {
          success: false,
          message: "Organization not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (!organization.active) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Organization is inactive.",
        },
        {
          status: 400,
        }
      );
    }

    const existingSubscription =
      await prisma.subscription.findUnique({
        where: {
          orgId,
        },
      });

    if (existingSubscription) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Organization already has a subscription.",
        },
        {
          status: 409,
        }
      );
    }

    if (externalId) {
      const existingExternal =
        await prisma.subscription.findUnique({
         where: {
        externalId:
    normalizedExternalId,
},
        });

      if (existingExternal) {
        return NextResponse.json(
          {
            success: false,
            message:
              "External subscription already exists.",
          },
          {
            status: 409,
          }
        );
      }
    }

    const subscription =
      await prisma.$transaction(
        async (tx) => {
          return await tx.subscription.create({
            data: {
              orgId,

             provider:
  normalizedProvider,
              
  externalId:
  normalizedExternalId,

              customerId:
  normalizedCustomerId,

              plan,

              status:
                SubscriptionStatus.trial,

              billingCycle,

              amount:
  new Prisma.Decimal(
    amount.toFixed(2)
  ),

             currency:
  normalizedCurrency,

              renewAt: renewAt
                ? new Date(
                    renewAt
                  )
                : null,

              nextInvoiceDate:
                nextInvoiceDate
                  ? new Date(
                      nextInvoiceDate
                    )
                  : null,

              trialStart:
                trialStart
                  ? new Date(
                      trialStart
                    )
                  : new Date(),

              trialEnd:
                trialEnd
                  ? new Date(
                      trialEnd
                    )
                  : null,

              interval:
                interval ??
                "month",

              cancelAtPeriodEnd:
                cancelAtPeriodEnd ??
                false,

              userLimit:
                userLimit ?? 5,

              storageLimit:
                storageLimit ??
                20,

              aiCredits:
                aiCredits ??
                1000,
            },

            include: {
              organization: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          });
        }
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Subscription created successfully.",
        data: subscription,
      },
      {
        status: 201,
      }
    );
  } 
  catch (error) {

  console.error(
    "Create Subscription Error",
    error
  );

  if (
    error instanceof
    Prisma.PrismaClientKnownRequestError
  ) {

    switch (error.code) {

      case "P2002":
        return NextResponse.json(
          {
            success: false,
            message:
              "Duplicate subscription.",
          },
          {
            status: 409,
          }
        );

      case "P2003":
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid organization.",
          },
          {
            status: 400,
          }
        );

      default:
        return NextResponse.json(
          {
            success: false,
            message:
              "Database operation failed.",
            code: error.code,
          },
          {
            status: 400,
          }
        );

    }

  }

  return internalError(error);

}
}