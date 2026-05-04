import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function GET() {
  try {
    const schedules = await prisma.reminderSchedule.findMany({
      where: { enabled: true },
      include: {
        template: true, // ✅ now works
      },
    });

    const invoices = await prisma.invoice.findMany({
      where: {
        status: "unpaid", // ✅ match your DB
      },
    });

    const now = new Date();

    for (const schedule of schedules) {
      for (const invoice of invoices) {
        const due = new Date(invoice.dueDate);

        const triggerDate = new Date(due);
        triggerDate.setDate(
          triggerDate.getDate() + schedule.daysAfter
        );

        // ⏱️ skip if not yet time
        if (now < triggerDate) continue;

        // ❌ prevent duplicate reminders
        const alreadySent = await prisma.reminder.findFirst({
          where: {
            invoiceId: invoice.id,
            scheduleId: schedule.id,
          },
        });

        if (alreadySent) continue;

        /* =========================
           📧 SEND EMAIL
        ========================= */
        await sendEmail({
          to: invoice.clientEmail, // ✅ FIXED
          subject: schedule.template.subject,
          html: schedule.template.html,
        });

        /* =========================
           💾 SAVE REMINDER
        ========================= */
        await prisma.reminder.create({
          data: {
            userId: invoice.userId,
            invoiceId: invoice.id, // ✅ REQUIRED

            email: invoice.clientEmail,
            amount: invoice.amount,

            type: schedule.template.name.toLowerCase() as any, // friendly/firm/final
            mode: "auto",
            status: "sent",

            html: schedule.template.html,
            text: schedule.template.html.replace(/<[^>]+>/g, ""), // simple text fallback

            templateId: schedule.templateId,
            scheduleId: schedule.id,

            sentAt: new Date(),
          },
        });
      }
    }

    return Response.json({ success: true });

  } catch (err) {
    console.error("CRON ERROR:", err);

    return Response.json(
      { error: "Cron failed" },
      { status: 500 }
    );
  }
}