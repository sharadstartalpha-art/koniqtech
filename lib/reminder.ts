import { prisma } from "./prisma";

import {
  generateEmail,
  type EmailType,
} from "./aiEmail";

import { sendEmail } from "./email";

/* =========================================
   RUN AUTO REMINDERS
========================================= */

export async function runReminders() {
  try {

    console.log(
      "🤖 AI Reminder Job Started"
    );

    /* =====================================
       GET UNPAID AUTO INVOICES
    ===================================== */

    const invoices =
      await prisma.invoice.findMany({
        where: {
          status: "unpaid",

          mode: "auto",
        },

        include: {
          user: true,
        },
      });

    /* =====================================
       LOOP
    ===================================== */

    for (const inv of invoices) {

      /* ===================================
         CALCULATE DAYS LATE
      =================================== */

      const daysLate =
        (
          Date.now() -
          new Date(
            inv.dueDate
          ).getTime()
        ) /
        (1000 * 60 * 60 * 24);

      /* ===================================
         DETERMINE EMAIL TYPE
      =================================== */

      let type:
        | EmailType
        | null = null;

      if (
        daysLate >= 1 &&
        daysLate < 3
      ) {

        type = "friendly";

      } else if (
        daysLate >= 3 &&
        daysLate < 7
      ) {

        type = "firm";

      } else if (
        daysLate >= 7
      ) {

        type = "final";
      }

      if (!type) {
        continue;
      }

      /* ===================================
         PREVENT DUPLICATES
      =================================== */

      const alreadySent =
        await prisma.reminder.findFirst({
          where: {
            invoiceId:
              inv.id,

            type,
          },
        });

      if (alreadySent) {
        continue;
      }

      /* ===================================
         GENERATE EMAIL
      =================================== */

      const email =
        generateEmail({
          amount:
            Number(
              inv.amount
            ) || 0,

          type,

          clientName:
            inv.clientName ||
            "Customer",

          paymentLink:
            inv.paymentLink ||
            undefined,

          senderName:
            inv.user?.name ||
            inv.user?.email?.split("@")[0] ||
            "KoniqTech Team",

          companyName:
            inv.user?.companyName ||
            inv.user?.name ||
            "KoniqTech",

          senderEmail:
            inv.user?.email ||
            "info@koniqtech.com",

          senderPhone:
            inv.user?.phone ||
            "",
        });

      /* ===================================
         VALIDATE
      =================================== */

      if (
        !email.html ||
        !email.text
      ) {

        console.error(
          "❌ Email generation failed:",
          inv.id
        );

        continue;
      }

      /* ===================================
         SEND EMAIL
      =================================== */

      await sendEmail({
        to:
          inv.clientEmail,

        subject:
          email.subject,

        html:
          email.html,

        text:
          email.text,
      });

      /* ===================================
         SAVE REMINDER
      =================================== */

      await prisma.reminder.create({
        data: {
          userId:
            inv.userId,

          invoiceId:
            inv.id,

          email:
            inv.clientEmail,

          amount:
            Number(
              inv.amount
            ) || 0,

          type,

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
      });

      console.log(
        `📧 ${type} reminder sent → ${inv.clientEmail}`
      );
    }

    console.log(
      "✅ AI Reminder Job Finished"
    );

  } catch (error) {

    console.error(
      "❌ Reminder job failed:",
      error
    );
  }
}