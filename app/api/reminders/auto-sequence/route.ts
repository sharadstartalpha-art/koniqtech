import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

import {
  ReminderMode,
  ReminderType,
} from "@prisma/client";

export async function POST(
  req: Request
) {
  try {
    /* =========================
       AUTH
    ========================= */

    const user =
      await getUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /* =========================
       BODY
    ========================= */

    const body =
      await req.json();

    const {
      invoiceId,
      reminders,
      amount,
      amountMode,
    } = body;

    /* =========================
       VALIDATION
    ========================= */

    if (!invoiceId) {
      return NextResponse.json(
        {
          error:
            "Invoice required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Array.isArray(
        reminders
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid reminders",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       GET INVOICE
    ========================= */

    const invoice =
      await prisma.invoice.findUnique(
        {
          where: {
            id: invoiceId,
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
       CREATE SCHEDULES
    ========================= */

    for (const reminder of reminders) {
      if (
        !reminder.templateId
      ) {
        continue;
      }

      const sendDate =
        new Date();

      sendDate.setDate(
        sendDate.getDate() +
          Number(
            reminder.delay ||
              0
          )
      );

      await prisma.reminderSchedule.create(
        {
          data: {
            userId:
              user.id,

            invoiceId:
              invoice.id,

            templateId:
              reminder.templateId,

            step: Number(
              reminder.step ||
                1
            ),

            amount:
              Number(
                amount || 0
              ),

            mode:
              (amountMode ||
                "auto") as ReminderMode,

            type:
              (reminder.type ||
                "friendly") as ReminderType,

            sendAt:
              sendDate,

            status:
              "pending",
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(
      "AUTO SEQUENCE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}