import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { lead } = await req.json()

    const prompt = `
You are a B2B sales expert.

Lead:
Name: ${lead.name}
Website: ${lead.website}

Return JSON:
{
  "score": number (0-100),
  "reason": "why this is a good lead",
  "email": "cold email opener"
}
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt },
      ],
    })

    const text = completion.choices[0].message.content || ""

    let result

    try {
      result = JSON.parse(text)
    } catch {
      result = {
        score: 50,
        reason: "Default scoring",
        email: "Hi, I can help you grow your business.",
      }
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}