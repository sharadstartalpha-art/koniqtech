// lib/search/index.ts

import { googleSearch } from "./google";
import { apifySearch } from "./apify";

export async function searchLeads(query: string) {
  console.log("🔍 Searching:", query);

  let results = [];

  // 1️⃣ Try Google
  results = await googleSearch(query);

  if (results.length > 0) {
    console.log("✅ Google results:", results.length);
    return results;
  }

  // 2️⃣ Fallback Apify
  console.log("⚠️ Falling back to Apify...");
  results = await apifySearch(query);

  console.log("✅ Apify results:", results.length);

  return results;
}