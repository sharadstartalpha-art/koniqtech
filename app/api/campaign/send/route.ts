import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { campaignId } = await req.json();

    if (!campaignId) {
      return NextResponse.json({ error: "Campaign ID required" });
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        steps: true,
        recipients: true,
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" });
    }

    const step = campaign.steps.sort((a, b) => a.order - b.order)[0];

    if (!step) {
      return NextResponse.json({ error: "No campaign steps found" });
    }

    let sent = 0;

    for (const r of campaign.recipients) {
      if (!r.email || r.unsubscribed) continue;

      try {
        const name = r.email.split("@")[0];

        // ✅ TRACKING PIXEL
        const trackingPixel = `
          <img src="${process.env.NEXT_PUBLIC_APP_URL}/api/track/open?rid=${r.id}" width="1" height="1" />
        `;

        const html = step.body
          .replace("{{name}}", name) + trackingPixel;

        await sendEmail({
          to: r.email,
          subject: step.subject,
          html,
        });

        await prisma.campaignRecipient.update({
          where: { id: r.id },
          data: { status: "SENT" },
        });

        sent++;

      } catch (err) {
        console.error("EMAIL FAIL:", r.email);
      }
    }

    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: "SENT",
        totalSent: sent,
        sentAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      sent,
    });

  } catch (err) {
    console.error("CAMPAIGN ERROR:", err);

    return NextResponse.json(
      { error: "Failed to send campaign" },
      { status: 500 }
      
    );
    
  }
  
}