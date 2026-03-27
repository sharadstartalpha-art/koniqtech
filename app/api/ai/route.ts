import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { message, projectId } = await req.json();

    // ❌ validate input
    if (!message || !projectId) {
      return new Response("Missing data", { status: 400 });
    }

    // ✅ INIT OpenAI INSIDE FUNCTION (IMPORTANT FIX)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    // ✅ get previous messages (context)
    const history = await prisma.message.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    const formattedMessages = history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // ✅ add current user message
    formattedMessages.push({
      role: "user",
      content: message,
    });

    // ✅ AI call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant inside a SaaS product that helps with lead generation, automation, and productivity.",
        },
        ...formattedMessages,
      ],
    });

    const reply = completion.choices[0].message.content || "";

    // ✅ save user message
    await prisma.message.create({
      data: {
        content: message,
        role: "user",
        projectId,
      },
    });

    // ✅ save AI response
    await prisma.message.create({
      data: {
        content: reply,
        role: "assistant",
        projectId,
      },
    });

    return Response.json({ reply });
  } catch (error) {
    console.error("AI ERROR:", error);
    return new Response("AI error", { status: 500 });
  }
}