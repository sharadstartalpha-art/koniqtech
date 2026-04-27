import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Send OTP Email
export async function sendOTP(email: string, otp: string) {
  try {
    const res = await resend.emails.send({
      from: "onboarding@resend.dev", // ✅ safe default (Resend test domain)
      to: email,
      subject: "Your Login Code",
      html: `
        <div style="font-family: sans-serif;">
          <h2>Your OTP Code</h2>
          <p>Use the code below to login:</p>
          <h1>${otp}</h1>
          <p>This code will expire soon.</p>
        </div>
      `,
    });

    console.log("✅ OTP sent to:", email);
    return res;
  } catch (err) {
    console.error("❌ OTP EMAIL ERROR:", err);
    throw err;
  }
}

// ✅ Send Invoice Reminder Email
export async function sendReminderEmail(
  to: string,
  amount: number,
  paymentLink: string
) {
  try {
    const res = await resend.emails.send({
      from: "onboarding@resend.dev", // ✅ keep same sender for now
      to,
      subject: "Invoice Reminder",
      html: `
        <div style="font-family: sans-serif;">
          <h2>Payment Reminder</h2>
          <p>You have a pending invoice:</p>

          <p style="font-size: 20px; font-weight: bold;">
            $${amount}
          </p>

          <a 
            href="${paymentLink}" 
            style="
              display:inline-block;
              margin-top:10px;
              padding:10px 20px;
              background:black;
              color:white;
              text-decoration:none;
              border-radius:5px;
            "
          >
            Pay Now
          </a>

          <p style="margin-top:20px;">Thank you 🙏</p>
        </div>
      `,
    });

    console.log("📧 Reminder sent to:", to);
    return res;
  } catch (err) {
    console.error("❌ REMINDER EMAIL ERROR:", err);
    throw err;
  }
}