import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export type SendEmailProps = {
  to: string;

  subject: string;

  html: string;

  text?: string;

  replyTo?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendEmailProps) {

  return await resend.emails.send({
    from:
      process.env.EMAIL_FROM ||
      "KoniqTech <info@koniqtech.com>",

    to,

    subject,

    html,

    text,

    replyTo,
  });
}