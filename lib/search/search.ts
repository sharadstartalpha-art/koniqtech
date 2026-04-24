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

// 🔥 NAME EXTRACTOR (clean + safe)
function extractName(title?: string): string {
  if (!title) return "Unknown";

  // Example:
  // "John Doe - CEO at XYZ | LinkedIn"
  const name = title.split("-")[0].trim();

  if (name.length < 3) return "Unknown";

  return name;
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
      name: extractName(item.title), // ✅ fixed name extraction
    }));
}