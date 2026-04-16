import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ GENERIC EMAIL
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return await resend.emails.send({
    from: "KoniqTech <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
}

// ✅ COLD EMAIL
export async function sendColdEmail(to: string, name?: string) {
  return await resend.emails.send({
    from: "KoniqTech <onboarding@resend.dev>",
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