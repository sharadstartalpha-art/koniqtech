import { Worker } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { generateEmail } from "@/lib/aiEmail";

const connection = new IORedis(process.env.REDIS_URL!);

new Worker(
  "reminders",
  async () => {
    try {
      const invoices = await prisma.invoice.findMany({
        where: { status: "unpaid" },
      });

      for (const inv of invoices) {
        /* =========================
           🔗 REQUIRE PAYMENT LINK
        ========================= */
        if (!inv.paymentLink) {
          console.warn("⚠️ Missing payment link:", inv.id);
          continue;
        }

        /* =========================
           ✉️ GENERATE EMAIL
        ========================= */
        const { html, text } = generateEmail(
          inv.amount,
          "friendly",
          inv.paymentLink
        );

        if (!html) {
          console.warn("⚠️ Email generation failed:", inv.id);
          continue;
        }

        /* =========================
           📤 SEND EMAIL (FIXED)
        ========================= */
        await sendEmail({
          to: inv.clientEmail,
          subject: "Payment Reminder",
          html,
          text,
        });
      }

      console.log("✅ reminders sent");
    } catch (err) {
      console.error("❌ Worker error:", err);
      throw err;
    }
  },
  { connection }
);