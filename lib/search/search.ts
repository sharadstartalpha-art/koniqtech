import { apifySearch } from "./apify";

export type LeadResult = {
  name?: string;
  profileUrl?: string;
  email?: string;
  company?: string;
  location?: string;
  website?: string;
  title?: string;
};

// 🔥 Extract name from title
function extractName(title?: string): string | undefined {
  if (!title) return undefined;

  // "John Doe - CEO at X | LinkedIn"
  const clean = title.split("|")[0];

  const parts = clean.split("-")[0].trim();

  // basic validation
  if (parts.length < 3) return undefined;
  if (parts.toLowerCase().includes("top")) return undefined;

  return parts;
}

// 🔥 Extract company
function extractCompany(title?: string): string | undefined {
  if (!title) return undefined;

  const lower = title.toLowerCase();

  if (lower.includes(" at ")) {
    const afterAt = title.split(" at ")[1];
    if (!afterAt) return undefined;

    return afterAt.split("|")[0].trim();
  }

  return undefined;
}

// 🚫 Filter junk
function isValidLead(title?: string): boolean {
  if (!title) return false;

  const t = title.toLowerCase();

  return !(
    t.includes("top") ||
    t.includes("list") ||
    t.includes("youtube") ||
    t.includes("reddit") ||
    t.includes("news") ||
    t.includes("directory")
  );
}

export async function searchLeads(query: string): Promise<LeadResult[]> {
  const results = await apifySearch(query);

  if (!results.length) {
    console.log("⚠️ No results");
    return [];
  }

  const clean: LeadResult[] = [];

  for (const item of results) {
    if (!isValidLead(item.title)) continue;

    const name = extractName(item.title);
    const company = extractCompany(item.title);

    // 🚫 skip useless rows
    if (!name && !company) continue;

    clean.push({
      ...item,
      name: name || "Unknown",
      company: company || undefined,
    });
  }

  return clean;
}