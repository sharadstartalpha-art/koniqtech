import { prisma } from "@/lib/prisma"
import { resend } from "@/lib/email"
import { NextResponse } from "next/server"

export async function GET() {
  const now = new Date()

  const pending = await prisma.leadSequence.findMany({
    where: {
      sent: false,
      scheduledAt: { lte: now },
    },
    include: {
      lead: true,
    },
  })

  for (const item of pending) {
    if (!item.lead.contactEmail) continue

    await resend.emails.send({
      from: "KoniqTech <onboarding@resend.dev>",
      to: item.lead.contactEmail,
      subject: item.subject,
      html: `<p>${item.content}</p>`,
    })

    await prisma.leadSequence.update({
      where: { id: item.id },
      data: { sent: true },
    })

    await prisma.leadStatus.upsert({
      where: { leadId: item.leadId },
      update: { status: "CONTACTED" },
      create: {
        leadId: item.leadId,
        status: "CONTACTED",
      },
    })
  }

  return NextResponse.json({ sent: pending.length })
}