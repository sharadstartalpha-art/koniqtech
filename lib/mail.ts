import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    return await resend.emails.send({
      from: "KoniqTech <info@koniqtech.com>",
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("❌ Email send failed:", err);
    throw err;
  }
}

export async function sendColdEmail(to: string, name?: string) {
  return await resend.emails.send({
    from: "KoniqTech <info@koniqtech.com>",
    to,
    subject: "Quick question 👀",
    html: `
      <p>Hi ${name || "there"},</p>
      <p>I came across your profile and wanted to connect.</p>
      <p>We help companies generate leads automatically.</p>
      <p>Interested?</p>
    `,
  });
}