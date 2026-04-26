import { prisma } from "./prisma";

export async function runReminders() {
  const invoices = await prisma.invoice.findMany({
    where: { status: "unpaid" },
  });

  for (const inv of invoices) {
    const diff =
      (new Date().getTime() - new Date(inv.dueDate).getTime()) /
      (1000 * 60 * 60 * 24);

    if (diff >= 1) {
      console.log("Send reminder to:", inv.clientEmail);
      // integrate email here
    }
  }
}