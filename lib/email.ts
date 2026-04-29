import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "KoniqTech <onboarding@resend.dev>";

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  try {
    console.log("📤 Sending email →", to);

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("❌ RESEND ERROR:", error);
      throw new Error(error.message);
    }

    console.log("✅ Email sent");
  } catch (err: any) {
    console.error("❌ EMAIL FAILED:", err.message);
    throw err;
  }
}

/* OTP */
export async function sendOTP(email: string, otp: string) {
  const html = `
    <div style="font-family: Arial;">
      <h2>Your OTP Code</h2>
      <p>Use this code:</p>
      <h1>${otp}</h1>
      <p>Expires in 5 minutes</p>
    </div>
  `;

  return sendEmail(email, "Your OTP Code", html);
}

/* Reminder */
export async function sendReminderEmail(
  to: string,
  amount: number,
  paymentLink: string
) {
  const html = `
    <div style="font-family: Arial;">
      <h2>Payment Reminder</h2>
      <p>Amount:</p>
      <h1>$${amount}</h1>

      <a href="${paymentLink}" style="
        display:inline-block;
        padding:10px 18px;
        background:#000;
        color:#fff;
        text-decoration:none;
        border-radius:6px;
        margin-top:12px;
      ">
        Pay Now
      </a>
    </div>
  `;

  return sendEmail(to, "Invoice Reminder", html);
}