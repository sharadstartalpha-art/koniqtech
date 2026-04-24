import { apifySearch } from "./apify";

export type LeadResult = {
  name?: string;
  profileUrl?: string;
  email?: string;
  company?: string;
  location?: string;
  website?: string;
  title?: string;
  snippet?: string;
};

export async function searchLeads(query: string): Promise<LeadResult[]> {
  const results = await apifySearch(query);

  if (!results.length) {
    console.log("⚠️ No results from Apify");
    return [];
  }

  const cleanResults: LeadResult[] = [];

  for (const item of results) {
    const title = item.title?.toLowerCase() || "";

    // 🚫 LIGHT FILTER ONLY (keep results flowing)
    if (
      title.includes("youtube") ||
      title.includes("reddit")
    ) {
      continue;
    }

    cleanResults.push({
      ...item,
      name: item.name || item.title || "N/A", // ✅ FIX UNKNOWN
    });
  }

  return cleanResults;
}