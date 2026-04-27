import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOTP } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Upsert user (create OR update)
    await prisma.user.upsert({
      where: { email },
      update: {
        password: hashed,
        otp,
        otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
      },
      create: {
        email,
        password: hashed,
        otp,
        otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    await sendOTP(email, otp);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}