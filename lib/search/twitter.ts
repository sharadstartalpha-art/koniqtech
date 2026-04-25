export async function twitterSearch(query: string) {
  try {
    const TOKEN = process.env.APIFY_API_TOKEN;

    const res = await fetch(
      `https://api.apify.com/v2/acts/apidojo~twitter-scraper/run-sync-get-dataset-items?token=${TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchTerms: [query],
          maxItems: 20,
        }),
      }
    );

    const data = await res.json();

    if (!Array.isArray(data)) return [];

    return data.map((item: any) => ({
      name: item.user?.name,
      profileUrl: `https://x.com/${item.user?.screen_name}`,
      title: item.text,
      source: "twitter",
    }));
  } catch {
    return [];
  }
}