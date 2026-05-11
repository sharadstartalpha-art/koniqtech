import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

import { NextResponse } from "next/server";

export async function GET() {
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

    const progress =
      await prisma.onboardingProgress.findUnique(
        {
          where: {
            userId:
              user.id,
          },
        }
      );

    if (!progress) {

      return NextResponse.json({
        percentage: 0,

        steps: {
          connectedEmail:
            false,

          createdInvoice:
            false,

          setupWorkflow:
            false,

          sentReminder:
            false,

          upgradedPlan:
            false,
        },
      });
    }

    const completedSteps = [

      progress.connectedEmail,

      progress.createdInvoice,

      progress.setupWorkflow,

      progress.sentReminder,

      progress.upgradedPlan,

    ].filter(Boolean).length;

    const percentage =
      Math.round(
        (completedSteps / 5) *
          100
      );

    return NextResponse.json({
      percentage,

      completed:
        progress.completed,

      steps: {
        connectedEmail:
          progress.connectedEmail,

        createdInvoice:
          progress.createdInvoice,

        setupWorkflow:
          progress.setupWorkflow,

        sentReminder:
          progress.sentReminder,

        upgradedPlan:
          progress.upgradedPlan,
      },
    });

  } catch (err) {

    console.error(
      "ONBOARDING PROGRESS ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to load progress",
      },
      {
        status: 500,
      }
    );
  }
}