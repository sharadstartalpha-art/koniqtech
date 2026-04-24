import { prisma } from "@/lib/prisma";
import { emailQueue } from "@/lib/queue";

export async function dispatchCampaign(campaignId: string) {
  // ❌ Prevent crash if Redis not connected
  if (!emailQueue) {
    throw new Error("Email queue not available (Redis missing)");
  }

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      steps: {
        orderBy: { order: "asc" }, // ✅ ensure correct sequence
      },
      recipients: true,
    },
  });

  if (!campaign) {
    throw new Error("Campaign not found");
  }

  // 🔄 mark sending
  await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: "SENDING" },
  });

  for (const step of campaign.steps) {
    for (const recipient of campaign.recipients) {
      try {
        await emailQueue.add(
          "send-email",
          {
            campaignId,
            stepId: step.id,
            recipientId: recipient.id,
          },
          {
            delay: (step.delay || 0) * 1000,
            attempts: 3,
          }
        );
      } catch (err) {
        console.error("❌ Queue error:", err);
      }
    }
  }

  return { success: true };
}