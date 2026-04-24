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
    return []; // ❌ NO DEMO DATA
  }

  const cleanResults: LeadResult[] = [];

  for (const item of results) {
    const title = item.title?.toLowerCase() || "";

    // 🚫 FILTER (keep light for now as you want)
    if (
      title.includes("youtube") ||
      title.includes("reddit")
    ) {
      continue;
    }

    cleanResults.push(item);
  }

  return cleanResults;
}