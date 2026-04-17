import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id;

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        steps: { orderBy: { order: "asc" } },
        recipients: true,
      },
    });

    if (!campaign) {
      return Response.json({ error: "Campaign not found" }, { status: 404 });
    }

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
        try {
          // 🚫 Skip unsubscribed
          if (recipient.unsubscribed) continue;

          // 🚫 Skip already handled
          if (["SENT", "REPLIED"].includes(recipient.status)) continue;

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

          // 🛑 Anti-spam delay
          await wait(1500);

        } catch (err) {
          console.error("❌ Send failed:", recipient.email, err);

          await prisma.campaignRecipient.update({
            where: { id: recipient.id },
            data: { status: "FAILED" },
          });
        }
      }
    }

    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: "SENT",
        sentAt: new Date(),
        totalSent,
      },
    });

    return Response.json({ success: true, totalSent });

  } catch (err: any) {
    console.error("❌ Campaign error:", err);

    return Response.json(
      { error: "Failed to send campaign" },
      { status: 500 }
    );
  }
}