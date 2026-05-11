import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
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

    const body =
      await req.json();

    const { steps } =
      body;

    if (
      !steps ||
      !Array.isArray(
        steps
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Workflow steps required",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================================
       SAVE TEMPLATE WORKFLOW
    ========================================= */

    for (
      let i = 0;
      i < steps.length;
      i++
    ) {

      const step =
        steps[i];

      await prisma.reminderTemplate.create(
        {
          data: {
            userId:
              user.id,

            name:
              `Workflow Step ${i + 1}`,

            subject:
              `Invoice Reminder`,

            type:
              step.tone,

            html:
              `
              <p>Hello {{name}},</p>

              <p>Your invoice payment is pending.</p>

              <p>Amount Due: {{amount}}</p>

              <a href="{{link}}">
                Pay Invoice
              </a>

              {{trackingPixel}}
              `,
          },
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
          setupWorkflow:
            true,
        },

        create: {
          userId:
            user.id,

          setupWorkflow:
            true,
        },
      }
    );

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    console.error(
      "WORKFLOW SETUP ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to setup workflow",
      },
      {
        status: 500,
      }
    );
  }
}