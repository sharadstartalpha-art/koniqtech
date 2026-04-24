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

export async function searchLeads(query: string): Promise<LeadResult[]> {
  const results = await apifySearch(query);

  if (!results.length) {
    console.log("⚠️ No results");
    return [];
  }

  return results.map((item) => ({
    ...item,
    name: item.name || item.title || "Unknown",
    company: item.company || undefined, // ✅ FIXED
  }));
}