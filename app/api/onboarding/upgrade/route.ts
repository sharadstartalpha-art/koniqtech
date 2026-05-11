import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

import { NextResponse } from "next/server";

export async function POST() {
  try {

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

    await prisma.onboardingProgress.upsert(
      {
        where: {
          userId:
            user.id,
        },

        update: {
          upgradedPlan:
            true,

          completed:
            true,
        },

        create: {
          userId:
            user.id,

          upgradedPlan:
            true,

          completed:
            true,
        },
      }
    );

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    console.error(
      "UPGRADE ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to update onboarding",
      },
      {
        status: 500,
      }
    );
  }
}