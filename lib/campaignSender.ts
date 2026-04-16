import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function runCampaign(campaignId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      steps: {
        orderBy: { order: "asc" },
      },
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
    console.log(`Running step ${step.name}`);

    if (step.delay > 0) {
      await wait(step.delay * 1000);
    }

    // 🚀 PARALLEL sending (better performance)
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
        } catch (err) {
          console.error("Email failed:", recipient.email);

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

  return { success: true };
}