import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { campaignId, leads } = await req.json();

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { steps: true },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" });
  }

  for (const lead of leads) {
    const step = campaign.steps[0];

    await resend.emails.send({
      from: "KoniqTech <onboarding@resend.dev>",
      to: lead.email,
      subject: step.subject,
      html: `
        ${step.content}
        <img src="${process.env.APP_URL}/api/track/open?id=${lead.id}" />
      `,
    });

    await prisma.emailLog.create({
      data: {
        userId: lead.userId,
        email: lead.email,
        status: "SENT",
      },
    });
  }

  return NextResponse.json({ success: true });
}