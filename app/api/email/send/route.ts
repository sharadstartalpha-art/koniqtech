import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deductCredit, getUserBalance } from "@/lib/balance";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // 🔐 1. Auth
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 📦 2. Get request data
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // 👤 3. Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ⚡ 4. CHECK BALANCE (FIXED ✅)
    const balance = await getUserBalance(user.id);

    if (balance <= 0) {
      return NextResponse.json(
        { error: "NO_CREDITS" },
        { status: 402 }
      );
    }

    // 📧 5. Send email
    const emailResponse = await resend.emails.send({
      from: "KoniqTech <onboarding@koniqtech.com>",
      to,
      subject,
      html,
    });

    if (!emailResponse || emailResponse.error) {
      return NextResponse.json(
        { error: "Email failed" },
        { status: 500 }
      );
    }

    // 💳 6. Deduct AFTER success (FIXED ✅)
    await deductCredit(user.id);

    // 📊 7. Track usage
    await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: 0,
        balance: 1,
        type: "CREDIT_USAGE",
        status: "EMAIL_SENT",
        provider: "system",
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}