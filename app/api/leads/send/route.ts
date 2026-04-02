export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { resend } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const { leads } = await req.json()

    if (!leads || !Array.isArray(leads)) {
      return NextResponse.json({ error: "Invalid leads" }, { status: 400 })
    }

    const results = []

    for (const lead of leads) {
      if (!lead.contactEmail) continue

      await resend.emails.send({
        from: "KoniqTech <onboarding@resend.dev>",
        to: lead.contactEmail,
        subject: "Quick question",
        html: `<p>${lead.generatedEmail || "Hi,"}</p>`,
      })

      results.push({
        ...lead,
        sent: true,
        status: "SENT",
        sentAt: new Date(),
      })
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Send Error:", error)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}