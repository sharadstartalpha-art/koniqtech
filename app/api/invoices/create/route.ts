import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

import { cookies } from "next/headers";

import { jwtVerify } from "jose";

import { generateEmail } from "@/lib/aiEmail";

import { sendEmail } from "@/lib/email";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET
);

type ReminderWorkflowItem = {
  day: number;
  type:
    | "friendly"
    | "firm"
    | "final";
};

export async function POST(
  req: Request
) {
  try {

    /* =========================================
       BODY
    ========================================= */

    const body =
      await req.json();

    const {
      clientEmail,
      clientName,
      clientPhone,
      amount,
      dueDate,

      mode = "auto",

      autoSendFirstReminder = true,

      reminderWorkflow = [
        {
          day: 3,
          type: "friendly",
        },

        {
          day: 7,
          type: "firm",
        },

        {
          day: 14,
          type: "final",
        },
      ],
    } = body;

    /* =========================================
       VALIDATION
    ========================================= */

    if (
      !clientEmail ||
      !amount ||
      !dueDate
    ) {

      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================================
       AUTH
    ========================================= */

    const cookieStore =
      await cookies();

    const token =
      cookieStore.get("token")
        ?.value;

    if (!token) {

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

    let userId = "";

    try {

      const { payload } =
        await jwtVerify(
          token,
          JWT_SECRET
        );

      userId =
        payload.id as string;

    } catch {

      return NextResponse.json(
        {
          error:
            "Invalid session",
        },
        {
          status: 401,
        }
      );
    }

    /* =========================================
       USER
    ========================================= */

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!user) {

      return NextResponse.json(
        {
          error:
            "User not found",
        },
        {
          status: 404,
        }
      );
    }

    /* =========================================
       PRODUCT
    ========================================= */

    const product =
      await prisma.product.findUnique(
        {
          where: {
            slug:
              "invoice-recovery",
          },
        }
      );

    if (!product) {

      return NextResponse.json(
        {
          error:
            "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    /* =========================================
       ACTIVE SUBSCRIPTION
    ========================================= */

    const subscription =
      await prisma.subscription.findFirst(
        {
          where: {
            userId,

            productId:
              product.id,

            status: {
              equals:
                "ACTIVE",

              mode:
                "insensitive",
            },
          },

          include: {
            plan: true,
          },

          orderBy: {
            createdAt:
              "desc",
          },
        }
      );

    if (!subscription) {

      return NextResponse.json(
        {
          error:
            "No active subscription",
        },
        {
          status: 403,
        }
      );
    }

    /* =========================================
       LIMIT CHECK
    ========================================= */

    const limit =
      subscription.plan
        ?.invoiceLimit;

    const totalInvoices =
      await prisma.invoice.count(
        {
          where: {
            userId,

            productId:
              product.id,
          },
        }
      );

    if (
      limit !== null &&
      limit !== -1 &&
      totalInvoices >= limit
    ) {

      return NextResponse.json(
        {
          error:
            "Invoice limit reached",
        },
        {
          status: 403,
        }
      );
    }

    /* =========================================
       USER PAYMENT LINKS
    ========================================= */

    let paymentLink:
      | string
      | null = null;

    if (user.paypalMe) {

      paymentLink =
        user.paypalMe;
    }

    else if (
      user.stripeLink
    ) {

      paymentLink =
        user.stripeLink;
    }

    else if (
      user.razorpayLink
    ) {

      paymentLink =
        user.razorpayLink;
    }

    else if (
      user.customPaymentLink
    ) {

      paymentLink =
        user.customPaymentLink;
    }

    else if (
      user.upiId
    ) {

      paymentLink =
        `upi://pay?pa=${user.upiId}&pn=${encodeURIComponent(
          user.companyName ||
            user.name ||
            "Business"
        )}&am=${Number(
          amount
        )}`;
    }

    /* =========================================
       CREATE INVOICE
    ========================================= */

    const invoice =
      await prisma.invoice.create(
        {
          data: {
            userId,

            productId:
              product.id,

            clientEmail,

            clientName:
              clientName ||
              null,

            clientPhone:
              clientPhone ||
              null,

            amount:
              Number(amount),

            dueDate:
              new Date(
                dueDate
              ),

            status:
              "unpaid",

            mode,

            paymentLink,

            autoReminder:
              mode ===
              "auto",

            autoSendFirstReminder,

            reminderWorkflow:
              reminderWorkflow as any,
          },
        }
      );

    /* =========================================
       CREATE REMINDER SCHEDULES
    ========================================= */

    if (
      mode === "auto" &&
      Array.isArray(
        reminderWorkflow
      )
    ) {

      for (const item of reminderWorkflow as ReminderWorkflowItem[]) {

        const sendDate =
          new Date();

        sendDate.setDate(
          sendDate.getDate() +
            Number(
              item.day
            )
        );

       await prisma.reminderSchedule.create({
  data: {
    userId,

    invoiceId:
      invoice.id,

    type:
      item.type,

    amount:
      Number(invoice.amount),

    sendAt:
      sendDate,

    status:
      "pending",
  },
});
      }
    }

    /* =========================================
       SEND FIRST REMINDER
    ========================================= */

    if (
      mode === "auto" &&
      autoSendFirstReminder
    ) {

      try {

        const email =
          generateEmail({
            amount:
              Number(
                invoice.amount
              ),

            type:
              "friendly",

            clientName:
              invoice.clientName ||
              "Customer",

            paymentLink:
              paymentLink ||
              undefined,

            senderName:
              user.name ||
              "KoniqTech",

            companyName:
              user.companyName ||
              "KoniqTech",

            senderEmail:
              user.businessEmail ||
              user.email,

            senderPhone:
              user.businessPhone ||
              user.phone ||
              undefined,
          });

        await sendEmail({
          to:
            invoice.clientEmail,

          subject:
            email.subject,

          html:
            email.html,

          text:
            email.text,
        });

        await prisma.reminder.create(
          {
            data: {
              userId,

              invoiceId:
                invoice.id,

              email:
                invoice.clientEmail,

              amount:
                Number(
                  invoice.amount
                ),

              type:
                "friendly",

              mode:
                "auto",

              status:
                "sent",

              sentAt:
                new Date(),

              html:
                email.html,

              text:
                email.text,
            },
          }
        );

        console.log(
          "✅ First reminder sent"
        );

      } catch (emailError) {

        console.error(
          "❌ Email error:",
          emailError
        );
      }
    }

    /* =========================================
       ONBOARDING
    ========================================= */

    await prisma.userOnboarding.upsert(
      {
        where: {
          userId,
        },

        update: {
          firstInvoice:
            true,
        },

        create: {
          userId,

          firstInvoice:
            true,
        },
      }
    );

    /* =========================================
       RESPONSE
    ========================================= */

    return NextResponse.json({
      success: true,

      invoice,
    });

  } catch (error: any) {

    console.error(
      "CREATE INVOICE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create invoice",

        details:
          error?.message ||
          null,
      },
      {
        status: 500,
      }
    );
  }
}