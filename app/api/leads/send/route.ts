import { NextResponse } from "next/server"
import { resend } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const { leads } = await req.json()

    const results = []

    for (const lead of leads) {
      if (!lead.contactEmail) continue

      const response = await resend.emails.send({
        from: "KoniqTech <onboarding@resend.dev>",
        to: lead.contactEmail,
        subject: "Quick question",
        html: `
          <p>Hi,</p>
          <p>${lead.generatedEmail || "Let's connect!"}</p>
        `,
      })

      results.push({
        ...lead,
        sent: true,
        status: "SENT",
        sentAt: new Date(),
        messageId: response.data?.id,
      })
    }

    return NextResponse.json({ leads: results })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}