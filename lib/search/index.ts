// lib/search/index.ts

import { googleSearch } from "./google";
import { apifySearch } from "./apify";

export async function searchLeads(query: string) {
  console.log("🔍 Searching:", query);

  // 1️⃣ Google first
  const googleResults = await googleSearch(query);

  if (googleResults.length > 0) {
    console.log("✅ Google results:", googleResults.length);
    return googleResults;
  }

  // 2️⃣ fallback Apify
  console.log("⚠️ Falling back to Apify...");

  const apifyResults = await apifySearch(query);

  console.log("✅ Apify results:", apifyResults.length);

  return apifyResults;
}