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
       REMINDER LOGS
    ========================================= */

    const logs =
      await prisma.reminderLog.findMany({
        where: {
          userId: user.id,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 100,

        include: {
          invoice: true,
        },
      });

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
       REAL ANALYTICS
    ========================================= */

    const sent =
      logs.filter(
        (l) => l.status === "sent"
      ).length;

    const failed =
      logs.filter(
        (l) => l.status === "failed"
      ).length;

    const opened =
      logs.filter(
        (l) => l.status === "opened"
      ).length;

    const pending =
      logs.filter(
        (l) => l.status === "pending"
      ).length;

    /* =========================================
       CHANNEL STATS
    ========================================= */

    const email =
      logs.filter(
        (l) =>
          l.channel === "email"
      ).length;

    const whatsapp =
      logs.filter(
        (l) =>
          l.channel === "whatsapp"
      ).length;

    const sms =
      logs.filter(
        (l) =>
          l.channel === "sms"
      ).length;

    /* =========================================
       RESPONSE
    ========================================= */

    return NextResponse.json({
      stats: {
        sent,
        failed,
        opened,
        pending,

        channels: {
          email,
          whatsapp,
          sms,
        },
      },

      reminders,

      logs,
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
      userId: user.id,

      invoiceId,

      email,

      amount:
        Number(amount) || 0,

      type:
        type || "friendly",

      mode: "manual",

      channel:
        mode || "email",

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
    /* =========================================
       CREATE LOG ENTRY
    ========================================= */

    await prisma.reminderLog.create({
      data: {
        userId:
          user.id,

        invoiceId,

        channel:
          mode || "email",

        status: "sent",

        recipient:
          email,

        subject:
          type || "Reminder",

        message:
          text || "Reminder sent",
      },
    });

    /* =========================================
       RESPONSE
    ========================================= */

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