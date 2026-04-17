import { sendEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      html: `<h1>Your OTP is ${otp}</h1>`,
    });

    return Response.json({ success: true });

  } catch (err: any) {
    console.error("❌ OTP SEND ERROR:", err);

    return Response.json(
      {
        error: "Failed to send OTP",
        details: err?.message,
      },
      { status: 500 }
    );
  }
}