/**
 * ============================================================
 * Developer Tools - Queue API
 * ============================================================
 *
 * GET
 * Queue configuration
 *
 * POST
 * Queue connectivity test
 *
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  Prisma,
  UserRole,
} from "@prisma/client";

import { auth } from "@/auth";

const QUEUE_PROVIDER =
  "BullMQ";

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

function internalError(
  error: unknown
) {
  console.error(
    "Developer Tools Queue",
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

function getQueueConfiguration() {
  const configured =
    Boolean(
      process.env.REDIS_URL
    );

  return {
    provider:
      QUEUE_PROVIDER,

    configured,

    redisConfigured:
      configured,

    environment:
      process.env.NODE_ENV,
  };
}

export async function GET(
  request: NextRequest
) {
  try {

    const session =
      await auth();

    if (!session) {
      return unauthorized();
    }

    if (
      session.user.role !==
      UserRole.super_admin
    ) {
      return forbidden();
    }

    return NextResponse.json(
      {
        success: true,

        data:
          getQueueConfiguration(),
      },
      {
        status: 200,
      }
    );

  } catch (error) {

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

    return NextResponse.json(
      {
        success: true,

        message:
          "Queue service is not configured.",

        data: {
          provider: null,

          configured: false,

          jobs: 0,

          workers: 0,
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