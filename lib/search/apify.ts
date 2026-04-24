export async function apifySearch(query: string) {
  try {
    const TOKEN = process.env.APIFY_API_TOKEN;

    if (!TOKEN) {
      console.error("❌ Missing APIFY_API_TOKEN");
      return [];
    }

    const res = await fetch(
      `https://api.apify.com/v2/acts/apify/google-search-scraper/run-sync-get-dataset-items?token=${TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // ✅ FIX: MUST BE STRING NOT ARRAY
          queries: query,

          maxPagesPerQuery: 2,
        }),
      }
    );

    const data = await res.json();

    if (!data || data.error) {
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
    }));
  } catch (err) {
    console.error("❌ Apify failed:", err);
    return [];
  }
}