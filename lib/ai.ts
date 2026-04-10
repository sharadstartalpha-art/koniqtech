export function scoreLead(lead: any) {
  let score = 0;

  if (lead.email.includes("ceo")) score += 40;
  if (lead.company?.includes("Tech")) score += 30;
  if (lead.email.includes("gmail")) score -= 10;

  return score;
}