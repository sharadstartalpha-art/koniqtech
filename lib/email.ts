import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ⚠️ Use onboarding@resend.dev for testing OR your verified domain
const FROM_EMAIL = "KoniqTech <onboarding@resend.dev>";

/* 🔹 CLEAN GENERIC EMAIL SENDER */
export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("❌ RESEND ERROR:", error.message);
      throw new Error(error.message);
    }

    console.log(`✅ Email sent → ${to}`);
  } catch (err: any) {
    console.error("❌ EMAIL FAILED:", err.message);
    throw err;
  }
}

/* 🔐 OTP EMAIL (UNCHANGED) */
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

/* 💰 INVOICE REMINDER EMAIL (UNCHANGED) */
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