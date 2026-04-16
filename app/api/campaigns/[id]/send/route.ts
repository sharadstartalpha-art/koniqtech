import { NextRequest, NextResponse } from "next/server";
import { campaignQueue } from "@/lib/queue";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ FIX: await params
    const { id } = await context.params;

    await campaignQueue.add(
      "send-campaign",
      { campaignId: id },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      }
    );

    return NextResponse.json({
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