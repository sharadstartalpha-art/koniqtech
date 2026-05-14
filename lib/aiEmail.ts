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

  /* =====================================
     VARIABLES
  ===================================== */

  const customer =
    clientName || "Customer";

  const sender =
    senderName || "KoniqTech";

  const company =
    companyName || "KoniqTech";

  const email =
    senderEmail || "info@koniqtech.com";

  const phone =
    senderPhone || "";

  /* =====================================
     SUBJECT
  ===================================== */

  let subject =
    "Payment Reminder";

  if (type === "friendly") {
    subject =
      "Friendly Reminder";
  }

  if (type === "firm") {
    subject =
      "Payment Reminder";
  }

  if (type === "final") {
    subject =
      "Final Payment Notice";
  }

  /* =====================================
     MESSAGE
  ===================================== */

  let intro =
    "Just a friendly reminder that your invoice is still unpaid.";

  let closing =
    "Please make payment at your earliest convenience.";

  if (type === "firm") {

    intro =
      "Your invoice payment is now overdue.";

    closing =
      "Kindly arrange payment immediately.";
  }

  if (type === "final") {

    intro =
      "This is your final notice regarding the unpaid invoice.";

    closing =
      "Immediate payment is required to avoid escalation.";
  }

  /* =====================================
     PAYMENT LINK
  ===================================== */

  const paymentHtml =
    paymentLink
      ? `
        <p>
          <a
            href="${paymentLink}"
            style="
              display:inline-block;
              margin-top:10px;
              background:#111827;
              color:#ffffff;
              text-decoration:none;
              padding:12px 20px;
              border-radius:8px;
              font-weight:600;
            "
          >
            Pay Invoice
          </a>
        </p>
      `
      : "";

  const paymentText =
    paymentLink
      ? `\nPay here: ${paymentLink}\n`
      : "";

  /* =====================================
     HTML EMAIL
  ===================================== */

  const html = `
<div style="font-family:sans-serif;color:#111827;line-height:1.7;max-width:600px;margin:auto;">

  <p>
    Hi ${customer},
  </p>

  <p>
    ${intro}
  </p>

  <p>
    <strong>
      Amount Due:
    </strong>
    ₹${amount}
  </p>

  <p>
    ${closing}
  </p>

  ${paymentHtml}

  <br />

  <p>
    Regards,
  </p>

  <p>
    <strong>
      ${sender}
    </strong><br />

    ${company}<br />

    ${email}<br />

    ${phone}
  </p>

</div>
  `;

  /* =====================================
     TEXT EMAIL
  ===================================== */

  const text = `
Hi ${customer},

${intro}

Amount Due: ₹${amount}

${closing}

${paymentText}

Regards,

${sender}
${company}
${email}
${phone}
  `;

  /* =====================================
     RETURN
  ===================================== */

  return {
    subject,

    html,

    text,
  };
}