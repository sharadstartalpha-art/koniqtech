
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";
import { cancelPayPalSubscription } from "@/shared/lib/paypal";

export async function POST(request: Request) {
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

    let body: { otp?: unknown };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request." },
        { status: 400 }
      );
    }

    const otp =
      typeof body.otp === "string" ? body.otp.trim() : "";

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid six-digit verification code.",
        },
        { status: 400 }
      );
    }

    const email = user.email.trim().toLowerCase();
    const now = new Date();

    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        email,
        code: otp,
        verified: false,
        expiresAt: { gt: now },
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired verification code. Request a new code and try again.",
        },
        { status: 400 }
      );
    }

    const subscription = await prisma.subscription.findUnique({
      where: { orgId: session.user.orgId },
    });

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          message: "No subscription was found for this organization.",
        },
        { status: 404 }
      );
    }

    if (subscription.status === "cancelled") {
      return NextResponse.json(
        {
          success: false,
          message: "This subscription has already been cancelled.",
        },
        { status: 409 }
      );
    }

    if (subscription.status === "expired") {
      return NextResponse.json(
        {
          success: false,
          message: "This subscription has already expired.",
        },
        { status: 409 }
      );
    }

    // Cancel the provider subscription before changing our database.
    // Free trials normally have no external PayPal subscription.
    if (
      subscription.status === "active" &&
      subscription.provider.trim().toLowerCase() === "paypal"
    ) {
      if (!subscription.externalId) {
        return NextResponse.json(
          {
            success: false,
            message: "The PayPal subscription ID is missing. Please contact support.",
          },
          { status: 409 }
        );
      }

      await cancelPayPalSubscription(
        subscription.externalId,
        "Cancellation requested by the organization owner"
      );
    }

    // Recheck the OTP inside the transaction to prevent reuse.
    await prisma.$transaction(async (tx) => {
      const currentOtp = await tx.otpCode.findFirst({
        where: {
          id: otpRecord.id,
          email,
          code: otp,
          verified: false,
          expiresAt: { gt: new Date() },
        },
      });

      if (!currentOtp) {
        throw new Error("OTP_INVALID_OR_EXPIRED");
      }

      const currentSubscription = await tx.subscription.findUnique({
        where: { orgId: session.user.orgId! },
      });

      if (
        !currentSubscription ||
        currentSubscription.status === "cancelled" ||
        currentSubscription.status === "expired"
      ) {
        throw new Error("SUBSCRIPTION_NOT_CANCELLABLE");
      }

      await tx.subscription.update({
        where: { orgId: session.user.orgId! },
        data: {
          status: "cancelled",
          cancelAtPeriodEnd: false,
        },
      });

      await tx.otpCode.update({
        where: { id: currentOtp.id },
        data: { verified: true },
      });
    });

    return NextResponse.json({
      success: true,
      message:
        "Your subscription has been cancelled. Your business records have been preserved.",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "OTP_INVALID_OR_EXPIRED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "This verification code is invalid, expired, or already used. Request a new code.",
        },
        { status: 400 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "SUBSCRIPTION_NOT_CANCELLABLE"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "The subscription changed while cancellation was processing. Refresh the page and try again.",
        },
        { status: 409 }
      );
    }

    console.error("Subscription cancellation verification failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to complete cancellation. Please try again or contact support.",
      },
      { status: 500 }
    );
  }
}
