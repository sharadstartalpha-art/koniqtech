// app/api/sms/route.ts

import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

import { NextResponse } from "next/server";

/* =========================================
   GET SMS LOGS
========================================= */

export async function GET() {
  try {

    /* =========================================
       AUTH
    ========================================= */

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

    /* =========================================
       GET LOGS
    ========================================= */

    const logs =
      await prisma.reminderLog.findMany({
        where: {
          userId: user.id,

          channel:
            "sms",
        },

        include: {
          invoice: true,
        },

        orderBy: {
          createdAt:
            "desc",
        },

        take: 100,
      });

    /* =========================================
       STATS
    ========================================= */

    const sent =
      logs.filter(
        (l) =>
          l.status ===
          "sent"
      ).length;

    const pending =
      logs.filter(
        (l) =>
          l.status ===
          "pending"
      ).length;

    const failed =
      logs.filter(
        (l) =>
          l.status ===
          "failed"
      ).length;

    /* =========================================
       RESPONSE
    ========================================= */

    return NextResponse.json({
      success: true,

      stats: {
        sent,
        pending,
        failed,
      },

      logs,
    });

  } catch (err) {

    console.error(
      "SMS GET ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to load SMS logs",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================
   SEND SMS
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
          error:
            "Unauthorized",
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
      invoiceId,
      phone,
      message,
    } = body;

    /* =========================================
       VALIDATION
    ========================================= */

    if (
      !invoiceId ||
      !phone
    ) {
      return NextResponse.json(
        {
          error:
            "Invoice ID & phone required",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================================
       FIND INVOICE
    ========================================= */

    const invoice =
      await prisma.invoice.findFirst({
        where: {
          id: invoiceId,

          userId:
            user.id,
        },
      });

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

    /* =========================================
       FINAL MESSAGE
    ========================================= */

    const finalMessage =
      message ||
      `Invoice payment of $${invoice.amount} is pending. Please complete payment soon.`;

    /* =========================================
       SAVE REMINDER
    ========================================= */

    const reminder =
      await prisma.reminder.create({
        data: {
          userId:
            user.id,

          invoiceId:
            invoice.id,

          email:
            invoice.clientEmail,

          amount:
            invoice.amount,

          type:
            "friendly",

          mode:
            "manual",

          channel:
            "sms",

          status:
            "sent",

          html: `<p>${finalMessage}</p>`,

          text:
            finalMessage,

          sentAt:
            new Date(),
        },
      });

    /* =========================================
       SAVE LOG
    ========================================= */

    await prisma.reminderLog.create({
      data: {
        userId:
          user.id,

        invoiceId:
          invoice.id,

        channel:
          "sms",

        status:
          "sent",

        recipient:
          phone,

        subject:
          "SMS Reminder",

        message:
          finalMessage,
      },
    });

    /* =========================================
       REAL SMS API
    ========================================= */

    // Integrate:
    // Twilio SMS
    // Vonage
    // TextLocal
    // AWS SNS

    console.log(
      "📲 SMS SENT:",
      phone
    );

    /* =========================================
       RESPONSE
    ========================================= */

    return NextResponse.json({
      success: true,
      reminder,
    });

  } catch (err) {

    console.error(
      "SMS SEND ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to send SMS",
      },
      {
        status: 500,
      }
    );
  }
}