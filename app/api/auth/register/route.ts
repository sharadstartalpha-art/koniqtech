import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    /* =========================
       📥 INPUT
    ========================= */
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email & password required" },
        { status: 400 }
      );
    }

    /* =========================
       🔐 HASH PASSWORD
    ========================= */
    const hashed = await bcrypt.hash(password, 10);

    /* =========================
       🔢 GENERATE OTP
    ========================= */
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes

    /* =========================
       👤 UPSERT USER
    ========================= */
    await prisma.user.upsert({
      where: { email },
      update: {
        password: hashed,
        isVerified: false,
        otp: otp,
        otpExpiry: expiry,
      },
      create: {
        email,
        password: hashed,
        isVerified: false,
        otp: otp,
        otpExpiry: expiry,
      },
    });

    /* =========================
       📧 EMAIL CONTENT (OTP)
    ========================= */
    const html = `
      <div style="font-family: Arial;">
        <h2>Your OTP Code</h2>
        <p>Use this OTP to verify your account:</p>
        <h1 style="letter-spacing:4px;">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      </div>
    `;

    const text = `Your OTP is: ${otp}`;

    /* =========================
       📤 SEND EMAIL
    ========================= */
    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      html,
      text,
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}