import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { Prisma, UserRole } from "@prisma/client";

import { auth } from "@/auth";

import { prisma } from "@/shared/lib/prisma";
import { createUserSchema } from "@/shared/lib/validators/user";


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

    const role =
      searchParams.get("role");

    const status =
      searchParams.get("status");

    const page =
      Number(
        searchParams.get("page") ?? 1
      );

    const limit =
      Number(
        searchParams.get("limit") ?? 20
      );

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

    if (
      role &&
      Object.values(UserRole).includes(
        role as UserRole
      )
    ) {
      where.role =
        role as UserRole;
    }

    if (status) {
      where.status = status;
    }

    const [users, total] =
      await prisma.$transaction([
        prisma.user.findMany({
          where,

          include: {
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
                plan: true,
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
        pages: Math.ceil(
          total / limit
        ),
      },
    });
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

const body =
  createUserSchema.parse(
    rawBody
  );

    const {
      orgId,
      name,
      email,
      password,
      role,
      phone,
    } = body;

    

    

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
        { status: 404 }
      );
    }

    if (!organization.active) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Organization is inactive.",
        },
        { status: 400 }
      );
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email already exists.",
        },
        { status: 409 }
      );
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

   const user = await prisma.$transaction(
  async (tx) => {
    return await tx.user.create({
      data: {
        orgId,

        name: name.trim(),

        email: email.toLowerCase(),

        passwordHash,

        role,

        phone: phone?.trim() || null,

        status: "active",
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
          "User created successfully.",

        data: user,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
  console.error(
    "Create User Error",
    error
  );

  if (
    error instanceof
    Prisma.PrismaClientKnownRequestError
  ) {
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

  return internalError(error);
}
}