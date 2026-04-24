export function scoreLead(lead: any): number {
  let score = 0;

  // ✅ identity
  if (lead.name && lead.name !== "Unknown") score += 10;

  // ✅ contactability (VERY IMPORTANT)
  if (lead.email) score += 30;
  if (lead.phone) score += 10;

  // ✅ company quality
  if (lead.company) score += 15;
  if (lead.website) score += 10;

  // ✅ role importance
  const title = (lead.title || "").toLowerCase();

  if (title.includes("ceo") || title.includes("founder")) score += 25;
  if (title.includes("cto")) score += 20;
  if (title.includes("manager")) score += 10;

  // ✅ location
  if (lead.location) score += 5;

  // ✅ hiring signal
  if (lead.isHiring) score += 10;

  // clamp
  if (score > 100) score = 100;

  return score;
}