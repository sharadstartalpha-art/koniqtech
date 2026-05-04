import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, html } = await req.json();

    if (!email || !html) {
      return NextResponse.json(
        { error: "Missing email or content" },
        { status: 400 }
      );
    }

    /* =========================
       🔍 FIND INVOICE
    ========================= */
    const invoice = await prisma.invoice.findFirst({
      where: { clientEmail: email },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    /* =========================
       🔄 HTML → TEXT
    ========================= */
    const text = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .trim();

    /* =========================
       💾 CREATE REMINDER
    ========================= */
    const reminder = await prisma.reminder.create({
      data: {
        userId: invoice.userId,           // ✅ FIX
        invoiceId: invoice.id,

        email: invoice.clientEmail,
        amount: invoice.amount,

        html,
        text,

        type: "friendly",                 // or dynamic later
        mode: "manual",                  // ✅ FIX

        status: "sent",
        sentAt: new Date(),
      },
    });

    /* =========================
       🧠 TRACKING PIXEL
    ========================= */
    const trackingPixel = `<img src="${process.env.NEXT_PUBLIC_BASE_URL}/api/reminders/track?id=${reminder.id}" width="1" height="1" />`;

    const finalHtml = html + trackingPixel;

    /* =========================
       📧 SEND EMAIL
    ========================= */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    await transporter.sendMail({
      from: `"KoniqTech" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Invoice Reminder",
      text,
      html: finalHtml,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("SEND REMINDER ERROR:", error);

    return NextResponse.json(
      { error: "Failed to send reminder..." },
      { status: 500 }
    );
  }
}