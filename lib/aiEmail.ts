export type EmailType =
  | "friendly"
  | "firm"
  | "final";

type GenerateEmailOptions = {
  amount: number;

  type: EmailType;

  clientName?: string;

  paymentLink?: string;

  senderName?: string;

  companyName?: string;

  senderEmail?: string;

  senderPhone?: string;
};

export function generateEmail({
  amount,
  type,
  clientName,
  paymentLink,
  senderName,
  companyName,
  senderEmail,
  senderPhone,
}: GenerateEmailOptions) {

  const customer =
    clientName || "Customer";

  const company =
    companyName ||
    "KoniqTech";

  const sender =
    senderName || company;

  const hasLink =
    !!paymentLink;

  /* =====================================
     PAYMENT BUTTON
  ===================================== */

  const paymentButton = hasLink
    ? `
      <div style="margin-top:30px;margin-bottom:30px;">
        <a
          href="${paymentLink}"
          style="
            background:#111827;
            color:#ffffff;
            text-decoration:none;
            padding:14px 24px;
            border-radius:10px;
            display:inline-block;
            font-weight:600;
            font-size:14px;
          "
        >
          Pay Invoice
        </a>
      </div>
    `
    : "";

  /* =====================================
     FOOTER
  ===================================== */

  const footerHtml = `
    <hr style="margin-top:40px;margin-bottom:20px;border:none;border-top:1px solid #e5e7eb;" />

    <div style="font-size:13px;color:#6b7280;line-height:24px;">
      <strong>${sender}</strong><br/>
      ${company}<br/>

      ${
        senderEmail
          ? `Email: ${senderEmail}<br/>`
          : ""
      }

      ${
        senderPhone
          ? `Phone: ${senderPhone}<br/>`
          : ""
      }

      Sent via KoniqTech Recovery Suite
    </div>
  `;

  const footerText = `

--------------------------------

${sender}
${company}

${
  senderEmail
    ? `Email: ${senderEmail}`
    : ""
}

${
  senderPhone
    ? `Phone: ${senderPhone}`
    : ""
}

Sent via KoniqTech Recovery Suite
`;

  /* =====================================
     CONTENT
  ===================================== */

  let title = "";

  let bodyHtml = "";

  let bodyText = "";

  /* =====================================
     FRIENDLY
  ===================================== */

  if (type === "friendly") {

    title =
      "Friendly Reminder";

    bodyHtml = `
      <p style="margin:0 0 20px 0;">
        Hi ${customer},
      </p>

      <p style="margin:0 0 20px 0;">
        Just a friendly reminder that your invoice is still unpaid.
      </p>

      <div
        style="
          background:#f9fafb;
          border:1px solid #e5e7eb;
          border-radius:12px;
          padding:20px;
          margin-top:25px;
          margin-bottom:25px;
        "
      >
        <div
          style="
            font-size:13px;
            color:#6b7280;
            margin-bottom:8px;
          "
        >
          Amount Due
        </div>

        <div
          style="
            font-size:28px;
            font-weight:700;
            color:#111827;
          "
        >
          $${amount}
        </div>
      </div>

      <p style="margin:0 0 20px 0;">
        Please make payment at your earliest convenience.
      </p>

      ${paymentButton}

      <p style="margin-top:25px;">
        Thanks!
      </p>
    `;

    bodyText = `
Hi ${customer},

Just a friendly reminder that your invoice is still unpaid.

Amount Due: $${amount}

Please make payment at your earliest convenience.

${
  hasLink
    ? `Pay here: ${paymentLink}`
    : ""
}

Thanks!
    `;
  }

  /* =====================================
     FIRM
  ===================================== */

  if (type === "firm") {

    title =
      "Payment Reminder";

    bodyHtml = `
      <p style="margin:0 0 20px 0;">
        Hi ${customer},
      </p>

      <p style="margin:0 0 20px 0;">
        Your invoice payment is now overdue.
      </p>

      <div
        style="
          background:#fff7ed;
          border:1px solid #fdba74;
          border-radius:12px;
          padding:20px;
          margin-top:25px;
          margin-bottom:25px;
        "
      >
        <div
          style="
            font-size:13px;
            color:#9a3412;
            margin-bottom:8px;
          "
        >
          Outstanding Balance
        </div>

        <div
          style="
            font-size:28px;
            font-weight:700;
            color:#9a3412;
          "
        >
          $${amount}
        </div>
      </div>

      <p style="margin:0 0 20px 0;">
        Kindly arrange payment immediately to avoid service interruption.
      </p>

      ${paymentButton}

      <p style="margin-top:25px;">
        Regards
      </p>
    `;

    bodyText = `
Hi ${customer},

Your invoice payment is now overdue.

Outstanding Balance: $${amount}

Please arrange payment immediately.

${
  hasLink
    ? `Pay here: ${paymentLink}`
    : ""
}

Regards
    `;
  }

  /* =====================================
     FINAL
  ===================================== */

  if (type === "final") {

    title =
      "Final Payment Notice";

    bodyHtml = `
      <p style="margin:0 0 20px 0;">
        Hi ${customer},
      </p>

      <p style="margin:0 0 20px 0;">
        This is your final notice regarding the unpaid invoice below.
      </p>

      <div
        style="
          background:#fef2f2;
          border:1px solid #fca5a5;
          border-radius:12px;
          padding:20px;
          margin-top:25px;
          margin-bottom:25px;
        "
      >
        <div
          style="
            font-size:13px;
            color:#991b1b;
            margin-bottom:8px;
          "
        >
          Total Due
        </div>

        <div
          style="
            font-size:30px;
            font-weight:700;
            color:#991b1b;
          "
        >
          $${amount}
        </div>
      </div>

      <p style="margin:0 0 20px 0;">
        Immediate payment is required to prevent further escalation.
      </p>

      ${paymentButton}

      <p style="margin-top:25px;">
        Thank you
      </p>
    `;

    bodyText = `
Hi ${customer},

This is your final notice regarding your unpaid invoice.

Total Due: $${amount}

Immediate payment is required.

${
  hasLink
    ? `Pay here: ${paymentLink}`
    : ""
}

Thank you
    `;
  }

  /* =====================================
     FINAL HTML
  ===================================== */

  const html = `
    <div
      style="
        max-width:600px;
        margin:0 auto;
        padding:40px 24px;
        font-family:Arial,sans-serif;
        color:#111827;
        line-height:1.7;
        background:#ffffff;
      "
    >

      <h1
        style="
          font-size:28px;
          margin-bottom:30px;
          color:#111827;
        "
      >
        ${title}
      </h1>

      ${bodyHtml}

      ${footerHtml}

    </div>
  `;

  const text = `
${bodyText}

${footerText}
  `;

  return {
    subject: title,

    html,

    text,
  };
}