import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ⚠️ Make sure this domain is verified in Resend
const FROM_EMAIL = "KoniqTech <noreply@koniqtech.com>";

/* 🔹 GENERIC EMAIL SENDER (reusable) */
async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  try {
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (res.error) {
      console.error("❌ RESEND ERROR:", res.error.message);
      throw new Error(res.error.message);
    }

    console.log(`✅ Email sent → ${to}`);
    return res;
  } catch (error: any) {
    console.error("❌ EMAIL FAILED:", error.message);
    throw error;
  }
}

/* 🔐 OTP EMAIL */
export async function sendOTP(email: string, otp: string) {
  console.log("📨 Sending OTP to:", email);

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Your OTP Code</h2>
      <p>Use the code below to login:</p>
      <h1>${otp}</h1>
      <p>This code will expire in 5 minutes.</p>
    </div>
  `;

  return sendEmail(email, "Your Login Code", html);
}

/* 💰 INVOICE REMINDER EMAIL */
export async function sendReminderEmail(
  to: string,
  amount: number,
  paymentLink: string
) {
  console.log("📨 Sending reminder to:", to);

  const html = `
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
  `;

  return sendEmail(to, "Invoice Reminder", html);
}

/* 🔹 EXPORT (IMPORTANT for reminders.ts) */
export { sendEmail };