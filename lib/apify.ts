export async function apifySearch(query: string) {
  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_API_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queries: [query],
          maxPagesPerQuery: 1,
        }),
      }
    );

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("❌ APIFY RAW:", data);
      return [];
    }

    return data.map((item: any) => ({
      name: item.title || "",
      website: item.url || "",
      snippet: item.description || "",
      source: "apify",
    }));
  } catch (err) {
    console.error("❌ Apify failed:", err);
    return [];
  }
}