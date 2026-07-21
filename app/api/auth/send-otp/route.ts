import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";
import { generateOtp } from "@/shared/lib/auth/otp";
import { resend } from "@/shared/lib/resend";

const OTP_EXPIRY_MINUTES = 10;

interface SendOtpBody {
  email: string;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email);
}


async function sendOtpEmail(
  email: string,
  otp: string
) {
  await resend.emails.send({
    from: "KoniqTech <noreply@koniqtech.com>",

    to: email,

    subject: "Verify your email",

    html: `
      <div style="font-family:Arial,sans-serif">

        <h2>Email Verification</h2>

        <p>Your verification code is:</p>

        <h1 style="letter-spacing:6px">
          ${otp}
        </h1>

        <p>
          This code expires in
          ${OTP_EXPIRY_MINUTES} minutes.
        </p>

      </div>
    `,
  });
}


export async function POST(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as SendOtpBody;

    const email = normalizeEmail(body.email);

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address.",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An account already exists with this email.",
        },
        {
          status: 409,
        }
      );
    }

    const otp = generateOtp();

    const expiresAt = getExpiryDate();

    await prisma.otpCode.deleteMany({
      where: {
        email,
      },
    });

    await prisma.otpCode.create({
      data: {
        email,
        code: otp,
        expiresAt,
        verified: false,
      },
    });

    try {
      await sendOtpEmail(email, otp);
    } catch (emailError) {
      await prisma.otpCode.deleteMany({
        where: {
          email,
        },
      });

      console.error(
        "Failed to send OTP email:",
        emailError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to send verification email. Please try again.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Verification code sent successfully.",
      },
      {
        status: 200,
      }
    );



      } catch (error) {
    console.error("Send OTP Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while sending the verification code.",
      },
      {
        status: 500,
      }
    );
  }
}


function getExpiryDate() {
  const expires = new Date();

  expires.setMinutes(
    expires.getMinutes() + OTP_EXPIRY_MINUTES
  );

  return expires;
}