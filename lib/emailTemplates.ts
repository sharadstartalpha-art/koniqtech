export function getEmail(type: string, amount: number, link: string) {
  if (type === "friendly") {
    return `
    Hey, just a quick reminder 🙂

    Invoice of $${amount} is due.

    Pay here: ${link}
    `;
  }

  if (type === "firm") {
    return `
    Hi — following up again.

    Invoice ($${amount}) is still pending.

    Please clear it here:
    ${link}
    `;
  }

  if (type === "final") {
    return `
    Final notice.

    Invoice ($${amount}) remains unpaid.

    Immediate action required:
    ${link}
    `;
  }
}