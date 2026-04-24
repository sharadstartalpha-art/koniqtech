import { apifySearch } from "./apify";

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
};

// 🔥 NAME EXTRACTOR (fallback-safe)
function extractName(item: LeadResult): string {
  return (
    item.name ||
    item.fullName ||
    (item.title ? item.title.split("-")[0].trim() : undefined) ||
    item.username ||
    "Unknown"
  );
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

      // ❌ FILTER JUNK RESULTS
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
      name: extractName(item), // ✅ robust name mapping
    }));
}