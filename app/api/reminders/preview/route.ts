import { NextResponse } from "next/server";
import { generateEmail } from "@/lib/aiEmail";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    const email = generateEmail(Number(amount), "friendly");

    return NextResponse.json({
      html: email.html,
      text: email.text,
    });

  } catch (error) {
    console.error("PREVIEW ERROR:", error);

    return NextResponse.json(
      { error: "Failed to generate preview" },
      { status: 500 }
    );
  }
}