import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { campaignId, leadIds } = await req.json();

    if (!campaignId || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    // 🔥 Get leads
    const leads = await prisma.lead.findMany({
      where: {
        id: { in: leadIds },
      },
      select: {
        email: true,
      },
    });

    // ✅ FILTER NULL EMAILS
    const validLeads = leads.filter((l) => !!l.email);

    if (validLeads.length === 0) {
      return NextResponse.json({
        error: "No valid emails found",
      });
    }

    // ✅ SAFE DATA (email always string now)
    const data = validLeads.map((l) => ({
      campaignId,
      email: l.email as string,
      status: "PENDING",
    }));

    await prisma.campaignRecipient.createMany({
      data,
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      added: data.length,
    });

  } catch (err) {
    console.error("ADD LEADS ERROR:", err);

    return NextResponse.json(
      { error: "Failed to add leads" },
      { status: 500 }
    );
  }
}