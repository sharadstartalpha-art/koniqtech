import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function GET() {
  try {
    console.log("🚀 CRON START");

    const schedules = await prisma.reminderSchedule.findMany({
      where: { enabled: true },
      include: { template: true },
    });

    const invoices = await prisma.invoice.findMany({
      where: { status: "UNPAID" }, // ⚠️ check case in DB
    });

    console.log("Schedules:", schedules.length);
    console.log("Invoices:", invoices.length);

    const now = new Date();

    for (const schedule of schedules) {
      for (const invoice of invoices) {
        const due = new Date(invoice.dueDate);

        const triggerDate = new Date(due);
        triggerDate.setDate(
          triggerDate.getDate() + schedule.daysAfter
        );

        console.log(
          "Checking:",
          invoice.id,
          "Trigger:",
          triggerDate
        );

        if (now < triggerDate) continue;

        /* 🚫 prevent duplicates */
        const alreadySent = await prisma.reminder.findFirst({
          where: {
            invoiceId: invoice.id,
            scheduleId: schedule.id,
          },
        });

        if (alreadySent) {
          console.log("⏭️ Skipped (already sent)");
          continue;
        }

        /* ❗ ensure template exists */
        if (!schedule.template) {
          console.log("❌ Missing template");
          continue;
        }

        /* 📧 SEND EMAIL */
        await sendEmail({
          to: invoice.clientEmail,
          subject: schedule.template.subject,
          html: schedule.template.html,
        });

        /* 💾 SAVE */
        await prisma.reminder.create({
          data: {
            userId: invoice.userId,
            invoiceId: invoice.id,
            email: invoice.clientEmail,
            amount: invoice.amount,

            type: schedule.template.name.toLowerCase() as any,
            mode: "auto",
            status: "sent",

            html: schedule.template.html,
            text: schedule.template.html.replace(/<[^>]*>/g, ""),

            templateId: schedule.templateId,
            scheduleId: schedule.id,
          },
        });

        console.log("✅ Reminder sent:", invoice.clientEmail);
      }
    }

    return Response.json({ ok: true });

  } catch (err) {
    console.error("❌ CRON ERROR:", err);

    return Response.json(
      { error: "Cron failed" },
      { status: 500 }
    );
  }
}