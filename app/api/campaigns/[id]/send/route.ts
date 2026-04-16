import { NextRequest, NextResponse } from "next/server";
import { runCampaign } from "@/lib/campaignSender";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ FIXED
) {
  try {
    const { id } = await context.params; // ✅ IMPORTANT

    // 🚀 fire and forget (non-blocking)
    runCampaign(id).catch((err) => {
      console.error("BACKGROUND CAMPAIGN ERROR:", err);
    });

    return NextResponse.json({
      message: "Campaign started",
    });

  } catch (error) {
    console.error("SEND CAMPAIGN ERROR:", error);

    return NextResponse.json(
      { error: "Failed to start campaign" },
      { status: 500 }
    );
  }
}