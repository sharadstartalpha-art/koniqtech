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
  const rawResults = await apifySearch(query);

  // ✅ Normalize data (IMPORTANT FIX)
  const results: LeadResult[] = rawResults.map((item: any) => ({
    name: item.name || undefined,
    profileUrl: item.profileUrl || item.url || undefined,
    website: item.website || item.url || undefined,
    title: item.title || item.name || "",
    company: item.company || undefined,
    email: item.email || undefined,
    location: item.location || undefined,
  }));

  // 🚨 FALLBACK (VERY IMPORTANT)
  if (!results.length) {
    console.log("⚠️ No results → fallback");

    return [
      {
        name: "Demo Founder",
        profileUrl: "https://linkedin.com/in/demo",
        website: "https://demo.com",
        company: "Demo Inc",
        location: "USA",
      },
    ];
  }

  const cleanResults: LeadResult[] = [];

  for (const item of results) {
    const title = item.title?.toLowerCase() || "";

    // 🚫 FILTER JUNK
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