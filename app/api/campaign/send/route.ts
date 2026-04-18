import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { campaignId } = await req.json();

    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID required" },
        { status: 400 }
      );
    }

    // ✅ NO RELATIONS (your schema doesn't support it)
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        steps: true,
        recipients: true,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    if (!campaign.recipients.length) {
      return NextResponse.json(
        { error: "No leads in campaign" },
        { status: 400 }
      );
    }

    const step = campaign.steps.sort(
      (a: any, b: any) => a.order - b.order
    )[0];

    if (!step) {
      return NextResponse.json(
        { error: "No campaign steps found" },
        { status: 400 }
      );
    }

    let sent = 0;

    for (const r of campaign.recipients) {
      if (!r.email || r.unsubscribed) continue;

      try {
        const name = r.email.split("@")[0];

        const trackingPixel = `
          <img src="${process.env.NEXT_PUBLIC_APP_URL}/api/track/open?rid=${r.id}" width="1" height="1" />
        `;

        const html =
          step.body.replace(/{{name}}/g, name) + trackingPixel;

        await sendEmail({
          to: r.email,
          subject: step.subject,
          html,
        });

        await prisma.campaignRecipient.update({
          where: { id: r.id },
          data: {
            status: "SENT",
            sentAt: new Date(),
          },
        });

        sent++;
      } catch (err) {
        console.error("EMAIL FAIL:", r.email);

        await prisma.campaignRecipient.update({
          where: { id: r.id },
          data: { status: "FAILED" },
        });
      }
    }

    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: sent > 0 ? "SENT" : "FAILED",
        totalSent: sent,
        sentAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, sent });

  } catch (err) {
    console.error("CAMPAIGN ERROR:", err);

    return NextResponse.json(
      { error: "Failed to send campaign" },
      { status: 500 }
    );
  }
}