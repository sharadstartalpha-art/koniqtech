export function scoreLead(lead: any) {
  let score = 0;

  if (lead.email.includes("ceo")) score += 40;
  if (lead.company?.includes("Tech")) score += 30;
  if (lead.email.includes("gmail")) score -= 10;

  return score;
}

export async function generateEmail(name?: string, company?: string) {
  return `
    <p>Hi ${name || "there"},</p>

    <p>I came across ${company || "your company"} and it looks really interesting.</p>

    <p>We help businesses generate high-quality leads automatically.</p>

    <p>Would love to connect 🚀</p>
  `;
}