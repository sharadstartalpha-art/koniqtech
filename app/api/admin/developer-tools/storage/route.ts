/**
 * ============================================================
 * Developer Tools - Storage API
 * ============================================================
 *
 * GET
 *   Storage configuration
 *
 * POST
 *   AWS S3 connectivity test
 *   Upload test file
 *   Delete test file
 *
 * Provider
 *   Amazon S3
 *
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  Prisma,
  UserRole,
} from "@prisma/client";
import { auth } from "@/auth";
import {
  deleteObject,
  testBucket,
  uploadObject,
  STORAGE_BUCKET,
} from "@/shared/lib/storage";

const STORAGE_PROVIDER =
  "Amazon S3";

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
  console.error(error);

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

function getStorageConfiguration() {
  const configured =
    Boolean(
      process.env.AWS_REGION &&
      process.env.AWS_BUCKET_NAME &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY
    );

  return {
    provider:
      STORAGE_PROVIDER,

    configured,

    bucket:
      process.env.AWS_BUCKET_NAME ??
      null,

    region:
      process.env.AWS_REGION ??
      null,

    environment:
      process.env.NODE_ENV,

    credentialsConfigured:
      Boolean(
        process.env.AWS_ACCESS_KEY_ID &&
        process.env.AWS_SECRET_ACCESS_KEY
      ),
  };
}

function validateStorageConfiguration() {

  if (!process.env.AWS_REGION) {
    throw new Error(
      "AWS_REGION is missing."
    );
  }

  if (!process.env.AWS_BUCKET_NAME) {
    throw new Error(
      "AWS_BUCKET_NAME is missing."
    );
  }

  if (
    !process.env.AWS_ACCESS_KEY_ID
  ) {
    throw new Error(
      "AWS_ACCESS_KEY_ID is missing."
    );
  }

  if (
    !process.env
      .AWS_SECRET_ACCESS_KEY
  ) {
    throw new Error(
      "AWS_SECRET_ACCESS_KEY is missing."
    );
  }

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
          getStorageConfiguration(),
      },
      {
        status: 200,
      }
    );

  } catch (error) {

  console.error(
    "Developer Tools Storage",
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

  if (
    error instanceof Error
  ) {

    return NextResponse.json(
      {
        success: false,
        message:
          error.message,
      },
      {
        status: 500,
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

   validateStorageConfiguration();

   await testBucket();

const bucket =
  STORAGE_BUCKET;

    const key =
      `developer-tools/test-${Date.now()}.txt`;

    const content =
      `KoniqTech Storage Test

Generated:
${new Date().toISOString()}
`;

   await uploadObject(
  key,
  content,
  "text/plain"
);

    await deleteObject(key);

    return NextResponse.json(
      {
        success: true,

        message:
"AWS S3 connection verified successfully.",

        data: {
  provider:
    STORAGE_PROVIDER,

  bucket,

  region:
    process.env.AWS_REGION,

  key,

  uploaded: true,

  deleted: true,

  testedAt:
    new Date().toISOString(),
},
      },
      {
        status: 200,
      }
    );
  } catch (error) {

  console.error(
    "Developer Tools Storage",
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

  if (
    error instanceof Error
  ) {

    return NextResponse.json(
      {
        success: false,
        message:
          error.message,
      },
      {
        status: 500,
      }
    );

  }

  return internalError(error);

}
}