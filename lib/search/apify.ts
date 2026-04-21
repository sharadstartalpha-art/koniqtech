// lib/search/apify.ts

export async function apifySearch(query: string) {
  try {
    const APIFY_TOKEN = process.env.APIFY_TOKEN!;

    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queries: [query],
          maxPagesPerQuery: 2,
        }),
      }
    );

    const data = await res.json();

    // 🔥 FIX: ensure array
    const items = Array.isArray(data)
      ? data
      : data?.items || data?.data || [];

    if (!Array.isArray(items)) {
      console.error("❌ Invalid Apify response:", data);
      return [];
    }

    return items.map((item: any) => ({
      name: item.title || "Unknown",
      profileUrl: item.url || null,
      snippet: item.description || "",
    }));

  } catch (err) {
    console.error("❌ Apify error:", err);
    return [];
  }
}