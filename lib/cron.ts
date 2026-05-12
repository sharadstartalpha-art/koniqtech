import {
  ReminderType,
  ReminderMode,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

import { sendEmail } from "@/lib/email";

import { sendSMS } from "@/lib/sms";

import { sendWhatsApp } from "@/lib/whatsapp";

export async function GET() {
  try {

    console.log(
      "🚀 AUTO REMINDER CRON START"
    );

    /* =========================================
       GET PENDING
    ========================================= */

    const schedules =
      await prisma.reminderSchedule.findMany(
        {
          where: {
            status: "pending",

            sendAt: {
              lte: new Date(),
            },
          },

          include: {
            invoice: true,

            template: true,
          },

          orderBy: {
            sendAt: "asc",
          },
        }
      );

    console.log(
      `📦 Found ${schedules.length} schedules`
    );

    /* =========================================
       LOOP
    ========================================= */

    for (const schedule of schedules) {

      try {

        const invoice =
          schedule.invoice;

        const template =
          schedule.template;

        if (!invoice) {
          console.log(
            "❌ Invoice missing"
          );

          continue;
        }

        if (!template) {
          console.log(
            "❌ Template missing"
          );

          continue;
        }

        /* =========================================
           DUPLICATE CHECK
        ========================================= */

        const existing =
          await prisma.reminder.findFirst(
            {
              where: {
                scheduleId:
                  schedule.id,
              },
            }
          );

        if (existing) {

          console.log(
            "⏭️ Already sent"
          );

          continue;
        }

        /* =========================================
           CREATE LOG
        ========================================= */

        const log =
          await prisma.reminderLog.create(
            {
              data: {
                userId:
                  schedule.userId,

                invoiceId:
                  invoice.id,

                channel:
                  schedule.channel,

                status:
                  "processing",

                recipient:
                  invoice.clientEmail,

                subject:
                  template.subject,

                message:
                  template.html,
              },
            }
          );

        /* =========================================
           TRACKING
        ========================================= */

        const openUrl =
          `https://koniqtech.com/api/track/open/${log.id}`;

        const clickUrl =
          `https://koniqtech.com/api/track/click/${log.id}`;

        /* =========================================
           VARIABLES
        ========================================= */

        const html =
          template.html

            .replaceAll(
              "{{name}}",
              invoice.clientName ||
                invoice.clientEmail.split(
                  "@"
                )[0]
            )

            .replaceAll(
              "{{amount}}",
              String(
                schedule.amount
              )
            )

            .replaceAll(
              "{{email}}",
              invoice.clientEmail
            )

            .replaceAll(
              "{{dueDate}}",
              new Date(
                invoice.dueDate
              ).toLocaleDateString()
            )

            .replaceAll(
              "{{link}}",
              clickUrl
            )

            .replaceAll(
              "{{trackingPixel}}",
              `<img src="${openUrl}" width="1" height="1" />`
            );

        const text =
          html.replace(
            /<[^>]*>/g,
            ""
          );

        /* =========================================
           SEND CHANNEL
        ========================================= */

        // EMAIL

        if (
          schedule.channel ===
          "email"
        ) {

          await sendEmail({
            to:
              invoice.clientEmail,

            subject:
              template.subject,

            html,
          });

          console.log(
            `📧 Email sent → ${invoice.clientEmail}`
          );
        }

        // SMS

        if (
          schedule.channel ===
          "sms"
        ) {

          if (
            invoice.clientPhone
          ) {

            await sendSMS({
              to:
                invoice.clientPhone,

              body:
                text,
            });

            console.log(
              `📱 SMS sent → ${invoice.clientPhone}`
            );
          }
        }

        // WHATSAPP

        if (
          schedule.channel ===
          "whatsapp"
        ) {

          if (
            invoice.clientPhone
          ) {

            await sendWhatsApp({
              to:
                invoice.clientPhone,

              body:
                text,
            });

            console.log(
              `💬 WhatsApp sent → ${invoice.clientPhone}`
            );
          }
        }

        /* =========================================
           SAVE REMINDER
        ========================================= */
await prisma.reminder.create({
  data: {
    userId:
      schedule.userId,

    invoiceId:
      invoice.id,

    email:
      invoice.clientEmail,

    amount:
      schedule.amount,

    type:
      schedule.type as ReminderType,

    mode:
      schedule.mode as ReminderMode,

    status:
      "sent",

    html,

    text,

    templateId:
      template.id,

    scheduleId:
      schedule.id,

    sentAt:
      new Date(),
  },
});
        /* =========================================
           UPDATE LOG
        ========================================= */

        await prisma.reminderLog.update(
          {
            where: {
              id:
                log.id,
            },

            data: {
              status:
                "sent",
            },
          }
        );

        /* =========================================
           UPDATE SCHEDULE
        ========================================= */

        await prisma.reminderSchedule.update(
          {
            where: {
              id:
                schedule.id,
            },

            data: {
              status:
                "sent",
            },
          }
        );

        console.log(
          "✅ Reminder completed"
        );

      } catch (singleError) {

        console.error(
          "❌ SINGLE REMINDER ERROR:",
          singleError
        );

        await prisma.reminderSchedule.update(
          {
            where: {
              id:
                schedule.id,
            },

            data: {
              status:
                "failed",

              retryCount: {
                increment: 1,
              },
            },
          }
        );
      }
    }

    console.log(
      "✅ CRON FINISHED"
    );

    return Response.json({
      success: true,
    });

  } catch (err) {

    console.error(
      "❌ CRON ERROR:",
      err
    );

    return Response.json(
      {
        error:
          "Cron failed",
      },
      {
        status: 500,
      }
    );
  }
}