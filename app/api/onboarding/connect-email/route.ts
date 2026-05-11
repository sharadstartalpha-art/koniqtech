import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

import { NextResponse } from "next/server";

/* =========================================
   CONNECT BUSINESS EMAIL
========================================= */

export async function POST(
  req: Request
) {
  try {

    /* =========================================
       AUTH
    ========================================= */

    const user =
      await getUser();

    if (!user) {

      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /* =========================================
       BODY
    ========================================= */

    const body =
      await req.json();

    const {
      email,
      provider,
    } = body;

    /* =========================================
       VALIDATION
    ========================================= */

    if (!email) {

      return NextResponse.json(
        {
          error:
            "Business email required",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================================
       SAVE USER EMAIL
    ========================================= */

    await prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        businessEmail:
          email,

        emailProvider:
          provider || "gmail",
      },
    });

    /* =========================================
       UPDATE ONBOARDING
    ========================================= */

    await prisma.onboardingProgress.upsert(
      {
        where: {
          userId:
            user.id,
        },

        update: {
          connectedEmail:
            true,
        },

        create: {
          userId:
            user.id,

          connectedEmail:
            true,
        },
      }
    );

    /* =========================================
       RESPONSE
    ========================================= */

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    console.error(
      "CONNECT EMAIL ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to connect email",
      },
      {
        status: 500,
      }
    );
  }
}