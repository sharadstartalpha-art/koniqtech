import { prisma } from "./prisma";
import { sendEmail } from "./email";
import { getEmail } from "./emailTemplates";

export async function runReminders() {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { status: "unpaid" },
    });

    for (const inv of invoices) {
      const daysLate =
        (Date.now() - new Date(inv.dueDate).getTime()) /
        (1000 * 60 * 60 * 24);

      let type: "friendly" | "firm" | "final" | "" = "";

      if (daysLate >= 1 && daysLate < 3) type = "friendly";
      else if (daysLate >= 3 && daysLate < 7) type = "firm";
      else if (daysLate >= 7) type = "final";

      if (!type) continue;

      // ✅ Prevent duplicate reminders
      const alreadySent = await prisma.reminder.findFirst({
        where: {
          invoiceId: inv.id,
          type,
        },
      });

      if (alreadySent) continue;

      // ✅ Ensure payment link exists
      if (!inv.paymentLink) {
        console.error("❌ Missing payment link for invoice:", inv.id);
        continue;
      }

      // ✅ Generate email HTML (safe)
      const html = getEmail(type, inv.amount, inv.paymentLink);

      if (!html) {
        console.error("❌ Email template failed:", inv.id);
        continue;
      }

      // ✅ Send email
      await sendEmail(inv.clientEmail, "Invoice Reminder", html);

      // ✅ Save reminder log
      await prisma.reminder.create({
        data: {
          invoiceId: inv.id,
          type,
          status: "sent",
        },
      });

      console.log(`📧 ${type} reminder sent to ${inv.clientEmail}`);
    }
  } catch (error) {
    console.error("❌ Reminder job failed:", error);
  }
}