import { googleSearch } from "./google";
import { apifySearch } from "./apify";

export async function searchLeads(text: string) {
  const enhancedQuery = `${text} founder OR CEO site:linkedin.com/in`;

  console.log("🔍 Searching Results:", enhancedQuery);

  let results = await googleSearch(enhancedQuery);

  if (!results.length) {
    console.log("⚠️ Falling back to Apify...");
    results = await apifySearch(enhancedQuery);
  }

  console.log("📊 Total results:", results.length);

  return results;
}