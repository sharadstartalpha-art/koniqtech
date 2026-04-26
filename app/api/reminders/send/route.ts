import { prisma } from "@/lib/prisma";
import { sendReminderEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function GET() {
  const invoices = await prisma.invoice.findMany({
    where: { status: "unpaid" },
  });

  for (const inv of invoices) {
    const diff =
      (new Date().getTime() - new Date(inv.dueDate).getTime()) /
      (1000 * 60 * 60 * 24);

    if (diff >= 1) {
      await sendReminderEmail(
        inv.clientEmail,
        inv.amount,
        inv.paymentLink || "#"
      );

      await prisma.reminder.create({
        data: {
          invoiceId: inv.id,
          type: "day1",
          status: "sent",
        },
      });
    }
  }

  return NextResponse.json({ success: true });
}