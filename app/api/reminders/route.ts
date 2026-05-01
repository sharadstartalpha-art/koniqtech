import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const reminders = await prisma.reminder.findMany({
    include: {
      invoice: true,
    },
    orderBy: {
      sentAt: "desc", // ✅ FIXED
    },
  });

  return NextResponse.json(reminders);
}