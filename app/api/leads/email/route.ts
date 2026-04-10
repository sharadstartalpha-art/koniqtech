import { NextResponse } from "next/server";
import { resend } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "KoniqTech <onboarding@resend.dev>",
      to: email,
      subject: "Quick question",
      html: `
        <p>Hi ${name || ""},</p>
        <p>I came across your profile and wanted to connect.</p>
        <p>Would love to chat!</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email Error:", error);

    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}