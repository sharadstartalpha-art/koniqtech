import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { threadId, message, to } = await req.json();

    if (!threadId || !message || !to) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ✅ SEND EMAIL
    await resend.emails.send({
      from: "KoniqTech <onboarding@resend.dev>",
      to,
      subject: "Re: Conversation",
      html: message,
    });

    // ✅ SAVE MESSAGE
    const saved = await prisma.emailMessage.create({
      data: {
        threadId,
        from: "me@koniqtech.com",
        to,
        body: message,
      },
    });

    // ✅ STOP FUTURE EMAILS
    await prisma.emailQueue.updateMany({
      where: {
        email: to,
        status: "PENDING",
      },
      data: {
        status: "CANCELLED",
        stopped: true,
      },
    });

    return NextResponse.json({ success: true, message: saved });

  } catch (error) {
    console.error("Reply Error:", error);

    return NextResponse.json(
      { error: "Failed to send reply" },
      { status: 500 }
    );
  }
}