import { NextRequest, NextResponse } from "next/server";

import { Prisma } from "@prisma/client";

import {
  registerUser,
  RegisterError,
} from "@/shared/lib/auth/register";

import {
  registerSchema,
} from "@/shared/lib/validators/register";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const parsed =
      registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: parsed.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const result = await registerUser(
      parsed.data
    );

    return NextResponse.json(
  {
    success: true,

    message: result.message,

    orgId: result.organizationId,

    data: {
      userId: result.userId,

      organizationId: result.organizationId,

      subscriptionId: result.subscriptionId,

      roleId: result.roleId,

      slug: result.slug,
    },
  },
  {
    status: 201,
  }
);


  } catch (error) {
    console.error(
      "Registration Error:",
      error
    );

    if (error instanceof RegisterError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }

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
                "A record with the same unique value already exists.",
            },
            {
              status: 409,
            }
          );

        case "P2025":
          return NextResponse.json(
            {
              success: false,
              message:
                "Required record was not found.",
            },
            {
              status: 404,
            }
          );

        default:
          return NextResponse.json(
            {
              success: false,
              message:
                "Database operation failed.",
            },
            {
              status: 500,
            }
          );
      }
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid request payload.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}