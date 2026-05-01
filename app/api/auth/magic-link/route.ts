import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    /* =========================
       📥 INPUT
    ========================= */
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    /* =========================
       👤 CREATE USER (IF NOT EXISTS)
    ========================= */
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    /* =========================
       🔐 GENERATE MAGIC TOKEN
    ========================= */
    const token = crypto.randomUUID();

    await prisma.magicLink.create({
      data: {
        email,
        token,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      },
    });

    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`;

    /* =========================
       📧 EMAIL CONTENT
    ========================= */
    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Login to KoniqTech</h2>

        <p>Click the button below to securely login:</p>

        <a href="${link}" style="
          display:inline-block;
          margin-top:12px;
          padding:10px 18px;
          background:#000;
          color:#fff;
          text-decoration:none;
          border-radius:6px;
        ">
          Login
        </a>

        <p style="margin-top:16px; font-size:12px; color:#666;">
          This link will expire in 10 minutes.
        </p>
      </div>
    `;

    const text = `
Login to KoniqTech

Click the link below to login:
${link}

This link will expire in 10 minutes.
    `;

    /* =========================
       📤 SEND EMAIL (FIXED)
    ========================= */
    await sendEmail({
      to: email,
      subject: "Login to KoniqTech",
      html,
      text,
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("MAGIC LINK ERROR:", err);

    return NextResponse.json(
      { error: "Failed to send link" },
      { status: 500 }
    );
  }
}