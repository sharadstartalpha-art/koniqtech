import { NextResponse } from "next/server"
import OpenAI from "openai"


export async function POST(req: Request) {

  if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY");
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

  const { lead } = await req.json()

  const prompt = `
Write a cold email for this business.

Name: ${lead.name}
Website: ${lead.website}

Return JSON:
{
  "score": number,
  "reason": "short reason",
  "generatedEmail": "full cold email message"
}
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  })

  try {
    return NextResponse.json(
      JSON.parse(completion.choices[0].message.content || "")
    )
  } catch {
    return NextResponse.json({
      score: 50,
      reason: "Default",
      generatedEmail: "Hi, I can help grow your business.",
    })
  }
}