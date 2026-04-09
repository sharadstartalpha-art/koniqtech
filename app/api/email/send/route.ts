import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deductCredit, getBalance } from "@/lib/balance";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { to, subject, html } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ check balance
    const balance = await getBalance(user.id);

    if (balance <= 0) {
      return NextResponse.json({ error: "NO_CREDITS" }, { status: 402 });
    }

    // ✅ send email
    await resend.emails.send({
      from: "KoniqTech <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    // ✅ deduct credit
    await deductCredit(user.id);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}