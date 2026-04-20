import OpenAI from "openai"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY");
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const { leadIds } = await req.json()

    for (const id of leadIds) {
      const lead = await prisma.lead.findUnique({
        where: { id },
      })

      if (!lead) continue

      const prompt = `
Company: ${lead.company}
Website: ${lead.website || "Not available"}

Give:
1. What they do (1 line)
2. Why they need lead gen tools
3. Cold email opener
`

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      })

      const text = completion.choices[0].message.content || ""

      // ✅ TEMP: no DB storage (safe)
      console.log("Enrichment result:", text)
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error(err)
    return new Response("Error", { status: 500 })
  }
}