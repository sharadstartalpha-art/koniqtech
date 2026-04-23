// lib/search/index.ts

import { apifySearch } from "./apify";

export async function searchLeads(query: string) {
  console.log("🔍 Searching:", query);

  let results: any[] = [];

  try {
    // 1️⃣ Try SERPER (Google replacement)
    const serperRes = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        num: 20,
      }),
    });

    const serperData = await serperRes.json();

    if (serperData?.organic?.length) {
      results = serperData.organic.map((item: any) => ({
        name: item.title || "",
        website: item.link || "",
        snippet: item.snippet || "",
        source: "serper",
      }));

      console.log("✅ Serper results:", results.length);
    }
  } catch (err) {
    console.error("❌ Serper failed:", err);
  }

  // 2️⃣ Fallback to Apify if empty
  if (!results.length) {
    console.log("⚠️ Falling back to Apify...");

    const apifyResults = await apifySearch(query);

    console.log("✅ Apify results:", apifyResults.length);

    results = apifyResults;
  }

  console.log("📊 Total results:", results.length);

  return results;
}