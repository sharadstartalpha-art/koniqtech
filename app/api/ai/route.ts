import OpenAI from "openai"
import { prisma } from "@/lib/prisma"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { message, projectId } = await req.json()

    if (!message || !projectId) {
      return new Response("Missing data", { status: 400 })
    }

    // ✅ get previous messages
    const history = await prisma.message.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
      take: 20,
    })

    const formatted = history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }))

    // ✅ add new user message
    formatted.push({ role: "user", content: message })

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant inside a SaaS product.",
        },
        ...formatted,
      ],
    })

    const reply = completion.choices[0].message.content || ""

    // ✅ SAVE USER MESSAGE
    await prisma.message.create({
      data: {
        content: message,
        role: "user",
        projectId,
      },
    })

    // ✅ SAVE AI MESSAGE
    await prisma.message.create({
      data: {
        content: reply,
        role: "assistant",
        projectId,
      },
    })

    return Response.json({ reply })

  } catch (err) {
    console.error(err)
    return new Response("AI error", { status: 500 })
  }
}