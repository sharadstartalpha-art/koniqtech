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

    // 🔥 Fetch all required data
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

    // 🚫 Skip if already sent
    if (recipient.status === "SENT") return;

    try {
      // ✅ PERSONALIZATION (correct field)
      const html = personalize(step.body, recipient);

      // 📡 Tracking pixel
      const trackingPixel = `<img src="https://koniqtech.com/api/track/open?rid=${recipient.id}" width="1" height="1" />`;

      // 📧 Send email
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

      // 📊 Increment campaign stats
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

      throw err; // 🔁 retry
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