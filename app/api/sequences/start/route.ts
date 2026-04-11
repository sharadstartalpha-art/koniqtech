import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, email, name } = await req.json();

  const now = Date.now();

  const steps = [
    {
      subject: "Quick question",
      body: `<p>Hi ${name}, just following up 👋</p>`,
      delay: 0,
    },
    {
      subject: "Following up",
      body: `<p>Just checking again 😊</p>`,
      delay: 1 * 24 * 60 * 60 * 1000,
    },
    {
      subject: "Last try",
      body: `<p>Last follow up 🚀</p>`,
      delay: 3 * 24 * 60 * 60 * 1000,
    },
  ];

  for (const step of steps) {
    await prisma.emailQueue.create({
      data: {
        userId,
        email,
        subject: step.subject,
        body: step.body,
        scheduledAt: new Date(now + step.delay),
      },
    });
  }

  return NextResponse.json({ success: true });
}