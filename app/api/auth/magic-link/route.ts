import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    // ✅ CREATE USER IF NOT EXISTS
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    // 🔥 MAGIC TOKEN
    const token = crypto.randomUUID();

    await prisma.magicLink.create({
      data: {
        email,
        token,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`;

    await sendEmail(
      email,
      "Login to KoniqTech",
      `
        <h2>Login to KoniqTech</h2>
        <p>Click below to login:</p>
        <a href="${link}">Login</a>
      `
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to send link" },
      { status: 500 }
    );
  }
}