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

    for (
      let i = 0;
      i < reminders.length;
      i++
    ) {
      const reminder =
        reminders[i];

      if (
        !reminder.templateId
      ) {
        continue;
      }

      /* =========================
         SEND DATE
      ========================= */

      const sendDate =
        new Date();

      sendDate.setDate(
        sendDate.getDate() +
          Number(
            reminder.delay || 0
          )
      );

      /* =========================
         TYPE
      ========================= */

      let type: ReminderType =
        ReminderType.friendly;

      if (
        reminder.type ===
        "firm"
      ) {
        type =
          ReminderType.firm;
      }

      if (
        reminder.type ===
        "final"
      ) {
        type =
          ReminderType.final;
      }

      /* =========================
         CREATE
      ========================= */

      await prisma.reminderSchedule.create(
        {
          data: {
            userId:
              user.id,

            invoiceId:
              invoice.id,

            templateId:
              reminder.templateId,

            step:
              Number(
                reminder.step ||
                  i + 1
              ),

            amount:
              Number(
                amount || 0
              ),

            type,

            mode:
              ReminderMode.auto,

            status:
              "pending",

            sendAt:
              sendDate,
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