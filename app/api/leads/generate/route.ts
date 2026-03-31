import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    const prompt = `
Generate 5 business leads for: "${query}"

Return ONLY JSON like:
[
  { "name": "", "email": "", "company": "" }
]

Make emails realistic.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = response.choices[0].message.content || "[]";

    let leads = [];

    try {
      leads = JSON.parse(text);
    } catch {
      console.log("AI parse error:", text);
    }

    return NextResponse.json({ leads });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}