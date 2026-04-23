import "dotenv/config";
import { Worker } from "bullmq";
import { getRedis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { personalize } from "@/lib/personalize";

const connection = getRedis();
if (!connection) throw new Error("❌ Redis not available");

console.log("📧 Email Worker Started");

new Worker(
  "email-queue",
  async (job) => {
    const { campaignId, stepId, recipientId } = job.data;

    const [recipient, campaign, step] = await Promise.all([
      prisma.campaignRecipient.findUnique({ where: { id: recipientId } }),
      prisma.campaign.findUnique({
        where: { id: campaignId },
        select: { id: true },
      }),
      prisma.campaignStep.findUnique({ where: { id: stepId } }),
    ]);

    if (!recipient || !campaign || !step) {
      throw new Error("Missing data");
    }

    if (recipient.unsubscribed) return;
    if (["SENT", "REPLIED"].includes(recipient.status)) return;

    try {
      const html = personalize(step.body, recipient);

      await sendEmail({
        to: recipient.email,
        subject: step.subject,
        html,
      });

      await prisma.campaignRecipient.update({
        where: { id: recipient.id },
        data: { status: "SENT" },
      });

      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          totalSent: { increment: 1 },
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
    connection,
    concurrency: 10,
  }
);