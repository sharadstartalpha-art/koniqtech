import "dotenv/config";
import { Worker } from "bullmq";
import { redis } from "../lib/redis";
import { prisma } from "../lib/prisma";
import { sendEmail } from "../lib/mail";
import { personalize } from "../lib/personalize";

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
      console.log("🚫 Skipping unsubscribed:", recipient.email);
      return;
    }

    // 🚫 Skip already handled
    if (["SENT", "REPLIED"].includes(recipient.status)) {
      console.log("Skipping:", recipient.email, recipient.status);
      return;
    }

    try {
      // 🔥 SAFE daily limit check
      const currentCampaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        select: { totalSent: true },
      });

      const dailyLimit = 50;

      if (currentCampaign && currentCampaign.totalSent >= dailyLimit) {
        console.log("🚫 Daily limit reached");
        return;
      }

      // ✅ Personalize
      const html = personalize(step.body, recipient);

      // 📡 Tracking
      const trackingPixel = `<img src="https://koniqtech.com/api/track/open?rid=${recipient.id}" width="1" height="1" />`;

      // ⏱ Anti-spam delay
      const randomDelay = Math.floor(Math.random() * 5000);
      await new Promise((res) => setTimeout(res, randomDelay));

      // 📧 Send
      await sendEmail({
        to: recipient.email,
        subject: step.subject,
        html: html + trackingPixel,
      });

      // ✅ Update recipient
      await prisma.campaignRecipient.update({
        where: { id: recipient.id },
        data: { status: "SENT" },
      });

      // 📊 Increment safely
      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          totalSent: {
            increment: 1,
          },
        },
      });

    } catch (err) {
      console.error("EMAIL FAILED:", recipient.email);

      await prisma.campaignRecipient.update({
        where: { id: recipient.id },
        data: { status: "FAILED" },
      });

      throw err;
    }
  },
  {
    connection: redis,
    concurrency: 10,
    limiter: {
      max: 20,
      duration: 1000,
    },
  }
);