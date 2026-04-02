import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  const { leads } = await req.json()

  const results = []

  for (const lead of leads) {
    const prompt = `
Score this lead and write cold email.

Name: ${lead.name}
Website: ${lead.website}

Return JSON:
{
  "score": number,
  "reason": "short reason",
  "email": "cold email"
}
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    })

    let parsed

    try {
      parsed = JSON.parse(
        completion.choices[0].message.content || ""
      )
    } catch {
      parsed = {
        score: 50,
        reason: "Default",
        email: "Hi",
      }
    }

    results.push({ ...lead, ...parsed })
  }

  return NextResponse.json({ leads: results })
}