import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Email required" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // ✅ delete old OTPs for this email
    await prisma.verificationToken.deleteMany({
      where: { email },
    });

    // ✅ create new OTP
    await prisma.verificationToken.create({
      data: {
        email,
        token: otp,
        expiresAt,
      },
    });

    // 📧 send email
    await sendEmail({
      to: email,
      subject: "Your OTP",
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