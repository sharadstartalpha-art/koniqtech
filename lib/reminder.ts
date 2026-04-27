import { prisma } from "./prisma";
import { sendReminderEmail } from "./email";

export async function runReminders() {
  const invoices = await prisma.invoice.findMany({
    where: { status: "unpaid" },
  });

  for (const inv of invoices) {
    const daysLate =
      (Date.now() - new Date(inv.dueDate).getTime()) /
      (1000 * 60 * 60 * 24);

    let type = "";

    if (daysLate >= 1) type = "friendly";
    if (daysLate >= 3) type = "firm";
    if (daysLate >= 7) type = "final";

    if (!type) continue;

    await sendReminderEmail(
      inv.clientEmail,
      inv.amount,
      inv.paymentLink!
    );

    await prisma.reminder.create({
      data: {
        invoiceId: inv.id,
        type,
        status: "sent",
      },
    });
  }
}