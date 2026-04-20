import "dotenv/config";
import { Worker } from "bullmq";
import { connection } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { personalize } from "@/lib/personalize";

console.log("📧 Email Worker Started");

new Worker(
  "email-queue",
  async (job) => {
    const { campaignId, stepId, recipientId } = job.data;

    // 🔍 Fetch all required data
    const [recipient, campaign, step] = await Promise.all([
      prisma.campaignRecipient.findUnique({
        where: { id: recipientId },
      }),
      prisma.campaign.findUnique({
        where: { id: campaignId },
        select: { id: true, totalSent: true },
      }),
      prisma.campaignStep.findUnique({
        where: { id: stepId },
      }),
    ]);

    if (!recipient || !campaign || !step) {
      throw new Error("Missing data");
    }

    // 🚫 Skip unsubscribed
    if (recipient.unsubscribed) {
      console.log("🚫 Unsubscribed:", recipient.email);
      return;
    }

    // 🚫 Skip already processed
    if (["SENT", "REPLIED"].includes(recipient.status)) {
      console.log("⏭ Skipping:", recipient.email, recipient.status);
      return;
    }

    try {
      // 🔥 Daily limit check
      const DAILY_LIMIT = 50;

      if ((campaign.totalSent ?? 0) >= DAILY_LIMIT) {
        console.log("🚫 Daily limit reached");
        return;
      }

      // ✨ Personalize email
      const html = personalize(step.body, recipient);

      // 📡 Tracking pixel
      const trackingPixel = `<img src="https://koniqtech.com/api/track/open?rid=${recipient.id}" width="1" height="1" />`;

      // ⏱ Anti-spam delay (randomized)
      const delay = Math.floor(Math.random() * 5000);
      await new Promise((res) => setTimeout(res, delay));

      // 📧 Send email
      await sendEmail({
        to: recipient.email,
        subject: step.subject,
        html: html + trackingPixel,
      });

      // ✅ Mark as sent
      await prisma.campaignRecipient.update({
        where: { id: recipient.id },
        data: { status: "SENT" },
      });

      // 📊 Increment campaign count
      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          totalSent: {
            increment: 1,
          },
        },
      });

      console.log("✅ Sent:", recipient.email);

    } catch (err) {
      console.error("❌ EMAIL FAILED:", recipient.email);

      await prisma.campaignRecipient.update({
        where: { id: recipient.id },
        data: { status: "FAILED" },
      });

      throw err; // 🔥 allows BullMQ retry
    }
  },
  {
    connection,

    // 🔥 Parallel processing
    concurrency: 10,

    // 🔥 Rate limiting (BullMQ level)
    limiter: {
      max: 20,
      duration: 1000,
    },
  }
);