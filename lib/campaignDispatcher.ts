import {prisma} from "@/lib/prisma";
import { emailQueue } from "@/lib/queue";

export async function dispatchCampaign(campaignId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      steps: true,
      recipients: true,
    },
  });

  if (!campaign) throw new Error("Campaign not found");

  // update status
  await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: "SENDING" },
  });

  for (const step of campaign.steps) {
    for (const recipient of campaign.recipients) {
      await emailQueue.add(
        "send-email",
        {
          campaignId,
          stepId: step.id,
          recipientId: recipient.id,
        },
        {
          delay: step.delay * 1000, // 🔥 schedule per step
          attempts: 3,
        }
      );
    }
  }
}