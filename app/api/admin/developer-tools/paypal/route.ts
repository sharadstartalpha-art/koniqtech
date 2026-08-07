

import { NextRequest, NextResponse } from "next/server";

import {
  Prisma,
  SubscriptionStatus,
  SubscriptionPlan,
  UserRole,
} from "@prisma/client";

import { auth } from "@/auth";

import { prisma } from "@/shared/lib/prisma";
import {
  createPayPalSubscription,
} from "@/shared/lib/paypal";

import {
  createPayPalSubscriptionSchema,
} from "@/shared/lib/validators/paypal";


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

    const pageValue = Number(
      searchParams.get("page")
    );

    const limitValue = Number(
      searchParams.get("limit")
    );

    const page =
      Number.isInteger(pageValue) &&
      pageValue > 0
        ? pageValue
        : 1;

    const limit =
      Number.isInteger(limitValue) &&
      limitValue > 0
        ? Math.min(limitValue, 100)
        : 20;

    const where: Prisma.SubscriptionWhereInput =
      {
        provider: "paypal",
      };

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
          externalId: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          customerId: {
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
      createPayPalSubscriptionSchema.safeParse(
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

    const {
      orgId,
      returnUrl,
      cancelUrl,
    } = parsed.data;

    const subscription =
      await prisma.subscription.findUnique({
        where: {
          orgId,
        },

        include: {
          organization: true,
        },
      });

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Subscription not found.",
        },
        {
          status: 404,
        }
      );
    }

    const paypal =
      await createPayPalSubscription({
        subscription,
        returnUrl,
        cancelUrl,
      });

    await prisma.subscription.update({
      where: {
        id: subscription.id,
      },

      data: {
        externalId:
          paypal.id,

        provider:
          "paypal",
      },
    });

    return NextResponse.json(
      {
        success: true,

        message:
          "PayPal subscription created.",

        data: paypal,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return internalError(error);
  }
}