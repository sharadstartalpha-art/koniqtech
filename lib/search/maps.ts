export async function googleMapsSearch(query: string) {
  try {
    const TOKEN = process.env.APIFY_API_TOKEN;

    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~google-maps-scraper/run-sync-get-dataset-items?token=${TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchStringsArray: [query],
          maxCrawledPlacesPerSearch: 20,
        }),
      }
    );

    const data = await res.json();

    if (!Array.isArray(data)) return [];

    return data.map((item: any) => ({
      name: item.title,
      company: item.title,
      website: item.website,
      phone: item.phone,
      location: item.address,
      source: "maps",
    }));
  } catch {
    return [];
  }
}