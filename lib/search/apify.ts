export async function apifySearch(query: string) {
  const res = await fetch(
    `https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_TOKEN}`,
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

  console.log("APIFY RAW:", data);

  return data.map((item: any) => ({
    name: item.title,
    profileUrl: item.url,
    snippet: item.description,
  }));
}