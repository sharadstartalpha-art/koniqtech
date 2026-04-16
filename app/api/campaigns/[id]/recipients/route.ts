import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ FIXED
) {
  try {
    const { id } = await context.params; // ✅ IMPORTANT

    const recipients = await prisma.campaignRecipient.findMany({
      where: {
        campaignId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(recipients);

  } catch (err) {
    console.error("RECIPIENTS ERROR:", err);

    return NextResponse.json(
      { error: "Failed to fetch recipients" },
      { status: 500 }
    );
  }
}