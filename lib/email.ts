import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// 🔹 Base sender (change later when domain verified)
const FROM_EMAIL = "KoniqTech <onboarding@resend.dev>";

/**
 * ✅ Send OTP Email
 */
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
          <h1 style="letter-spacing: 2px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    });

    console.log("✅ OTP sent:", response);
    return response;
  } catch (error) {
    console.error("❌ OTP EMAIL ERROR:", error);
    throw error;
  }
}

/**
 * ✅ Send Invoice Reminder Email
 */
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

          <a 
            href="${paymentLink}" 
            style="
              display:inline-block;
              margin-top:12px;
              padding:10px 18px;
              background:#000;
              color:#fff;
              text-decoration:none;
              border-radius:6px;
            "
          >
            Pay Now
          </a>

          <p style="margin-top:20px;">Thank you 🙏</p>
        </div>
      `,
    });

    console.log("✅ Reminder sent:", response);
    return response;
  } catch (error) {
    console.error("❌ REMINDER EMAIL ERROR:", error);
    throw error;
  }
}