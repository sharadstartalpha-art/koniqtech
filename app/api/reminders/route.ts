import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const reminders = await prisma.reminder.findMany({
      orderBy: {
        sentAt: "desc", // latest first ✅
      },
    });

    return NextResponse.json(reminders);
  } catch (error) {
    console.error("GET REMINDERS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch reminders" },
      { status: 500 }
    );
  }
}