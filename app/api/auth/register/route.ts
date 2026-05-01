import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

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
       🔑 TOKEN
    ========================= */
    const token = randomUUID();
    const expiry = new Date(Date.now() + 1000 * 60 * 30); // 30 min

    /* =========================
       👤 UPSERT USER
    ========================= */
    await prisma.user.upsert({
      where: { email },
      update: {
        password: hashed,
        isVerified: false,
        verifyToken: token,
        verifyExpiry: expiry,
      },
      create: {
        email,
        password: hashed,
        isVerified: false,
        verifyToken: token,
        verifyExpiry: expiry,
      },
    });

    /* =========================
       🔗 VERIFY LINK
    ========================= */
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`;

    /* =========================
       📧 EMAIL CONTENT
    ========================= */
    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Verify your email</h2>

        <p>Click the button below to verify your account:</p>

        <a href="${link}" style="
          display:inline-block;
          margin-top:12px;
          padding:10px 18px;
          background:#000;
          color:#fff;
          text-decoration:none;
          border-radius:6px;
        ">
          Verify Email
        </a>

        <p style="margin-top:16px; font-size:12px; color:#666;">
          This link will expire in 30 minutes.
        </p>
      </div>
    `;

    const text = `
Verify your email

Click the link below to verify your account:
${link}

This link will expire in 30 minutes.
    `;

    /* =========================
       📤 SEND EMAIL (FIXED)
    ========================= */
    await sendEmail({
      to: email,
      subject: "Verify your email",
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