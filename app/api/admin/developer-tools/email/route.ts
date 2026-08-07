/**
 * ============================================================
 * Developer Tools - Email API
 * ============================================================
 *
 * GET
 *   Email configuration
 *
 * POST
 *   Send test email
 *
 * Provider
 *   Resend
 *
 * ============================================================
 */
import { NextRequest, NextResponse } from "next/server";

import {
  Prisma,
  UserRole,
} from "@prisma/client";

import { auth } from "@/auth";
import { resend } from "@/shared/lib/resend";

import {
  sendTestEmailSchema,
} from "@/shared/lib/validators/email";


const EMAIL_PROVIDER = "Resend";

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


function isEmailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY &&
    process.env.RESEND_FROM_EMAIL
  );
}

function getEmailConfiguration() {
  return {
    provider: EMAIL_PROVIDER,

    configured:
      isEmailConfigured(),

    from:
      process.env.RESEND_FROM_EMAIL ??
      null,

    replyTo:
      process.env.RESEND_REPLY_TO ??
      null,

    environment:
      process.env.NODE_ENV,

    apiKeyConfigured:
      Boolean(
        process.env.RESEND_API_KEY
      ),
  };
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

    return NextResponse.json(
      {
        success: true,

        data: getEmailConfiguration(),
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

    const rawBody =
      await request.json();

    const parsed =
      sendTestEmailSchema.safeParse(
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
      email,
      subject,
      message,
    } = parsed.data;

    if (!process.env.RESEND_API_KEY) {
  return NextResponse.json(
    {
      success: false,
      message:
        "RESEND_API_KEY is not configured.",
    },
    {
      status: 500,
    }
  );
}

if (!process.env.RESEND_FROM_EMAIL) {
  return NextResponse.json(
    {
      success: false,
      message:
        "RESEND_FROM_EMAIL is not configured.",
    },
    {
      status: 500,
    }
  );
}

    const result =
      await resend.emails.send({

        from:
          process.env
            .RESEND_FROM_EMAIL!,

        to: email,

        subject,

       html: `
<div
  style="
    font-family:Arial,sans-serif;
    max-width:600px;
    margin:auto;
    padding:24px;
    border:1px solid #e5e7eb;
    border-radius:8px;
  "
>

<h2>
KoniqTech Developer Tools
</h2>

<p>
This is a test email generated from the
Developer Tools panel.
</p>

<hr>

<h3>${subject}</h3>

<p>${message}</p>

<hr>

<p
style="
font-size:12px;
color:#6b7280;
"
>

Environment:
${process.env.NODE_ENV}

</p>

</div>
`,
      });

      if (
  "error" in result &&
  result.error
) {
  return NextResponse.json(
    {
      success: false,
      message:
        result.error.message,
    },
    {
      status: 400,
    }
  );
}
    return NextResponse.json(
      {
        success: true,

        message:
          "Email sent successfully.",

        data: result,
      },
      {
        status: 200,
      }
    );

  } 

  catch (error) {

  console.error(
    "Developer Tools Email",
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

  return internalError(
    error
  );

}
}