import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {
    /* =========================
       AUTH USER
    ========================= */

    const user = await getUser();

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

    /* =========================
       BODY
    ========================= */

    const body = await req.json();

    const {
      invoiceId,
      steps,
    } = body;

    /* =========================
       VALIDATION
    ========================= */

    if (!invoiceId) {
      return NextResponse.json(
        {
          error:
            "Invoice ID required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !steps ||
      !Array.isArray(steps) ||
      steps.length === 0
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

    /* =========================
       FIND INVOICE
    ========================= */

    const invoice =
      await prisma.invoice.findFirst(
        {
          where: {
            id: invoiceId,
            userId: user.id,
          },
        }
      );

    if (!invoice) {
      return NextResponse.json(
        {
          error:
            "Invoice not found",
        },
        {
          status: 404,
        }
      );
    }

    /* =========================
       CREATE WORKFLOW STEPS
    ========================= */

    const created = [];

    for (
      let i = 0;
      i < steps.length;
      i++
    ) {
      const step = steps[i];

      /* =========================
         SEND DATE
      ========================= */

      const sendAt = new Date();

      sendAt.setDate(
        sendAt.getDate() +
          Number(
            step.delayDays || 0
          )
      );

      /* =========================
         FIND TEMPLATE
      ========================= */

      const template =
        await prisma.reminderTemplate.findFirst(
          {
            where: {
              userId: user.id,

              type:
                step.tone?.toLowerCase() ||
                "friendly",
            },
          }
        );

      /* =========================
         CREATE SCHEDULE
      ========================= */

      const workflow =
        await prisma.reminderSchedule.create(
          {
            data: {
              userId:
                user.id,

              invoiceId:
                invoice.id,

              templateId:
                template?.id || "",

              type:
                step.tone?.toLowerCase() ||
                "friendly",

              mode:
                step.channel?.toLowerCase() ===
                "manual"
                  ? "manual"
                  : "auto",

              status: "pending",

              step: i + 1,

              amount:
                invoice.balanceAmount ||
                invoice.amount,

              sendAt,
            },
          }
        );

      created.push(workflow);
    }

    /* =========================
       RESPONSE
    ========================= */

    return NextResponse.json({
      success: true,
      workflows: created,
    });

  } catch (err) {

    console.error(
      "AUTOMATION CREATE ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to save workflow",
      },
      {
        status: 500,
      }
    );
  }
}