import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

import { sendEmail } from "@/lib/email";

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

    const {
      invoiceId,
      email,
      message,
    } = body;

    if (
      !invoiceId ||
      !email
    ) {

      return NextResponse.json(
        {
          error:
            "Missing fields",
        },
        {
          status: 400,
        }
      );
    }

    const invoice =
      await prisma.invoice.findFirst(
        {
          where: {
            id:
              invoiceId,

            userId:
              user.id,
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

    await sendEmail({
      to: email,

      subject:
        "Payment Reminder",

      html:
        `
        <p>${message}</p>

        <a href="${invoice.paymentLink}">
          Pay Invoice
        </a>
        `,
    });

    await prisma.reminder.create({
      data: {
        userId:
          user.id,

        invoiceId:
          invoice.id,

        email,

        amount:
          invoice.amount,

        type:
          "friendly",

        mode:
          "manual",

        status:
          "sent",

        html:
          message,

        text:
          message,

        sentAt:
          new Date(),
      },
    });

    await prisma.onboardingProgress.upsert(
      {
        where: {
          userId:
            user.id,
        },

        update: {
          sentReminder:
            true,
        },

        create: {
          userId:
            user.id,

          sentReminder:
            true,
        },
      }
    );

    return NextResponse.json({
      success: true,
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