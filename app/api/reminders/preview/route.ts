import { NextResponse } from "next/server";
import { generateEmail } from "@/lib/aiEmail";

export async function POST(req: Request) {
  const { amount } = await req.json();

  const content = await generateEmail(amount, "friendly");

  return NextResponse.json({ content });
}