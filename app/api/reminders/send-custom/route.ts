import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, content } = await req.json();

  await sendEmail(email, "Payment Reminder", content);

  return NextResponse.json({ success: true });
}