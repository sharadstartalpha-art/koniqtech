import { NextRequest, NextResponse } from "next/server";
import { campaignQueue } from "@/lib/queue";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Next.js 15 fix
    const { id } = await context.params;

    await campaignQueue.add("send-campaign", {
      campaignId: id,
    });

    return NextResponse.json({
      success: true,
      message: "Campaign queued successfully 🚀",
    });

  } catch (error) {
    console.error("QUEUE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to queue campaign" },
      { status: 500 }
    );
  }
}