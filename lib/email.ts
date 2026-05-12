import nodemailer from "nodemailer";

type SendEmailProps = {
  to: string;

  subject: string;

  html: string;

  text?: string;

  replyTo?: string;
};

const transporter =
  nodemailer.createTransport({
    host:
      process.env.SMTP_HOST,

    port: Number(
      process.env.SMTP_PORT
    ),

    secure: false,

    auth: {
      user:
        process.env.SMTP_USER,

      pass:
        process.env.SMTP_PASS,
    },
  });

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendEmailProps) {

  return transporter.sendMail({
    from:
      process.env.SMTP_FROM,

    to,

    subject,

    html,

    text,

    replyTo,
  });
}