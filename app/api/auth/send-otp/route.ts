import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

// 🚫 prevent running during Next.js build
if (process.env.NODE_ENV !== "production") {
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

      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: "SENDING" },
      });

      let totalSent = 0;

      for (const step of campaign.steps) {
        if (step.delay > 0) {
          await wait(step.delay * 1000);
        }

        await Promise.all(
          campaign.recipients.map(async (recipient) => {
            try {
              await sendEmail({
                to: recipient.email,
                subject: campaign.subject,
                html: campaign.content,
              });

              await prisma.campaignRecipient.update({
                where: { id: recipient.id },
                data: { status: "SENT" },
              });

              totalSent++;
            } catch {
              await prisma.campaignRecipient.update({
                where: { id: recipient.id },
                data: { status: "FAILED" },
              });
            }
          })
        );
      }

      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          status: "SENT",
          sentAt: new Date(),
          totalSent,
        },
      });

      return true;
    },
    {
      connection: redis,
      concurrency: 5,
    }
  );
}