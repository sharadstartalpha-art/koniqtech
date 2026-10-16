
import { NextResponse } from "next/server";
import { randomInt, createHash } from "node:crypto";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";
import { resend } from "@/shared/lib/resend";

const OTP_EXPIRY_MINUTES = 10;
const MAX_REQUESTS = 3;
const RATE_WINDOW_MINUTES = 15;

function hashOtp(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

export async function POST() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const orgId = session?.user?.orgId;

    if (!userId || !orgId) {
      return NextResponse.json(
        { success: false, message: "Please sign in again." },
        { status: 401 }
      );
    }

    // Only the organization owner may initiate cancellation.
    // Expand this after verifying your billing-permission model.
const organizationRole = await prisma.organizationRole.findFirst({
  where: {
    orgId,
    name: "owner",
    active: true,
    users: {
      some: {
        id: userId,
      },
    },
  },
  select: {
    id: true,
  },
});

if (!organizationRole) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Only the organization owner can cancel the subscription.",
    },
    { status: 403 }
  );
}

    const user = await prisma.user.findFirst({
      where: { id: userId, orgId },
      select: { id: true, email: true },
    });

    if (!user?.email) {
      return NextResponse.json(
        { success: false, message: "Your account email could not be found." },
        { status: 400 }
      );
    }

    const subscription = await prisma.subscription.findUnique({
      where: { orgId },
      select: { id: true, status: true, cancelAtPeriodEnd: true },
    });

    if (!subscription) {
      return NextResponse.json(
        { success: false, message: "No subscription was found." },
        { status: 404 }
      );
    }

    if (subscription.cancelAtPeriodEnd) {
      return NextResponse.json(
        {
          success: false,
          message: "This subscription is already scheduled for cancellation.",
        },
        { status: 409 }
      );
    }

    const now = new Date();
    const rateWindowStart = new Date(
      now.getTime() - RATE_WINDOW_MINUTES * 60 * 1000
    );

    const recentRequests =
      await prisma.subscriptionCancellationOtp.count({
        where: {
          userId,
          orgId,
          createdAt: { gte: rateWindowStart },
        },
      });

    if (recentRequests >= MAX_REQUESTS) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many OTP requests. Please try again in 15 minutes.",
        },
        { status: 429 }
      );
    }

    // Invalidate any previous cancellation codes for this user and organization.
    await prisma.subscriptionCancellationOtp.deleteMany({
      where: { userId, orgId },
    });

    const otp = randomInt(100000, 1000000).toString();
    const expiresAt = new Date(
      now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    await prisma.subscriptionCancellationOtp.create({
      data: {
        userId,
        orgId,
        email: user.email,
        codeHash: hashOtp(otp),
        expiresAt,
      },
    });

    const emailResult = await resend.emails.send({
      from: "KoniqTech <noreply@koniqtech.com>",
      to: user.email,
      subject: "Your KoniqTech cancellation verification code",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>Confirm subscription cancellation</h2>
          <p>Use this code to verify your cancellation request:</p>
          <h1 style="letter-spacing:6px">${otp}</h1>
          <p>This code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
          <p>If you did not request cancellation, you can ignore this email.
          Your subscription has not been cancelled.</p>
        </div>
      `,
    });

    if (emailResult.error) {
      await prisma.subscriptionCancellationOtp.deleteMany({
        where: { userId, orgId },
      });

      console.error("Cancellation OTP email failed:", emailResult.error);

      return NextResponse.json(
        { success: false, message: "Unable to send the verification email. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "A cancellation verification code was sent to your registered email.",
      expiresInSeconds: OTP_EXPIRY_MINUTES * 60,
      emailHint: user.email.replace(/^(.{2}).*(@.*)$/, "$1***$2"),
    });
  } catch (error) {
    console.error("Send cancellation OTP error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to start cancellation verification." },
      { status: 500 }
    );
  }
}
