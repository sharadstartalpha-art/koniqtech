import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // ⚠️ replace with auth user later
    const userId = "demo-user";

    const schedules = await prisma.reminderSchedule.findMany({
      where: { userId },
      include: {
        template: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(schedules);
  } catch (err) {
    console.error("GET SCHEDULE ERROR:", err);

    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const { enabled, schedules } = await req.json();

    // ⚠️ replace with real auth later
    const userId = "demo-user";

    for (const s of schedules) {
      await prisma.reminderSchedule.upsert({
        where: {
          userId_type: {
            userId,
            type: s.type,
          },
        },
        update: {
          daysAfter: s.daysAfter,
          templateId: s.templateId,
          enabled,
        },
        create: {
          userId,
          type: s.type,
          daysAfter: s.daysAfter,
          templateId: s.templateId,
          enabled,
        },
      });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("SAVE SCHEDULE ERROR:", err);

    return NextResponse.json(
      { error: "Failed to save schedule" },
      { status: 500 }
    );
  }
}