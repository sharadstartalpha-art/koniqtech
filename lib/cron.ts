// lib/cron.ts

import { prisma } from "@/lib/prisma";

import { sendEmail } from "@/lib/email";

// future
// import { sendSMS } from "@/lib/sms";
// import { sendWhatsApp } from "@/lib/whatsapp";

export async function GET() {
  try {

    console.log(
      "🚀 AUTO REMINDER CRON START"
    );

    /* =========================================
       GET PENDING SCHEDULES
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

        /* =========================================
           GET INVOICE
        ========================================= */

        const invoice =
          await prisma.invoice.findUnique(
            {
              where: {
                id: schedule.invoiceId,
              },
            }
          );

        if (!invoice) {

          console.log(
            "❌ Invoice missing"
          );

          continue;
        }

        /* =========================================
           TEMPLATE
        ========================================= */

        if (!schedule.templateId) {

          console.log(
            "❌ Template missing"
          );

          continue;
        }

        const template =
          await prisma.reminderTemplate.findUnique(
            {
              where: {
                id: schedule.templateId,
              },
            }
          );

        if (!template) {

          console.log(
            "❌ Template not found"
          );

          continue;
        }

        /* =========================================
           PREVENT DUPLICATES
        ========================================= */

        const alreadySent =
          await prisma.reminder.findFirst(
            {
              where: {
                scheduleId:
                  schedule.id,
              },
            }
          );

        if (alreadySent) {

          console.log(
            "⏭️ Already sent"
          );

          continue;
        }

        /* =========================================
           CREATE LOG FIRST
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
                  "email",

                status:
                  "sent",

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
           TRACKING URLS
        ========================================= */

        const trackingPixel =
          `https://koniqtech.com/api/track/open/${log.id}`;

        const clickLink =
          `https://koniqtech.com/api/track/click/${log.id}`;

        /* =========================================
           HTML VARIABLES
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
              clickLink
            )

            .replaceAll(
              "{{trackingPixel}}",
              `<img src="${trackingPixel}" width="1" height="1" />`
            );

        const text =
          html.replace(
            /<[^>]*>/g,
            ""
          );

        /* =========================================
           SEND EMAIL
        ========================================= */

        if (
          schedule.mode === "auto"
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

        /* =========================================
           FUTURE SMS
        ========================================= */

        // if (schedule.channel === "sms") {
        //   await sendSMS(...)
        // }

        /* =========================================
           FUTURE WHATSAPP
        ========================================= */

        // if (schedule.channel === "whatsapp") {
        //   await sendWhatsApp(...)
        // }

        /* =========================================
           SAVE REMINDER
        ========================================= */

        await prisma.reminder.create(
          {
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
                schedule.type,

              mode:
                schedule.mode,

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
          }
        );

        /* =========================================
           UPDATE SCHEDULE
        ========================================= */

        await prisma.reminderSchedule.update(
          {
            where: {
              id: schedule.id,
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
              id: schedule.id,
            },

            data: {
              status:
                "failed",
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