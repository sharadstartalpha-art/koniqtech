import "dotenv/config";
import { Worker } from "bullmq";
import { getRedis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { personalize } from "@/lib/personalize";

console.log("📧 Email Worker Started");

new Worker(
  "email-queue",
  async (job) => {
    const { campaignId, stepId, recipientId } = job.data;

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

    if (recipient.unsubscribed) {
      console.log("🚫 Unsubscribed:", recipient.email);
      return;
    }

    if (["SENT", "REPLIED"].includes(recipient.status)) {
      console.log("⏭ Skipping:", recipient.email, recipient.status);
      return;
    }

    try {
      const DAILY_LIMIT = 50;

      if ((campaign.totalSent ?? 0) >= DAILY_LIMIT) {
        console.log("🚫 Daily limit reached");
        return;
      }

      const html = personalize(step.body, recipient);

      const trackingPixel = `<img src="https://koniqtech.com/api/track/open?rid=${recipient.id}" width="1" height="1" />`;

      const delay = Math.floor(Math.random() * 5000);
      await new Promise((res) => setTimeout(res, delay));

      await sendEmail({
        to: recipient.email,
        subject: step.subject,
        html: html + trackingPixel,
      });

      await prisma.campaignRecipient.update({
        where: { id: recipient.id },
        data: { status: "SENT" },
      });

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

      throw err;
    }
  },
  {
    connection: getRedis()!, // ✅ FIXED
    concurrency: 10,
    limiter: {
      max: 20,
      duration: 1000,
    },
  }
);