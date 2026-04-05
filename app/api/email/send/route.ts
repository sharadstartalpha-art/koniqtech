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
      include: { balance: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ⚡ 4. Check balance BEFORE sending
    try {
      await checkBalance(user.id, 1);
    } catch (err) {
      return NextResponse.json(
        { error: "NO_balance" },
        { status: 402 }
      );
    }

    // 📧 5. Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "KoniqTech <onboarding@koniqtech.com>", // change to your domain later
      to,
      subject,
      html,
    });

    // ❌ If email fails → DO NOT deduct balance
    if (!emailResponse || emailResponse.error) {
      return NextResponse.json(
        { error: "Email failed to send" },
        { status: 500 }
      );
    }

    // 💳 6. Deduct balance AFTER success
    await prisma.userBalance.update({
      where: { userId: user.id },
      data: {
        balance: {
          decrement: 1,
        },
      },
    });

    // 📊 7. Track usage (optional but recommended)
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
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("EMAIL SEND ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}