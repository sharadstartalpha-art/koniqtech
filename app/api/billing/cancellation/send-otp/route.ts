
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";
import { generateOtp } from "@/shared/lib/auth/otp";
import { resend } from "@/shared/lib/resend";

const OTP_EXPIRY_MINUTES = 10;

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.user.orgId) {
      return NextResponse.json(
        { success: false, message: "Please sign in again." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
  id: session.user.id,
  orgId: session.user.orgId,
  status: "active",
},
      include: {
        organizationRole: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User account not found." },
        { status: 404 }
      );
    }

    if (
      user.organizationRole?.name?.trim().toLowerCase() !== "owner"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Only the organization owner can cancel the subscription.",
        },
        { status: 403 }
      );
    }

    const email = user.email.trim().toLowerCase();
    const otp = generateOtp();
    const expiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    await prisma.otpCode.deleteMany({
      where: { email },
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
      const result = await resend.emails.send({
        from: "KoniqTech <noreply@koniqtech.com>",
        to: email,
        subject: "Confirm your KoniqTech subscription cancellation",
        html: `
          <div style="font-family:Arial,sans-serif">
            <h2>Subscription cancellation verification</h2>
            <p>Use this code to verify your cancellation request:</p>
            <h1 style="letter-spacing:6px">${otp}</h1>
            <p>This code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
            <p>If you did not request this code, you can ignore this email.</p>
          </div>
        `,
      });

      if (result.error) {
        throw new Error("Email provider could not send the verification code.");
      }
    } catch (emailError) {
      await prisma.otpCode.deleteMany({
        where: { email, code: otp },
      });

      console.error("Cancellation OTP email failed:", emailError);

      return NextResponse.json(
        {
          success: false,
          message: "Unable to send the verification email. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cancellation verification code sent.",
      emailHint: email.replace(/^(.{2}).*(@.*)$/, "$1***$2"),
    });
  } catch (error) {
    console.error("Cancellation OTP error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to process the request." },
      { status: 500 }
    );
  }
}
