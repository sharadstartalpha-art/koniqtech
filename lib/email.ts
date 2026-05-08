import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

/* =========================
   DEFAULT PLATFORM EMAIL
========================= */

const FROM_EMAIL =
  "KoniqTech <no-reply@koniqtech.com>";

/* =========================
   GENERIC EMAIL SENDER
========================= */

type SendEmailProps = {
  to: string;

  subject: string;

  html: string;

  text?: string;

  replyTo?: string;

  fromName?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
  fromName,
}: SendEmailProps) {
  try {
    console.log(
      "📤 Sending email →",
      to
    );

    const { error, data } =
      await resend.emails.send({
        from: fromName
          ? `${fromName} <no-reply@koniqtech.com>`
          : FROM_EMAIL,

        to,

        subject,

        html,

        text,

        replyTo,
      });

    if (error) {
      console.error(
        "❌ RESEND ERROR:",
        error
      );

      throw new Error(
        error.message
      );
    }

    console.log(
      "✅ Email sent:",
      data?.id
    );

    return data;

  } catch (err: any) {
    console.error(
      "❌ EMAIL FAILED:",
      err.message
    );

    throw err;
  }
}

/* =========================
   MAGIC LINK EMAIL
========================= */

export async function sendMagicLink(
  email: string,
  link: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Login to KoniqTech</h2>

      <p>
        Click the button below to securely sign in:
      </p>

      <a
        href="${link}"
        style="
          display:inline-block;
          margin-top:12px;
          padding:10px 18px;
          background:#000;
          color:#fff;
          text-decoration:none;
          border-radius:6px;
        "
      >
        Login
      </a>

      <p style="
        margin-top:16px;
        font-size:12px;
        color:#666;
      ">
        This link will expire in 10 minutes.
      </p>
    </div>
  `;

  const text = `
Login to KoniqTech

Click the link below to sign in:

${link}

This link expires in 10 minutes.
  `;

  return sendEmail({
    to: email,

    subject: "Your login link",

    html,

    text,
  });
}

/* =========================
   INVOICE REMINDER EMAIL
========================= */

export async function sendReminderEmail({
  to,
  amount,
  paymentLink,
  replyTo,
  senderName,
}: {
  to: string;

  amount: number;

  paymentLink: string;

  replyTo?: string;

  senderName?: string;
}) {
  const html = `
    <div style="
      font-family: Arial, sans-serif;
      max-width: 520px;
      margin: 0 auto;
    ">

      <h2>
        Payment Reminder
      </h2>

      <p>
        This is a reminder that your invoice is still unpaid.
      </p>

      <div style="
        margin: 24px 0;
        padding: 20px;
        background: #f7f7f7;
        border-radius: 10px;
      ">

        <p style="
          margin:0;
          color:#666;
          font-size:14px;
        ">
          Amount Due
        </p>

        <h1 style="
          margin:8px 0 0;
          font-size:32px;
        ">
          $${amount}
        </h1>

      </div>

      <a
        href="${paymentLink}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#000;
          color:#fff;
          text-decoration:none;
          border-radius:8px;
          font-weight:600;
        "
      >
        Pay Invoice
      </a>

      <p style="
        margin-top:30px;
        font-size:12px;
        color:#666;
      ">
        Sent via KoniqTech
      </p>

    </div>
  `;

  const text = `
Payment Reminder

Your invoice is still unpaid.

Amount Due: $${amount}

Pay here:
${paymentLink}

Sent via KoniqTech
  `;

  return sendEmail({
    to,

    subject: "Invoice Reminder",

    html,

    text,

    replyTo,

    fromName:
      senderName || "KoniqTech",
  });
}