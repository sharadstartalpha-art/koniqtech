import { prisma } from "@/lib/prisma";

import { sendEmail } from "@/lib/email";

export async function GET() {
  try {
    console.log(
      "🚀 AUTO REMINDER CRON START"
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

          orderBy: {
            sendAt: "asc",
          },
        }
      );

    console.log(
      `📦 Found ${schedules.length} schedules`
    );

    /* =========================
       LOOP
    ========================= */

    for (const schedule of schedules) {
      try {
        /* =========================
           GET INVOICE
        ========================= */

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

        /* =========================
           GET TEMPLATE
        ========================= */

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
            "❌ Template missing"
          );

          continue;
        }

        /* =========================
           PREVENT DUPLICATES
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
            "⏭️ Already sent"
          );

          continue;
        }

        /* =========================
           APPLY VARIABLES
        ========================= */

        const html =
          template.html
            .replaceAll(
              "{{name}}",
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
              new Date().toLocaleDateString()
            )

            .replaceAll(
              "{{link}}",
              "#"
            );

        const text =
          html.replace(
            /<[^>]*>/g,
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
        });

        console.log(
          `📧 Sent → ${invoice.clientEmail}`
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
                schedule.type as any,

              mode:
                schedule.mode as any,

              status:
                "sent" as any,

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