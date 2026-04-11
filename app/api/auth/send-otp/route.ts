import { prisma } from "@/lib/prisma";
import { generateOTP } from "@/lib/otp";
import { sendEmail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    // ✅ CHECK USER FIRST (FIXED)
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const otp = generateOTP();

    await prisma.verificationToken.create({
      data: {
        email,
        token: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendEmail(
      email,
      "Your OTP Code",
      `<h2>Your OTP is: ${otp}</h2>`
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}