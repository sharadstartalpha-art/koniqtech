export type EmailType = "friendly" | "firm" | "final";

export function generateEmail(
  amount: number,
  type: EmailType,
  paymentLink?: string
) {
  const hasLink = !!paymentLink;

  /* =========================
     LINK BLOCK (CONDITIONAL)
  ========================= */
  const linkHtml = hasLink
    ? `<br/>Pay here:<br/><a href="${paymentLink}">${paymentLink}</a><br/><br/>`
    : "";

  const linkText = hasLink
    ? `\nPay here:\n${paymentLink}\n`
    : "";

  let html = "";
  let text = "";

  /* =========================
     FRIENDLY
  ========================= */
  if (type === "friendly") {
    html = `
Hi there,<br/><br/>
Just a friendly reminder that your invoice of $${amount} is due.<br/><br/>
${linkHtml}
Thanks!
    `;

    text = `
Hi there,

Just a friendly reminder that your invoice of $${amount} is due.
${linkText}
Thanks!
    `;
  }

  /* =========================
     FIRM
  ========================= */
  if (type === "firm") {
    html = `
Hello,<br/><br/>
Your invoice of $${amount} is overdue.<br/><br/>
${linkHtml}
Regards
    `;

    text = `
Hello,

Your invoice of $${amount} is overdue.
${linkText}
Regards
    `;
  }

  /* =========================
     FINAL
  ========================= */
  if (type === "final") {
    html = `
Final Notice,<br/><br/>
Your invoice of $${amount} is seriously overdue.<br/><br/>
${linkHtml}
Immediate payment required.
    `;

    text = `
Final Notice,

Your invoice of $${amount} is seriously overdue.
${linkText}
Immediate payment required.
    `;
  }

  return { html, text };
}