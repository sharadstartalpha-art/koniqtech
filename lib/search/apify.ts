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

    return data.map((item: any) => ({
      name: item.title,
      profileUrl: item.url,
      snippet: item.description,
    }));
  } catch (err) {
    console.error("❌ Apify error:", err);
    return [];
  }
}