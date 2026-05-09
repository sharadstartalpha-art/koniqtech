// app/api/reminder-center/route.ts

import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

import { NextResponse } from "next/server";

/* =========================================
   GET REMINDER CENTER DATA
========================================= */

export async function GET() {
  try {
    /* =========================================
       AUTH
    ========================================= */

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

    /* =========================================
       REMINDERS
    ========================================= */

    const reminders =
      await prisma.reminder.findMany({
        where: {
          userId: user.id,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 50,

        include: {
          invoice: true,
        },
      });

    /* =========================================
       COUNTS
    ========================================= */

    const totalSent =
      reminders.filter(
        (r) => r.status === "sent"
      ).length;

    const totalPending =
      reminders.filter(
        (r) => r.status === "pending"
      ).length;

    const totalFailed =
      reminders.filter(
        (r) => r.status === "failed"
      ).length;

    /* =========================================
       CHANNEL STATS
    ========================================= */

    const emailCount =
      reminders.filter(
        (r) =>
          r.mode === "manual" ||
          r.mode === "auto"
      ).length;

    // future support
    const whatsappCount = 0;

    // future support
    const smsCount = 0;

    /* =========================================
       RESPONSE
    ========================================= */

    return NextResponse.json({
      stats: {
        sent: totalSent,

        pending: totalPending,

        failed: totalFailed,

        channels: {
          email: emailCount,

          whatsapp:
            whatsappCount,

          sms: smsCount,
        },
      },

      reminders,
    });

  } catch (err) {

    console.error(
      "REMINDER CENTER ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to load reminder center",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================
   CREATE MANUAL REMINDER
========================================= */

export async function POST(
  req: Request
) {
  try {

    /* =========================================
       AUTH
    ========================================= */

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

    /* =========================================
       BODY
    ========================================= */

    const body = await req.json();

    const {
      invoiceId,
      email,
      amount,
      type,
      mode,
      html,
      text,
    } = body;

    /* =========================================
       VALIDATION
    ========================================= */

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

    /* =========================================
       CREATE REMINDER
    ========================================= */

    const reminder =
      await prisma.reminder.create({
        data: {
          userId:
            user.id,

          invoiceId,

          email,

          amount:
            Number(amount) || 0,

          type:
            type || "friendly",

          mode:
            mode || "manual",

          status: "sent",

          html:
            html ||
            "<p>Reminder sent</p>",

          text:
            text ||
            "Reminder sent",

          sentAt:
            new Date(),
        },
      });

    return NextResponse.json({
      success: true,
      reminder,
    });

  } catch (err) {

    console.error(
      "CREATE REMINDER ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to create reminder",
      },
      {
        status: 500,
      }
    );
  }
}