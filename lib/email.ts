import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ FIXED: use your verified domain
const FROM_EMAIL = "KoniqTech <noreply@koniqtech.com>";

export async function sendOTP(email: string, otp: string) {
  try {
    console.log("📨 Sending OTP to:", email);

    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Your Login Code",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Your OTP Code</h2>
          <h1>${otp}</h1>
          <p>This code expires in 5 minutes.</p>
        </div>
      `,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    console.log("✅ OTP sent");
    return response;
  } catch (error: any) {
    console.error("❌ OTP ERROR:", error.message);
    throw error;
  }
}