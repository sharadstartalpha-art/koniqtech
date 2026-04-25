import { multiSourceSearch } from "./multiSource";

export type LeadResult = {
  name?: string;
  profileUrl?: string;
  email?: string;
  company?: string;
  location?: string;
  website?: string;
  title?: string;
  fullName?: string;
  username?: string;
  source?: string;
};

// 🔥 Extract company from domain
function extractCompanyFromDomain(website?: string): string | undefined {
  if (!website) return undefined;

  try {
    const domain = new URL(website).hostname;
    const clean = domain.replace("www.", "").split(".");
    return clean[0] || undefined;
  } catch {
    return undefined;
  }
}

// 🔥 CLEAN NAME EXTRACTOR (VERY IMPORTANT)
function extractName(item: LeadResult): string {
  if (item.name && item.name !== "Unknown") return item.name;

  if (item.fullName) return item.fullName;

  if (item.title) {
    // remove junk like "John Doe - CEO | Company"
    const clean = item.title.split("|")[0];
    const name = clean.split("-")[0].trim();

    if (name.length > 2 && !name.toLowerCase().includes("linkedin")) {
      return name;
    }
  }

  if (item.username) return item.username;

  if (item.company) return item.company;

  return "Unknown";
}

// 🔥 FILTER BAD RESULTS
function isValidLead(item: LeadResult): boolean {
  const t = item.title?.toLowerCase() || "";

  if (
    t.includes("top") ||
    t.includes("list") ||
    t.includes("youtube") ||
    t.includes("reddit") ||
    t.includes("news")
  ) {
    return false;
  }

  // ❌ skip useless entries
  if (!item.profileUrl && !item.website) return false;

  return true;
}

// 🚀 MAIN SEARCH FUNCTION (MULTI-SOURCE)
export async function searchLeads(query: string): Promise<LeadResult[]> {
  const results = await multiSourceSearch(query);

  if (!results?.length) {
    console.log("⚠️ No results");
    return [];
  }

  const cleaned = results
    .filter(isValidLead)
    .map((item: LeadResult) => {
      const company =
        item.company || extractCompanyFromDomain(item.website);

      return {
        ...item,

        // ✅ name always filled
        name: extractName(item),

        // ✅ company always string or undefined (NO null)
        company: company || undefined,

        // ✅ normalize fields
        location: item.location || undefined,
        email: item.email || undefined,
      };
    });

  // 🔥 DEDUP (IMPORTANT)
  const uniqueMap = new Map<string, LeadResult>();

  for (const lead of cleaned) {
    const key =
      lead.profileUrl ||
      lead.email ||
      `${lead.name}-${lead.company}`;

    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, lead);
    }
  }

  return Array.from(uniqueMap.values());
}