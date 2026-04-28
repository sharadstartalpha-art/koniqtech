import { prisma } from "./prisma";
import { generateEmail } from "./aiEmail";
import { sendEmail } from "./email";

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

      // prevent duplicates
      const alreadySent = await prisma.reminder.findFirst({
        where: {
          invoiceId: inv.id,
          type,
        },
      });

      if (alreadySent) continue;

      // ensure payment link
      if (!inv.paymentLink) {
        console.error("❌ Missing payment link:", inv.id);
        continue;
      }

      // generate email
      const content = await generateEmail(
        inv.amount,
        type,
        inv.paymentLink
      );

      if (!content) {
        console.error("❌ AI email failed:", inv.id);
        continue;
      }

      // send email
      await sendEmail(inv.clientEmail, "Invoice Reminder", content);

      // save log
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