import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import {prisma} from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

new Worker(
  "email-queue",
  async (job) => {
    const { campaignId, stepId, recipientId } = job.data;

    const recipient = await prisma.campaignRecipient.findUnique({
      where: { id: recipientId },
    });

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!recipient || !campaign) throw new Error("Data missing");

    // 🚫 Skip if already sent
    if (recipient.status === "SENT") return;

    try {
      const trackingPixel = `<img src="https://koniqtech.com/api/track/open?rid=${recipient.id}" width="1" height="1" />`;

      await sendEmail({
        to: recipient.email,
        subject: campaign.subject,
        html: campaign.content + trackingPixel,
      });

      await prisma.campaignRecipient.update({
        where: { id: recipient.id },
        data: {
          status: "SENT",
        },
      });

      // 🔥 Increment campaign metrics
      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          totalSent: {
            increment: 1,
          },
        },
      });

    } catch (err) {
      await prisma.campaignRecipient.update({
        where: { id: recipient.id },
        data: {
          status: "FAILED",
        },
      });

      throw err; // 🔁 retry
    }
  },
  {
    connection: redis,

    concurrency: 10, // 🔥 scale here

    limiter: {
      max: 20,
      duration: 1000,
    },
  }
);