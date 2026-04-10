import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { campaignId, leads } = await req.json();

    if (!campaignId || !leads) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { steps: true },
    });

    if (!campaign || campaign.steps.length === 0) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    const step = campaign.steps[0];

    for (const lead of leads) {
      if (!lead.email) continue;

      // ✅ SEND EMAIL
      await resend.emails.send({
        from: "KoniqTech <onboarding@resend.dev>",
        to: lead.email,
        subject: step.subject,
        html: `
          ${step.content}

          <img src="${process.env.APP_URL}/api/track/open?id=${lead.id}" />

          <p style="font-size:12px;color:gray">
            <a href="${process.env.APP_URL}/api/unsubscribe?email=${lead.email}">
              Unsubscribe
            </a>
          </p>
        `,
      });

      // ✅ SAVE EMAIL LOG (FIXED)
      await prisma.emailLog.create({
        data: {
          userId: lead.userId, // ✅ FIX
          email: lead.email,   // ✅ FIX
          status: "PENDING",
          scheduledAt: new Date(
            Date.now() + 24 * 60 * 60 * 1000
          ),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Campaign Send Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}