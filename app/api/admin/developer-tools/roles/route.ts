/**
 * ==================================================
 * Developer Tools - Organization Roles API
 * ==================================================
 *
 * GET
 *    List Organization Roles
 *
 * POST
 *    Create Organization Role
 *
 * Remaining APIs
 *
 * PATCH
 * DELETE
 * ASSIGN PERMISSIONS
 *
 * are implemented in
 *
 * roles/[id]/route.ts
 * roles/permissions/*
 *
 * ==================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { Prisma, UserRole } from "@prisma/client";

import { auth } from "@/auth";

import { prisma } from "@/shared/lib/prisma";
import {
  createRoleSchema,
} from "@/shared/lib/validators/role";

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

    const active =
      searchParams.get("active");

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

    const where: Prisma.OrganizationRoleWhereInput =
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
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (orgId) {
      where.orgId = orgId;
    }

    if (active === "true") {
      where.active = true;
    }

    if (active === "false") {
      where.active = false;
    }

    const sort =
  searchParams.get("sort") ??
  "createdAt";

const order =
  searchParams.get("order") ===
  "asc"
    ? "asc"
    : "desc";

const allowedSortFields = [
  "createdAt",
  "updatedAt",
  "name",
];

const orderBy =
  allowedSortFields.includes(sort)
    ? {
        [sort]: order,
      }
    : {
        createdAt: "desc" as const,
      };

    const [roles, total] =
      await prisma.$transaction([
        prisma.organizationRole.findMany({
          where,

          include: {
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },

            _count: {
              select: {
                users: true,
                permissions: true,
              },
            },
          },

          orderBy,

          skip:
            (page - 1) * limit,

          take: limit,
        }),

        prisma.organizationRole.count({
          where,
        }),
      ]);

    return NextResponse.json(
      {
        success: true,

        data: roles,

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
  createRoleSchema.safeParse(
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
  orgId,
  name,
  description,
  active,
} = body;

const normalizedName =
  name.trim();

const normalizedDescription =
  description?.trim() || null;

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
          message:
            "Organization not found.",
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

   const existingRole =
  await prisma.organizationRole.findUnique(
    {
      where: {
        orgId_name: {
          orgId,
          name:
            normalizedName,
        },
      },

      select: {
        id: true,
      },
    }
  );

    const role =
      await prisma.$transaction(
        async (tx) => {
          return await tx.organizationRole.create(
            {
              data: {
                orgId,

                name:
  normalizedName,

               description:
  normalizedDescription,

                active:
                  active ?? true,

                isSystem: false,
              },

              include: {
                organization: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },

                _count: {
                  select: {
                    users: true,
                    permissions: true,
                  },
                },
              },
            }
          );
        }
      );

    return NextResponse.json(
      {
        success: true,

        message:
          "Role created successfully.",

        data: role,
      },
      {
        status: 201,
      }
    );
  } 
 catch (error) {

  console.error(
    "Create Role Error",
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
              "Role already exists.",
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