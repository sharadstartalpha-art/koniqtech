import { prisma } from "@/lib/prisma";

import { sendEmail } from "@/lib/email";

import {
  ReminderMode,
  ReminderType,
} from "@prisma/client";

export async function GET() {
  try {
    console.log(
      "🔥 AUTO REMINDER CRON STARTED"
    );

    /* =========================
       GET PENDING SCHEDULES
    ========================= */

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
            template: true,

            invoice: {
              include: {
                user: true,
              },
            },
          },

          orderBy: {
            sendAt: "asc",
          },
        }
      );

    console.log(
      `📦 Found ${schedules.length} pending reminders`
    );

    /* =========================
       LOOP
    ========================= */

    for (const schedule of schedules) {
      try {
        const invoice =
          schedule.invoice;

        const template =
          schedule.template;

        const user =
          invoice?.user;

        /* =========================
           VALIDATION
        ========================= */

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

        /* =========================
           DUPLICATE CHECK
        ========================= */

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
            "⏭️ Reminder already sent"
          );

          continue;
        }

        /* =========================
           APPLY VARIABLES
        ========================= */

        const paymentLink = `#`;

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
              paymentLink
            );

        const text =
          html.replace(
            /<[^>]+>/g,
            ""
          );

        /* =========================
           SEND EMAIL
        ========================= */

        await sendEmail({
          to: invoice.clientEmail,

          subject:
            template.subject,

          html,

          text,

          replyTo:
            user?.email,

          fromName:
            user?.name ||
            "KoniqTech",
        });

        console.log(
          `📧 Reminder sent → ${invoice.clientEmail}`
        );

        /* =========================
           SAVE REMINDER
        ========================= */

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
                template.type as ReminderType,

              mode:
                schedule.mode as ReminderMode,

              status: "sent",

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

        /* =========================
           UPDATE SCHEDULE
        ========================= */

        await prisma.reminderSchedule.update(
          {
            where: {
              id: schedule.id,
            },

            data: {
              status: "sent",
            },
          }
        );

        console.log(
          `✅ Reminder completed → ${invoice.clientEmail}`
        );

      } catch (error) {
        console.error(
          "❌ SINGLE REMINDER FAILED:",
          error
        );

        await prisma.reminderSchedule.update(
          {
            where: {
              id: schedule.id,
            },

            data: {
              status: "failed",
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