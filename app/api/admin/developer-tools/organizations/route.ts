/**
 * ==================================================
 * Developer Tools - Organizations API
 * ==================================================
 *
 * GET
 *    List Organizations
 *
 * POST
 *    Create Organization
 *
 * Remaining endpoints
 *
 * PATCH
 * DELETE
 * ARCHIVE
 * RESTORE
 *
 * are implemented in:
 *
 * organizations/[id]/route.ts
 *
 * ==================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { CRMType, Industry, Prisma, SubscriptionPlan, UserRole } from "@prisma/client";

import { auth } from "@/auth";

import { prisma } from "@/shared/lib/prisma";
import {
  createOrganizationSchema,
} from "@/shared/lib/validators/organization";

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

    const industry =
      searchParams.get("industry");

    const plan =
      searchParams.get("plan");

    const active =
      searchParams.get("active");

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

    const where: Prisma.OrganizationWhereInput =
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
          slug: {
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
      industry &&
      Object.values(Industry).includes(
        industry as Industry
      )
    ) {
      where.industry =
        industry as Industry;
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

    if (active !== null) {
      if (active === "true") {
        where.active = true;
      }

      if (active === "false") {
        where.active = false;
      }
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
  "slug",
];

const orderBy =
  allowedSortFields.includes(sort)
    ? {
        [sort]: order,
      }
    : {
        createdAt: "desc" as const,
      };

    const [organizations, total] =
      await prisma.$transaction([
        prisma.organization.findMany({
          where,

          include: {
            _count: {
              select: {
                users: true,
                customers: true,
                leads: true,
                jobs: true,
              },
            },
          },

         orderBy,

          skip:
            (page - 1) * limit,

          take: limit,
        }),

        prisma.organization.count({
          where,
        }),
      ]);

   return NextResponse.json (
  {
      success: true,

      data: organizations,

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
    status: 201,
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
  createOrganizationSchema.safeParse(
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
    status: 200,
  }
);
}

const body = parsed.data;

    const {
      name,
      slug,
      crmType,
      industry,
      plan,
      logo,
      website,
      phone,
      email,
      address,
      city,
      state,
      country,
      postalCode,
      timezone,
      currency,
      language,
      taxNumber,
      businessNumber,
      usersLimit,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Organization name is required.",
        },
        { status: 400 }
      );
    }

    if (!slug?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug is required.",
        },
        { status: 400 }
      );
    }

    if (!crmType) {
      return NextResponse.json(
        {
          success: false,
          message:
            "CRM Type is required.",
        },
        { status: 400 }
      );
    }

   const normalizedSlug =
  slug.trim().toLowerCase();

const normalizedEmail =
  email?.trim().toLowerCase() ??
  null;

const existingSlug =
  await prisma.organization.findUnique({
    where: {
      slug: normalizedSlug,
    },
    select: {
      id: true,
    },
  });

if (existingSlug) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Slug already exists.",
    },
    {
      status: 409,
    }
  );
}

if (normalizedEmail) {
  const existingEmail =
    await prisma.organization.findFirst({
      where: {
        email:
          normalizedEmail,
      },

      select: {
        id: true,
      },
    });

  if (existingEmail) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Email already exists.",
      },
      {
        status: 409,
      }
    );
  }
}

 
    const organization =
      await prisma.$transaction(
        async (tx) => {
          return await tx.organization.create(
            {
              data: {
                name: name.trim(),

               slug: normalizedSlug,

                crmType,

                industry,

                plan,

                logo:
                  logo?.trim() || null,

                website:
                  website?.trim() ||
                  null,

                phone:
                  phone?.trim() || null,

                email:
  normalizedEmail,

                address:
                  address?.trim() ||
                  null,

                city:
                  city?.trim() || null,

                state:
                  state?.trim() || null,

                country:
                  country?.trim() ||
                  null,

                postalCode:
                  postalCode?.trim() ||
                  null,

                timezone:
                  timezone || "UTC",

                currency:
                  currency || "USD",

                language:
                  language || "en",

                taxNumber:
                  taxNumber?.trim() ||
                  null,

                businessNumber:
                  businessNumber?.trim() ||
                  null,

                usersLimit:
                  usersLimit ?? 5,

                active: true,
              },
            }
          );
        }
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Organization created successfully.",
        data: organization,
      },
      {
        status: 201,
      }
    );
  } 
 catch (error) {

  console.error(
    "Create Organization Error",
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
              "Duplicate record.",
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
              "Invalid relation.",
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