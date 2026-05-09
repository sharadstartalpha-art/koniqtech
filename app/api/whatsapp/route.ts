// app/api/whatsapp/route.ts

import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

import { NextResponse } from "next/server";

/* =========================================
   GET WHATSAPP LOGS
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
            "whatsapp",
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
      "WHATSAPP GET ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to load WhatsApp logs",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================
   SEND WHATSAPP REMINDER
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
       INVOICE
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
       WHATSAPP MESSAGE
    ========================================= */

    const finalMessage =
      message ||
      `Hello ${invoice.clientName || ""}, your invoice payment of $${invoice.amount} is still pending. Please complete payment soon.`;

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
            "whatsapp",

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
          "whatsapp",

        status:
          "sent",

        recipient:
          phone,

        subject:
          "WhatsApp Reminder",

        message:
          finalMessage,
      },
    });

    /* =========================================
       REAL WHATSAPP API
    ========================================= */

    // Integrate:
    // Twilio WhatsApp API
    // Meta WhatsApp Cloud API
    // Gupshup
    // Interakt

    console.log(
      "📲 WhatsApp sent:",
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
      "WHATSAPP SEND ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to send WhatsApp reminder",
      },
      {
        status: 500,
      }
    );
  }
}