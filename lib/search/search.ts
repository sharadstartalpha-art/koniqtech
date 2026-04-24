import { apifySearch } from "./apify";

type LeadResult = {
  name?: string;
  profileUrl?: string;
  email?: string;
  company?: string;
  location?: string;
  website?: string;
  title?: string;
};

export async function searchLeads(query: string): Promise<LeadResult[]> {
  // 🔍 USE YOUR REAL SEARCH (Apify / Google etc.)
  const results: LeadResult[] = await apifySearch(query);

  const cleanResults: LeadResult[] = [];

  for (const item of results) {
    const title = item.title?.toLowerCase() || "";

    // 🚫 FILTER JUNK RESULTS
    if (
      title.includes("news") ||
      title.includes("accused") ||
      title.includes("youtube") ||
      title.includes("reddit")
    ) {
      continue;
    }

    cleanResults.push(item);
  }

  return cleanResults;
}