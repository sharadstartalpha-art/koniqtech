import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOTP } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, ref } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.user.upsert({
      where: { email },
      update: {
        password: hashed,
        otp,
        otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
        isVerified: false,
        ...(ref && { referredBy: ref }),
      },
      create: {
        email,
        password: hashed,
        otp,
        otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
        isVerified: false,
        referredBy: ref || null,
      },
    });

    // 🔥 SAFE EMAIL SEND
    try {
      await sendOTP(email, otp);
    } catch (err) {
      console.error("❌ OTP EMAIL FAILED:", err);
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (error) {
    console.error("❌ REGISTER ERROR:", error);

    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}