import { prisma } from "./prisma";
import { generateEmail } from "./aiEmail";
import { sendEmail } from "./email";

type EmailType = "friendly" | "firm" | "final";

export async function runReminders() {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { status: "unpaid" },
    });

    for (const inv of invoices) {
      /* =========================
         📅 CALCULATE DELAY
      ========================= */
      const daysLate =
        (Date.now() - new Date(inv.dueDate).getTime()) /
        (1000 * 60 * 60 * 24);

      let type: EmailType | null = null;

      if (daysLate >= 1 && daysLate < 3) type = "friendly";
      else if (daysLate >= 3 && daysLate < 7) type = "firm";
      else if (daysLate >= 7) type = "final";

      if (!type) continue;

      /* =========================
         🚫 PREVENT DUPLICATES
      ========================= */
      const alreadySent = await prisma.reminder.findFirst({
        where: {
          invoiceId: inv.id,
          type,
        },
      });

      if (alreadySent) continue;

      /* =========================
         🔗 ENSURE PAYMENT LINK
      ========================= */
      if (!inv.paymentLink) {
        console.error("❌ Missing payment link:", inv.id);
        continue;
      }

      /* =========================
         ✉️ GENERATE EMAIL
      ========================= */
      const { html, text } = generateEmail(
        inv.amount,
        type,
        inv.paymentLink
      );

      if (!html || !text) {
        console.error("❌ Email generation failed:", inv.id);
        continue;
      }

      /* =========================
         📤 SEND EMAIL
      ========================= */
      await sendEmail({
        to: inv.clientEmail,
        subject: "Invoice Reminder",
        html,
        text,
      });

      /* =========================
         💾 SAVE REMINDER
      ========================= */
      await prisma.reminder.create({
        data: {
          userId: inv.userId,          // ✅ FIX
          invoiceId: inv.id,

          email: inv.clientEmail,
          amount: inv.amount,

          type,                        // friendly | firm | final
          mode: "auto",                // ✅ FIX (this is cron)

          status: "sent",
          sentAt: new Date(),

          html,
          text,
        },
      });

      console.log(`📧 ${type} reminder sent → ${inv.clientEmail}`);
    }

  } catch (error) {
    console.error("❌ Reminder job failed:", error);
  }
}