import { runReminders } from "@/lib/reminder";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await runReminders();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reminder job failed:", error);

    return NextResponse.json(
      { error: "Failed to run reminders" },
      { status: 500 }
    );
  }
}