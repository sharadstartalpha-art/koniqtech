import "dotenv/config";
import { Worker } from "bullmq";
import { getRedis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

const connection = getRedis();
if (!connection) throw new Error("❌ Redis not available");

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

      for (const recipient of campaign.recipients) {
        if (!recipient.email) continue;

        try {
          await sendEmail({
            to: recipient.email,
            subject: campaign.subject,
            html: campaign.content,
          });

          totalSent++;
        } catch (err) {
          console.error("❌ Failed:", recipient.email);
        }
      }
    }

    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: "SENT",
        totalSent: { increment: totalSent },
      },
    });

    return true;
  },
  {
    connection,
    concurrency: 2,
  }
);