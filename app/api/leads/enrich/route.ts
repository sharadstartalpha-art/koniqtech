import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"


export async function POST(req: Request) {
  try {

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY");
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { leadId } = await req.json()

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    })

    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      )
    }

    const prompt = `
Company: ${lead.company}
Website: ${lead.website}

Return:
1. What they do
2. Why they need lead generation tools
3. Personalized cold email opener
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    })

    const text = completion.choices[0].message.content || ""

    // ✅ TEMP: no DB storage (safe)
    console.log("Enrichment result:", text)

    return NextResponse.json({
      success: true,
      enrichment: text,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}