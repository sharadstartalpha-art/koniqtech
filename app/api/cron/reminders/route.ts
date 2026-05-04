import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function GET() {
  try {
    console.log("🔥 CRON STARTED");

    const schedules = await prisma.reminderSchedule.findMany({
      where: { enabled: true },
      include: {
        template: true,
      },
    });

    const invoices = await prisma.invoice.findMany({
      where: {
        status: "unpaid",
        mode: "auto", // ✅ only auto invoices
      },
    });

    const now = new Date();

    for (const schedule of schedules) {
      for (const invoice of invoices) {
        /* =========================
           📅 DAYS LATE CALCULATION
        ========================= */
        const daysLate =
          (now.getTime() - new Date(invoice.dueDate).getTime()) /
          (1000 * 60 * 60 * 24);

        /* =========================
           ⏱️ MATCH SCHEDULE TYPE
        ========================= */
        if (daysLate < schedule.daysAfter) continue;

        // optional: match exact type stage
        if (
          schedule.type === "friendly" && daysLate >= 1 && daysLate < 3 ||
          schedule.type === "firm" && daysLate >= 3 && daysLate < 7 ||
          schedule.type === "final" && daysLate >= 7
        ) {
          // continue to send
        } else {
          continue;
        }

        /* =========================
           ❌ PREVENT DUPLICATES
        ========================= */
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
          to: invoice.clientEmail,
          subject: schedule.template.subject,
          html: schedule.template.html,
        });

        /* =========================
           💾 SAVE REMINDER
        ========================= */
        await prisma.reminder.create({
          data: {
            userId: invoice.userId,
            invoiceId: invoice.id,

            email: invoice.clientEmail,
            amount: invoice.amount,

            type: schedule.type, // ✅ enum safe
            mode: "auto",
            status: "sent",

            html: schedule.template.html,
            text: schedule.template.html.replace(/<[^>]+>/g, ""),

            templateId: schedule.templateId,
            scheduleId: schedule.id,

            sentAt: new Date(),
          },
        });

        console.log(
          `📧 ${schedule.type} reminder sent → ${invoice.clientEmail}`
        );
      }
    }

    console.log("✅ CRON FINISHED");

    return Response.json({ success: true });

  } catch (err) {
    console.error("❌ CRON ERROR:", err);

    return Response.json(
      { error: "Cron failed" },
      { status: 500 }
    );
  }
}