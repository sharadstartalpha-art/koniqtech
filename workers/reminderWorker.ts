import { Worker } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { generateEmail } from "@/lib/aiEmail";

const connection = new IORedis(process.env.REDIS_URL!);

new Worker(
  "reminders",
  async () => {
    const invoices = await prisma.invoice.findMany({
      where: { status: "unpaid" },
    });

    for (const inv of invoices) {
      const content = await generateEmail(inv.amount, "friendly");

      await sendEmail(inv.clientEmail, "Reminder", content);
    }

    console.log("✅ reminders sent");
  },
  { connection }
);