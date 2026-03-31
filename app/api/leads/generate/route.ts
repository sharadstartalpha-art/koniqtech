import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; ✅

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    // ✅ 1. Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ 2. Get user from DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { credits: true },
    });

    if (!user || !user.credits) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ 3. CHECK CREDITS
    if (user.credits.credits <= 0) {
      return NextResponse.json(
        { error: "No credits left. Please upgrade." },
        { status: 403 }
      );
    }

    const { query } = await req.json();

    // ✅ 4. Generate leads (AI)
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Generate 5 leads for: ${query}.
Return JSON:
[{ "name": "", "email": "", "company": "" }]`,
        },
      ],
    });

    const text = response.choices[0].message.content || "[]";

    let leads = [];

    try {
      leads = JSON.parse(text);
    } catch {
      console.log("Parse error:", text);
    }

    // ✅ 5. DEDUCT CREDIT
    await prisma.userCredits.update({
      where: { userId: user.id },
      data: {
        credits: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({ leads });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}