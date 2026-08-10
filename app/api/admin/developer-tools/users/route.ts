// app/api/admin/developer-tools/users/route.ts

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  Prisma,
  SubscriptionStatus,
  UserRole,
} from "@prisma/client";

import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import { createUserSchema } from "@/shared/lib/validators/user";
import { SUBSCRIPTION_PLANS } from "@/shared/lib/admin/subscription-plans";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json(
    {
      success: false,
      message: "Unauthorized",
    },
    { status: 401 }
  );
}

function forbidden() {
  return NextResponse.json(
    {
      success: false,
      message: "Forbidden",
    },
    { status: 403 }
  );
}

function internalError(error: unknown) {
  console.error("Admin Users API Error:", error);

  return NextResponse.json(
    {
      success: false,
      message: "Internal Server Error",
    },
    { status: 500 }
  );
}

function isSuperAdmin(session: any) {
  return (
    session?.user?.role === UserRole.super_admin
  );
}

/**
 * GET /api/admin/developer-tools/users
 *
 * Returns real users from PostgreSQL.
 */
export async function GET(
  request: NextRequest
) {
  try {
    const session = await auth();

    if (!session) {
      return unauthorized();
    }

    if (!isSuperAdmin(session)) {
      return forbidden();
    }

    const { searchParams } =
      new URL(request.url);

    const search =
      searchParams.get("search")?.trim() ?? "";

    const roleParam =
      searchParams.get("role") ?? "";

    const status =
      searchParams.get("status")?.trim() ?? "";

    const orgId =
      searchParams.get("orgId")?.trim() ?? "";

    const requestedPage = Number(
      searchParams.get("page") ?? "1"
    );

    const requestedLimit = Number(
      searchParams.get("limit") ?? "20"
    );

    const page =
      Number.isFinite(requestedPage) &&
      requestedPage > 0
        ? Math.floor(requestedPage)
        : 1;

    const limit =
      Number.isFinite(requestedLimit) &&
      requestedLimit > 0
        ? Math.min(
            Math.floor(requestedLimit),
            100
          )
        : 20;

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (
      roleParam &&
      Object.values(UserRole).includes(
        roleParam as UserRole
      )
    ) {
      where.role = roleParam as UserRole;
    }

    if (status) {
      where.status = status;
    }

    if (orgId) {
      where.orgId = orgId;
    }

     const [users, total] =
  await prisma.$transaction([
    prisma.user.findMany({
      where,

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        lastLogin: true,
        lastSeen: true,
        emailVerified: true,
        createdAt: true,

        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            crmType: true,
            plan: true,
            active: true,

            subscriptions: {
              select: {
                id: true,
                plan: true,
                status: true,
                amount: true,
                currency: true,
                billingCycle: true,
                renewAt: true,
                cancelAtPeriodEnd: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      skip: (page - 1) * limit,

      take: limit,
    }),

    prisma.user.count({
      where,
    }),
  ]);

    return NextResponse.json({
      success: true,

      data: users,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return internalError(error);
  }
}

/**
 * POST /api/admin/developer-tools/users
 *
 * Creates a real CRM user and assigns
 * a subscription to the user's organization.
 */
export async function POST(
  request: NextRequest
) {
  try {
    const session = await auth();

    if (!session) {
      return unauthorized();
    }

    if (!isSuperAdmin(session)) {
      return forbidden();
    }

    const rawBody = await request.json();

    const body =
      createUserSchema.parse(rawBody);

    const {
      orgId,
      name,
      email,
      password,
      role,
      phone,
      plan,
    } = body;

    const planConfig =
      SUBSCRIPTION_PLANS[plan];

    if (!planConfig) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid subscription plan.",
        },
        { status: 400 }
      );
    }

    const organization =
  await prisma.organization.findUnique({
    where: {
      id: orgId,
    },

    select: {
      id: true,
      name: true,
      active: true,
      plan: true,
    },
  });

    if (!organization) {
      return NextResponse.json(
        {
          success: false,
          message: "Organization not found.",
        },
        { status: 404 }
      );
    }

    if (!organization.active) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot create a user inside an inactive organization.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
        select: {
          id: true,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A user with this email already exists.",
        },
        { status: 409 }
      );
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    const now = new Date();

    const renewAt = new Date(now);
    renewAt.setMonth(
      renewAt.getMonth() + 1
    );

    const result =
      await prisma.$transaction(
        async (tx) => {
          const user =
            await tx.user.create({
              data: {
                orgId,

                name: name.trim(),

                email: normalizedEmail,

                passwordHash,

                role,

                phone:
                  phone?.trim() || null,

                status: "active",

                emailVerified: false,

                failedLoginAttempts: 0,
              },

              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                createdAt: true,

                organization: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    crmType: true,
                  },
                },
              },
            });

          /**
           * Subscription is organization-level
           * because Subscription.orgId is unique.
           */
         const subscription =
  await tx.subscription.upsert({
    where: {
      orgId,
    },

    create: {
      orgId,
      provider: "admin",
      externalId: null,
      customerId: null,
      plan,
      status: SubscriptionStatus.active,
      billingCycle: "monthly",
      amount: new Prisma.Decimal(
        planConfig.amount
      ),
      currency: "USD",
      renewAt,
      nextInvoiceDate: renewAt,
      trialStart: null,
      trialEnd: null,
      interval: "month",
      cancelAtPeriodEnd: false,
      userLimit: planConfig.userLimit,
      storageLimit: planConfig.storageLimit,
      aiCredits: planConfig.aiCredits,
    },

    update: {
      plan,
      status: SubscriptionStatus.active,
      billingCycle: "monthly",
      amount: new Prisma.Decimal(
        planConfig.amount
      ),
      currency: "USD",
      renewAt,
      nextInvoiceDate: renewAt,
      trialStart: null,
      trialEnd: null,
      interval: "month",
      cancelAtPeriodEnd: false,
      userLimit: planConfig.userLimit,
      storageLimit: planConfig.storageLimit,
      aiCredits: planConfig.aiCredits,
    },
  });

          /**
           * Keep Organization.plan synchronized
           * with Subscription.plan.
           */
          const updatedOrganization =
            await tx.organization.update({
              where: {
                id: orgId,
              },

              data: {
                plan,

                usersLimit:
                  planConfig.userLimit,

                subscriptionEndsAt:
                  renewAt,
              },

              select: {
                id: true,
                name: true,
                plan: true,
                usersLimit: true,
                subscriptionEndsAt: true,
              },
            });

          return {
            user,
            subscription,
            organization:
              updatedOrganization,
          };
        }
      );

    return NextResponse.json(
      {
        success: true,

        message:
          "User created and subscription assigned successfully.",

        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    if (
      error instanceof
      Prisma.PrismaClientKnownRequestError
    ) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            message:
              "A record with the same unique value already exists.",
          },
          { status: 409 }
        );
      }

      if (error.code === "P2025") {
        return NextResponse.json(
          {
            success: false,
            message:
              "The requested record could not be found.",
          },
          { status: 404 }
        );
      }

      console.error(
        "Prisma error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Database operation failed.",
          code: error.code,
        },
        { status: 400 }
      );
    }

    return internalError(error);
  }
}