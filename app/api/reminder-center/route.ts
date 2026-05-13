import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

import { sendEmail } from "@/lib/email";

import { sendSMS } from "@/lib/sms";

import { sendWhatsApp } from "@/lib/whatsapp";

import { NextResponse } from "next/server";

/* =========================================
   GET REMINDER CENTER
========================================= */

export async function GET() {
  try {

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

    const logs =
      await prisma.reminderLog.findMany({
        where: {
          userId: user.id,
        },

        orderBy: {
          createdAt: "desc",
        },

        include: {
          invoice: true,
        },

        take: 100,
      });

    const reminders =
      await prisma.reminder.findMany({
        where: {
          userId: user.id,
        },

        orderBy: {
          createdAt: "desc",
        },

        include: {
          invoice: true,
        },

        take: 100,
      });

    return NextResponse.json({
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
          "Failed to load reminders",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================
   SEND MANUAL REMINDER
========================================= */

export async function POST(
  req: Request
) {
  try {

    /* =====================================
       AUTH
    ===================================== */

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

    /* =====================================
       BODY
    ===================================== */

    const body =
      await req.json();

    const {
      invoiceId,
      email,
      phone,
      amount,
      type,
      channel,
      html,
      text,
      subject,
    } = body;

    /* =====================================
       VALIDATION
    ===================================== */

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

    if (!channel) {
      return NextResponse.json(
        {
          error:
            "Channel required",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================
       SEND EMAIL
    ===================================== */

    if (channel === "email") {

      if (!email) {
        return NextResponse.json(
          {
            error:
              "Email required",
          },
          {
            status: 400,
          }
        );
      }

      await sendEmail({
        to: email,

        subject:
          subject ||
          "Payment Reminder",

        html,

        text,
      });
    }

    /* =====================================
       SEND SMS
    ===================================== */

    if (channel === "sms") {

      if (!phone) {
        return NextResponse.json(
          {
            error:
              "Phone required",
          },
          {
            status: 400,
          }
        );
      }

      await sendSMS({
        to: phone,

        body:
          text ||
          "Payment reminder",
      });
    }

    /* =====================================
       SEND WHATSAPP
    ===================================== */

    if (
      channel === "whatsapp"
    ) {

      if (!phone) {
        return NextResponse.json(
          {
            error:
              "Phone required",
          },
          {
            status: 400,
          }
        );
      }

      await sendWhatsApp({
        to: phone,

        body:
          text ||
          "Payment reminder",
      });
    }

    /* =====================================
       SAVE REMINDER
    ===================================== */

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
            type ||
            "friendly",

          mode:
            "manual",

          channel,

          status:
            "sent",

          html:
            html ||
            "",

          text:
            text ||
            "",

          sentAt:
            new Date(),
        },
      });

    /* =====================================
       SAVE LOG
    ===================================== */

    await prisma.reminderLog.create({
      data: {
        userId:
          user.id,

        invoiceId,

        channel,

        status:
          "sent",

        recipient:
          email || phone,

        subject:
          subject ||
          "Reminder",

        message:
          text ||
          "",
      },
    });

    return NextResponse.json({
      success: true,
      reminder,
    });

  } catch (err) {

    console.error(
      "SEND REMINDER ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to send reminder",
      },
      {
        status: 500,
      }
    );
  }
}