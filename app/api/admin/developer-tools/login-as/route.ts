/**
 * ============================================================
 * Developer Tools - Login As API
 * ============================================================
 *
 * GET
 *    List Users available for impersonation
 *
 * POST
 *    Create impersonation session
 *
 * Remaining APIs
 *
 * DELETE
 *    End impersonation
 *
 * VERIFY
 *    Verify impersonation token
 *
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { Prisma, UserRole } from "@prisma/client";

import { auth } from "@/auth";

import { prisma } from "@/shared/lib/prisma";
import { randomUUID } from "crypto";
import {
  loginAsSchema,
} from "@/shared/lib/validators/login-as";

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

    const orgId =
      searchParams.get("orgId");

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

    const where: Prisma.UserWhereInput =
      {};

    if (search.trim()) {
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

    if (orgId) {
      where.orgId = orgId;
    }

    if (status) {
      where.status = status;
    }

    const sort =
  searchParams.get("sort") ??
  "name";

const order =
  searchParams.get("order") ===
  "desc"
    ? "desc"
    : "asc";

const allowedSortFields = [
  "name",
  "email",
  "createdAt",
  "lastLogin",
];

const orderBy =
  allowedSortFields.includes(sort)
    ? {
        [sort]: order,
      }
    : {
        name: "asc" as const,
      };

    const [users, total] =
      await prisma.$transaction([
        prisma.user.findMany({
          where,

          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            lastLogin: true,

            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
                plan: true,
              },
            },
          },

          orderBy,

          skip:
            (page - 1) * limit,

          take: limit,
        }),

        prisma.user.count({
          where,
        }),
      ]);

    return NextResponse.json(
      {
        success: true,

        data: users,

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
  loginAsSchema.safeParse(
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
    status: 201,
  }
);
}

const body = parsed.data;


    const {
      targetUserId,
    } = body;

   

    if (
      targetUserId ===
      session.user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You cannot impersonate yourself.",
        },
        {
          status: 400,
        }
      );
    }

    const targetUser =
      await prisma.user.findUnique({
        where: {
          id: targetUserId,
        },

        include: {
          organization: true,
        },
      });


await prisma.impersonationSession.deleteMany({
  where: {
    OR: [
      {
        expiresAt: {
          lt: new Date(),
        },
      },
      {
        revokedAt: {
          not: null,
        },
      },
    ],
  },
});

    if (!targetUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      targetUser.status !==
      "active"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Target user is inactive.",
        },
        {
          status: 400,
        }
      );
    }

    const token =
      randomUUID();

   const IMPERSONATION_MINUTES = 30;

const expiresAt =
  new Date(
    Date.now() +
      IMPERSONATION_MINUTES *
      60 *
      1000
  );

    await prisma.$transaction(
      async (tx) => {
        await tx.auditLog.create({
  data: {
    orgId: targetUser.orgId,

    userId: session.user.id,

    action: "LOGIN_AS",

    entity: "User",

    entityId: targetUser.id,

   

    metadata: {
      impersonationToken: token,
      targetUserId: targetUser.id,
    },
  },
});

  
      }
    );
const impersonationUrl =
  `/impersonate/${token}`;


    return NextResponse.json(
      {
        success: true,

        message:
          "Impersonation session created.",

        token,
        impersonationUrl,
        expiresAt,

        user: {
          id: targetUser.id,
          name:
            targetUser.name,
          email:
            targetUser.email,
          role:
            targetUser.role,
          organization:
            targetUser.organization
              ?.name,
              
        },
      },
      {
        status: 201,
      }
    );
  } 

  catch (error) {

  console.error(
    "Login As Error",
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
              "Duplicate impersonation session.",
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
              "Invalid user.",
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

