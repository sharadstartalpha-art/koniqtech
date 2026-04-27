import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// 🔹 CHANGE THIS AFTER DOMAIN VERIFY
const FROM_EMAIL = "onboarding@resend.dev";

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
          <p>Use the code below to login:</p>
          <h1>${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    });

    if (response.error) {
      console.error("❌ RESEND ERROR:", response.error.message);
      throw new Error(response.error.message);
    }

    console.log("✅ OTP sent successfully");
    return response;
  } catch (error: any) {
    console.error("❌ OTP EMAIL FAILED:", error.message);
    throw error;
  }
}

export async function sendReminderEmail(
  to: string,
  amount: number,
  paymentLink: string
) {
  try {
    console.log("📨 Sending reminder to:", to);

    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Invoice Reminder",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Payment Reminder</h2>
          <p>You have a pending invoice:</p>

          <p style="font-size: 22px; font-weight: bold;">
            $${amount}
          </p>

          <a href="${paymentLink}" style="
            display:inline-block;
            margin-top:12px;
            padding:10px 18px;
            background:#000;
            color:#fff;
            text-decoration:none;
            border-radius:6px;
          ">
            Pay Now
          </a>

          <p style="margin-top:20px;">Thank you 🙏</p>
        </div>
      `,
    });

    if (response.error) {
      console.error("❌ RESEND ERROR:", response.error.message);
      throw new Error(response.error.message);
    }

    console.log("✅ Reminder sent successfully");
    return response;
  } catch (error: any) {
    console.error("❌ REMINDER EMAIL FAILED:", error.message);
    throw error;
  }
}