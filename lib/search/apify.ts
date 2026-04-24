export async function apifySearch(query: string) {
  try {
    const TOKEN = process.env.APIFY_API_TOKEN;

    if (!TOKEN) {
      console.error("❌ Missing APIFY_API_TOKEN");
      return [];
    }

    // ✅ CORRECT ACTOR (WORKING)
    const ACTOR = "apify~google-search-scraper";

    const res = await fetch(
      `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?token=${TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queries: query, // ✅ STRING (correct)
          maxPagesPerQuery: 2,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok || data?.error) {
      console.error("❌ APIFY RAW:", data);
      return [];
    }

    if (!Array.isArray(data)) {
      console.error("❌ Apify not array:", data);
      return [];
    }

    return data.map((item: any) => ({
      name: item.title || undefined,
      profileUrl: item.url || undefined,
      website: item.url || undefined,
      title: item.title || "",
      snippet: item.description || "",
    }));
  } catch (err) {
    console.error("❌ Apify failed:", err);
    return [];
  }
}