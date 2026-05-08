import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

import { getUser } from "@/lib/auth";

import {
  ReminderMode,
  ReminderType,
} from "@prisma/client";

/* =========================
   GET SCHEDULES
========================= */

export async function GET() {
  try {
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

    const schedules =
      await prisma.reminderSchedule.findMany(
        {
          where: {
            userId:
              user.id,
          },

          include: {
            template: true,
            invoice: true,
          },

          orderBy: {
            createdAt:
              "asc",
          },
        }
      );

    return NextResponse.json(
      schedules
    );

  } catch (err) {
    console.error(
      "GET SCHEDULE ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch schedules",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   CREATE SCHEDULE
========================= */

export async function POST(
  req: Request
) {
  try {
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

    const body =
      await req.json();

    const {
      invoiceId,
      templateId,
      step,
      amount,
      mode,
      sendAt,
      type,
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

    if (!templateId) {
      return NextResponse.json(
        {
          error:
            "Template required",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       CREATE
    ========================= */

    const schedule =
      await prisma.reminderSchedule.create(
        {
          data: {
            userId:
              user.id,

            invoiceId,

            templateId,

            step:
              Number(
                step || 1
              ),

            amount:
              Number(
                amount || 0
              ),

            mode:
              (mode ||
                "auto") as ReminderMode,

            type:
              (type ||
                "friendly") as ReminderType,

            sendAt:
              sendAt
                ? new Date(
                    sendAt
                  )
                : new Date(),

            status:
              "pending",
          },

          include: {
            template: true,
            invoice: true,
          },
        }
      );

    return NextResponse.json({
      success: true,
      schedule,
    });

  } catch (err) {
    console.error(
      "SAVE SCHEDULE ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to save schedule",
      },
      {
        status: 500,
      }
    );
  }
}