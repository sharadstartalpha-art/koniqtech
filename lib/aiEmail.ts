export type EmailType = "friendly" | "firm" | "final";

export function generateEmail(
  amount: number,
  type: EmailType,
  paymentLink?: string
) {
  const safeLink = paymentLink || "";

  /* =========================
     🔗 LINK BLOCK (SAFE)
  ========================= */
  const linkHtml = safeLink
    ? `<a href="${safeLink}">${safeLink}</a>`
    : `<span style="color:#888">Payment link will be added</span>`;

  const linkText = safeLink
    ? safeLink
    : "Payment link will be added";

  /* =========================
     🧠 TEMPLATE
  ========================= */
  let html = "";
  let text = "";

  if (type === "friendly") {
    html = `
      Hi there,<br/><br/>
      Just a friendly reminder that your invoice of $${amount} is due.<br/><br/>
      Pay here:<br/>
      ${linkHtml}<br/><br/>
      Thanks!
    `;

    text = `
Hi there,

Just a friendly reminder that your invoice of $${amount} is due.

Pay here:
${linkText}

Thanks!
    `;
  }

  if (type === "firm") {
    html = `
      Hello,<br/><br/>
      Your invoice of $${amount} is overdue.<br/><br/>
      Pay here:<br/>
      ${linkHtml}<br/><br/>
      Regards
    `;

    text = `
Hello,

Your invoice of $${amount} is overdue.

Pay here:
${linkText}

Regards
    `;
  }

  if (type === "final") {
    html = `
      Final Notice,<br/><br/>
      Your invoice of $${amount} is seriously overdue.<br/><br/>
      Immediate payment required:<br/>
      ${linkHtml}
    `;

    text = `
Final Notice,

Your invoice of $${amount} is seriously overdue.

Immediate payment required:
${linkText}
    `;
  }

  return {
    html,
    text,
  };
}