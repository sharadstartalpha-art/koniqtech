export async function instagramSearch(query: string) {
  try {
    const TOKEN = process.env.APIFY_API_TOKEN;

    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search: query,
          resultsLimit: 20,
        }),
      }
    );

    const data = await res.json();

    if (!Array.isArray(data)) return [];

    return data.map((item: any) => ({
      name: item.username,
      profileUrl: `https://instagram.com/${item.username}`,
      source: "instagram",
    }));
  } catch {
    return [];
  }
}