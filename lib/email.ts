import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Send OTP Email
export async function sendOTP(email: string, otp: string) {
  return await resend.emails.send({
    from: "KoniqTech <onboarding@resend.dev>",
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
}

// ✅ Send Invoice Reminder Email
export async function sendReminderEmail(
  to: string,
  amount: number,
  paymentLink: string
) {
  return await resend.emails.send({
    from: "KoniqTech <onboarding@resend.dev>",
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
}