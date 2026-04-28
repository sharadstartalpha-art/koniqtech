import { reminderQueue } from "@/lib/queue";
import { NextResponse } from "next/server";

export async function GET() {
  await reminderQueue.add("send-reminders", {});
  return NextResponse.json({ ok: true });
}