import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email & password required" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const token = randomUUID();

    await prisma.user.upsert({
      where: { email },
      update: {
        password: hashed,
        isVerified: false,
        verifyToken: token,
        verifyExpiry: new Date(Date.now() + 1000 * 60 * 30), // 30 min
      },
      create: {
        email,
        password: hashed,
        isVerified: false,
        verifyToken: token,
        verifyExpiry: new Date(Date.now() + 1000 * 60 * 30),
      },
    });

    // ✅ EMAIL LINK
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`;

    await sendEmail(
      email,
      "Verify your email",
      `
      <h2>Verify your email</h2>
      <p>Click below:</p>
      <a href="${link}">Verify Email</a>
      `
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}