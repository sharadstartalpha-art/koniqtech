import { NextResponse } from "next/server";
import { resend } from "@/lib/email";
import { generateEmail } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    // ✅ AI EMAIL
    const emailContent = await generateEmail(name, "Company");

    await resend.emails.send({
      from: "KoniqTech <onboarding@resend.dev>",
      to: email,
      subject: "Quick question",
      html: `
        ${emailContent}

        <hr/>

        <p style="font-size:12px;color:gray">
          <a href="${process.env.APP_URL}/api/unsubscribe?email=${email}">
            Unsubscribe
          </a>
        </p>
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