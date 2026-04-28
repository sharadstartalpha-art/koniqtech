export async function generateEmail(
  amount: number,
  type: "friendly" | "firm" | "final",
  paymentLink?: string
) {
  if (type === "friendly") {
    return `
      Hi there,<br/><br/>
      Just a friendly reminder that your invoice of $${amount} is due.<br/><br/>
      Pay here:<br/>
      <a href="${paymentLink}">${paymentLink}</a><br/><br/>
      Thanks!
    `;
  }

  if (type === "firm") {
    return `
      Hello,<br/><br/>
      Your invoice of $${amount} is overdue.<br/><br/>
      Pay here:<br/>
      <a href="${paymentLink}">${paymentLink}</a><br/><br/>
      Regards
    `;
  }

  if (type === "final") {
    return `
      Final Notice,<br/><br/>
      Your invoice of $${amount} is seriously overdue.<br/><br/>
      Immediate payment required:<br/>
      <a href="${paymentLink}">${paymentLink}</a>
    `;
  }

  return "";
}