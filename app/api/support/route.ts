
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";
import { resend } from "@/shared/lib/resend";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const ALLOWED_CATEGORIES = [
  "Technical issue",
  "Billing and subscription",
  "Login and account",
  "Feature request",
  "Other",
] as const;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate the requester.
    const session = await auth();

    if (!session?.user?.id || !session.user.orgId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please sign in to submit a support request.",
        },
        { status: 401 }
      );
    }

    // 2. Confirm the account is still active.
    const user = await prisma.user.findFirst({
      where: {
        id: session.user.id,
        orgId: session.user.orgId,
        status: "active",
      },
      select: {
        id: true,
        orgId: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Your account could not be verified.",
        },
        { status: 403 }
      );
    }

    // 3. Parse and validate the request.
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid support request." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    const category =
      typeof data.category === "string" ? data.category.trim() : "";

    const subject =
      typeof data.subject === "string" ? data.subject.trim() : "";

    const description =
      typeof data.description === "string"
        ? data.description.trim()
        : "";

    if (
      !ALLOWED_CATEGORIES.includes(
        category as (typeof ALLOWED_CATEGORIES)[number]
      )
    ) {
      return NextResponse.json(
        { success: false, message: "Select a valid problem category." },
        { status: 400 }
      );
    }

    if (!subject || subject.length > 150) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject is required and must be 150 characters or fewer.",
        },
        { status: 400 }
      );
    }

    if (description.length < 10 || description.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          message: "Description must contain 10–5000 characters.",
        },
        { status: 400 }
      );
    }

    const email = user.email?.trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Your account does not have a valid email address.",
        },
        { status: 400 }
      );
    }

    // 4. Generate a unique, human-readable ticket number.
    const ticketNumber = `KT-${randomUUID()
      .replace(/-/g, "")
      .slice(0, 10)
      .toUpperCase()}`;

    // 5. Save the ticket before attempting email delivery.
    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId: user.id,
        orgId: user.orgId,
        userName: user.name?.trim() || email,
        email,
        category,
        subject,
        description,
      },
      select: {
        id: true,
        ticketNumber: true,
        createdAt: true,
      },
    });

    // 6. Notify support. An email failure must not erase the ticket.
    let notificationSent = true;

    try {
      const result = await resend.emails.send({
        from: "KoniqTech Support <noreply@koniqtech.com>",
        to: "info@koniqtech.com",
        replyTo: email,
        subject: `[${ticket.ticketNumber}] ${subject}`,
        text: [
          "New KoniqTech support request",
          "",
          `Ticket: ${ticket.ticketNumber}`,
          `Name: ${user.name?.trim() || "Not provided"}`,
          `Email: ${email}`,
          `Organization ID: ${user.orgId}`,
          `Category: ${category}`,
          `Subject: ${subject}`,
          "",
          "Description:",
          description,
          "",
          `Created: ${ticket.createdAt.toISOString()}`,
        ].join("\n"),
      });

      if (result.error) {
        notificationSent = false;
        console.error(
          "Support notification email failed:",
          result.error
        );
      }
    } catch (emailError) {
      notificationSent = false;
      console.error("Support notification email failed:", emailError);
    }

    // The ticket is saved even if email delivery fails.
    return NextResponse.json(
      {
        success: true,
        message: notificationSent
          ? "Your support request has been submitted."
          : "Your support request has been saved, but the notification email could not be sent.",
        ticketNumber: ticket.ticketNumber,
        notificationSent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Support request error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit your support request. Please try again.",
      },
      { status: 500 }
    );
  }
}
