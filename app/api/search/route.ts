import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) return NextResponse.json([]);

    // 🧠 AI parsing
    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Extract structured filters from user query.
Return JSON with:
category, title, country, isHiring, techStack`,
        },
        {
          role: "user",
          content: query,
        },
      ],
    });

    const parsed = JSON.parse(aiRes.choices[0].message.content || "{}");

    // 🔍 DB search
    const leads = await prisma.lead.findMany({
      where: {
        category: parsed.category,
        title: parsed.title
          ? { contains: parsed.title, mode: "insensitive" }
          : undefined,
        country: parsed.country,
        isHiring: parsed.isHiring,
        techStack: parsed.techStack
          ? { hasSome: parsed.techStack }
          : undefined,
      },
      take: 50,
    });

    return NextResponse.json({ parsed, results: leads });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Search failed" });
  }
}