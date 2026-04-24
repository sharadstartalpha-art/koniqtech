import { apifySearch } from "./apify";

export type LeadResult = {
  name?: string;
  profileUrl?: string;
  email?: string;
  company?: string; // ✅ stays string | undefined
  location?: string;
  website?: string;
  title?: string;
  fullName?: string;
  username?: string;
};

// 🔥 Extract company from domain
function extractCompanyFromDomain(website?: string): string | undefined {
  if (!website) return undefined;

  try {
    const domain = new URL(website).hostname;

    const parts = domain.replace("www.", "").split(".");
    return parts[0] || undefined;
  } catch {
    return undefined;
  }
}

// 🔥 CLEAN NAME EXTRACTOR
function extractName(item: LeadResult): string {
  if (item.name) return item.name;
  if (item.fullName) return item.fullName;

  if (item.title) {
    const clean = item.title.split("|")[0];
    const name = clean.split("-")[0].trim();

    if (name.length >= 3) return name;
  }

  if (item.username) return item.username;
  if (item.company) return item.company;

  return "Unknown";
}

// 🚀 MAIN SEARCH FUNCTION
export async function searchLeads(query: string): Promise<LeadResult[]> {
  const results = await apifySearch(query);

  if (!results?.length) {
    console.log("⚠️ No results");
    return [];
  }

  return results
    .filter((item) => {
      const t = item.title?.toLowerCase() || "";

      return (
        !t.includes("top") &&
        !t.includes("list") &&
        !t.includes("youtube") &&
        !t.includes("reddit") &&
        !t.includes("news")
      );
    })
    .map((item) => ({
      ...item,

      // ✅ NAME
      name: extractName(item),

      // ✅ COMPANY (NO NULL)
      company:
        item.company ||
        extractCompanyFromDomain(item.website),
    }));
}