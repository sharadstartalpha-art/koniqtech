import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, html, amount } = await req.json();

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
      orderBy: { createdAt: "desc" },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found for this email" },
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
       📧 SEND EMAIL
    ========================= */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"KoniqTech" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Invoice Reminder",
      text,
      html,
    });

    /* =========================
       💾 SAVE REMINDER
    ========================= */
    await prisma.reminder.create({
      data: {
        invoiceId: invoice.id, // ✅ correct relation
        type: "friendly",
        status: "sent",
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("SEND REMINDER ERROR:", error);

    return NextResponse.json(
      { error: "Failed to send reminder" },
      { status: 500 }
    );
  }
}