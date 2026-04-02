import { NextResponse } from "next/server"
import OpenAI from "openai"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { query } = await req.json()

    // ✅ GET USER
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // ✅ GET CREDITS
    const credits = await prisma.userCredits.findUnique({
      where: { userId: user.id },
    })

    // ❌ NO CREDITS
    if (!credits || credits.balance <= 0) {
      return NextResponse.json({ error: "No credits left" }, { status: 400 })
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
    })

    const text = completion.choices[0].message.content || ""

    let leads = []

    try {
      leads = JSON.parse(text)
    } catch {
      leads = [
        { name: "Demo Lead 1", email: "demo1@email.com" },
        { name: "Demo Lead 2", email: "demo2@email.com" },
      ]
    }

    // 💰 DEDUCT CREDIT (FIXED)
    await prisma.userCredits.update({
      where: { userId: user.id },
      data: {
        balance: {
          decrement: 1,
        },
      },
    })

    return NextResponse.json({ leads })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ leads: [] })
  }
}