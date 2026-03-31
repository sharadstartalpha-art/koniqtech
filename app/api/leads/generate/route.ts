import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { query } = await req.json();

    // 🔥 GET USER
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const credits = await prisma.userCredits.findUnique({
      where: { userId: user!.id },
    });

    // ❌ NO CREDITS
    if (!credits || credits.credits <= 0) {
      return NextResponse.json({ error: "No credits left" }, { status: 400 });
    }

    // 🤖 OPENAI CALL
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a lead generation assistant. Return ONLY JSON array of leads with name and email.",
        },
        {
          role: "user",
          content: `Generate 5 leads for: ${query}. Format:
[
  { "name": "John Doe", "email": "john@example.com" }
]`,
        },
      ],
    });

    const text = completion.choices[0].message.content || "";

    console.log("RAW AI:", text); // 👈 DEBUG

    let leads = [];

    try {
      leads = JSON.parse(text);
    } catch (err) {
      console.log("JSON parse failed");

      // fallback (very important)
      leads = [
        { name: "Demo Lead 1", email: "demo1@email.com" },
        { name: "Demo Lead 2", email: "demo2@email.com" },
      ];
    }

    // 💰 DEDUCT CREDIT
    await prisma.userCredits.update({
      where: { userId: user!.id },
      data: {
        credits: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({ leads });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ leads: [] });
  }
}