import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ⚠️ Use onboarding@resend.dev (test) OR your verified domain
const FROM_EMAIL = "KoniqTech <no-reply@koniqtech.com>";

/* 🔹 GENERIC EMAIL SENDER */
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

/* 🔐 MAGIC LINK EMAIL */
export async function sendMagicLink(
  email: string,
  link: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Login to KoniqTech</h2>
      <p>Click the button below to securely sign in:</p>

      <a href="${link}" style="
        display:inline-block;
        margin-top:12px;
        padding:10px 18px;
        background:#000;
        color:#fff;
        text-decoration:none;
        border-radius:6px;
      ">
        Login
      </a>

      <p style="margin-top:16px; font-size:12px; color:#666;">
        This link will expire in 10 minutes.
      </p>
    </div>
  `;

  return sendEmail(email, "Your login link", html);
}

/* 💰 INVOICE REMINDER EMAIL */
export async function sendReminderEmail(
  to: string,
  amount: number,
  paymentLink: string
) {
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

      <p style="margin-top:20px; font-size:12px; color:#666;">
        Sent via KoniqTech
      </p>
    </div>
  `;

  return sendEmail(to, "Invoice Reminder", html);
}