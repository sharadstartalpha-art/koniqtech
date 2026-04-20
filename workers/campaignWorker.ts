import "dotenv/config";
import { Worker } from "bullmq";
import { connection } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

console.log("🚀 Campaign Worker Started");

new Worker(
  "campaign-queue",
  async (job) => {
    const { campaignId } = job.data;

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        steps: { orderBy: { order: "asc" } },
        recipients: true,
      },
    });

    if (!campaign) throw new Error("Campaign not found");

    // 🔥 DAILY LIMIT PROTECTION
    if ((campaign.totalSent ?? 0) >= 500) {
      throw new Error("Daily limit reached");
    }

    // 🔄 Mark as sending
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: "SENDING" },
    });

    let totalSent = 0;

    // 🔥 Limit recipients per run
    const MAX_PER_RUN = 50;
    const recipients = campaign.recipients.slice(0, MAX_PER_RUN);

    for (const step of campaign.steps) {
      console.log("Running step:", step.name);

      // ⏱ Delay between steps
      if (step.delay > 0) {
        await wait(step.delay * 1000);
      }

      const batchSize = 5;

      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);

        await Promise.allSettled(
          batch.map(async (recipient) => {
            try {
              const trackingPixel = `<img src="https://yourdomain.com/api/track/open?cid=${campaign.id}&rid=${recipient.id}" width="1" height="1" />`;

              await sendEmail({
                to: recipient.email,
                subject: campaign.subject,
                html: campaign.content + trackingPixel,
              });

              await prisma.campaignRecipient.update({
                where: { id: recipient.id },
                data: { status: "SENT" },
              });

              totalSent++;
            } catch (err) {
              console.error("❌ Failed:", recipient.email);

              await prisma.campaignRecipient.update({
                where: { id: recipient.id },
                data: { status: "FAILED" },
              });
            }
          })
        );

        // ⏱ Wait between batches (rate control)
        await wait(2000);
      }
    }

    // ✅ Final update
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: "SENT",
        sentAt: new Date(),
        totalSent: {
          increment: totalSent,
        },
      },
    });

    return true;
  },
  {
    connection,

    // 🔥 Parallel job control
    concurrency: 2,

    // 🔥 Rate limiting
    limiter: {
      max: 10,
      duration: 1000,
    },
  }
);