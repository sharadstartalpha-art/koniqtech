import { Worker } from "bullmq";

import IORedis from "ioredis";

import { prisma } from "@/lib/prisma";

import { sendEmail } from "@/lib/email";

import {
  generateEmail,
} from "@/lib/aiEmail";

/* =========================================
   REDIS CONNECTION
========================================= */

const connection =
  new IORedis(
    process.env.REDIS_URL!
  );

/* =========================================
   REMINDER WORKER
========================================= */

new Worker(
  "reminders",

  async () => {
    try {

      console.log(
        "🤖 Reminder worker started"
      );

      /* =====================================
         GET UNPAID INVOICES
      ===================================== */

      const invoices =
        await prisma.invoice.findMany({
          where: {
            status:
              "unpaid",
          },
        });

      /* =====================================
         LOOP
      ===================================== */

      for (const inv of invoices) {

        /* ===================================
           VALIDATION
        =================================== */

        if (!inv.clientEmail) {

          console.warn(
            "⚠️ Missing client email:",
            inv.id
          );

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

            type:
              "friendly",

            clientName:
              inv.clientName ||
              "Customer",

            paymentLink:
              inv.paymentLink ||
              undefined,

            senderName:
              "KoniqTech Team",

            companyName:
              "KoniqTech",

            senderEmail:
              "info@koniqtech.com",
          });

        /* ===================================
           VALIDATE GENERATED EMAIL
        =================================== */

        if (
          !email.html ||
          !email.text
        ) {

          console.warn(
            "⚠️ Email generation failed:",
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

        console.log(
          `📧 Reminder sent → ${inv.clientEmail}`
        );
      }

      console.log(
        "✅ Reminder worker completed"
      );

    } catch (err) {

      console.error(
        "❌ Worker error:",
        err
      );

      throw err;
    }
  },

  {
    connection,
  }
);