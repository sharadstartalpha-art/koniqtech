import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { leadId, generatedEmail } = await req.json()

  const now = new Date()

  const steps = [
    {
      step: 1,
      subject: "Quick question",
      content: generatedEmail,
      scheduledAt: now,
    },
    {
      step: 2,
      subject: "Following up",
      content: "Just checking if you saw my last email 🙂",
      scheduledAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
    },
    {
      step: 3,
      subject: "Last follow up",
      content: "Last try — would love to connect!",
      scheduledAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
    },
  ]

  for (const step of steps) {
    await prisma.leadSequence.create({
      data: {
        leadId,
        ...step,
      },
    })
  }

  return NextResponse.json({ success: true })
}