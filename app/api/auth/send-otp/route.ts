import { NextResponse } from "next/server";

import prisma from "@/shared/lib/prisma";
import { resend } from "@/shared/lib/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Email already exists",
        },
        {
          status: 409,
        }
      );
    }

    // Remove previous OTPs for this email
    await prisma.otpCode.deleteMany({
      where: {
        email,
      },
    });

    // Generate new OTP
    const code = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await prisma.otpCode.create({
      data: {
        email,
        code,
        expiresAt: new Date(
          Date.now() + 1000 * 60 * 10 // 10 minutes
        ),
      },
    });

    await resend.emails.send({
      from: "KONIQ CRM <otp@koniqtech.com>",
      to: email,
      subject: "Verify your KONIQ CRM account",
      html: `
        <div style="
          font-family: Arial;
          padding: 40px;
          background: #f5f7fb;
        ">
          <h1>Welcome to KONIQ CRM</h1>

          <p>Use the OTP below:</p>

          <div style="
            font-size: 42px;
            font-weight: bold;
            padding: 20px;
            background: white;
            border-radius: 12px;
          ">
            ${code}
          </div>

          <p>Expires in 10 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP error:", error);

    return NextResponse.json(
      {
        error: "Failed to send OTP",
      },
      {
        status: 500,
      }
    );
  }
}