import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { message, projectId } = await req.json()

    if (!message || !projectId) {
      return NextResponse.json(
        { error: "Missing message or projectId" },
        { status: 400 }
      )
    }

    // ✅ Find or create chat
    let chat = await prisma.chat.findFirst({
      where: { projectId },
    })

    if (!chat) {
      chat = await prisma.chat.create({
        data: { projectId },
      })
    }

    // ✅ Get history
    const history = await prisma.message.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: "asc" },
      take: 20,
    })

    // ✅ Format messages
    const formattedMessages: OpenAI.Chat.ChatCompletionMessageParam[] =
      history.map((msg) => ({
        role: msg.role === "USER" ? "user" : "assistant",
        content: msg.content,
      }))

    formattedMessages.push({
      role: "user",
      content: message,
    })

    // ✅ OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
    })

    const reply =
      completion.choices[0]?.message?.content || "No response"

    // ✅ Save USER
    await prisma.message.create({
      data: {
        chatId: chat.id,
        content: message,
        role: "USER",
      },
    })

    // ✅ Save AI
    await prisma.message.create({
      data: {
        chatId: chat.id,
        content: reply,
        role: "ASSISTANT",
      },
    })

    return NextResponse.json({ success: true, reply })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}