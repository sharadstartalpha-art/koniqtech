export async function apifySearch(query: string) {
  try {
    const TOKEN = process.env.APIFY_API_TOKEN;

    if (!TOKEN) {
      console.error("❌ Missing APIFY_API_TOKEN");
      return [];
    }

    // ✅ REAL WORKING LINKEDIN ACTOR
    const ACTOR = "apify/linkedin-people-search-scraper";

    const res = await fetch(
      `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?token=${TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: query,        // ✅ IMPORTANT FIELD (NOT "search")
          maxItems: 20,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok || data?.error) {
      console.error("❌ APIFY LINKEDIN ERROR:", data);
      return [];
    }

    if (!Array.isArray(data)) {
      console.error("❌ LinkedIn data not array:", data);
      return [];
    }

    return data.map((item: any) => ({
      name: item.fullName || undefined,
      profileUrl: item.profileUrl || undefined,
      company: item.currentCompanyName || undefined,
      location: item.location || undefined,
      title: item.headline || "",
      website: item.currentCompanyUrl || undefined,
    }));
  } catch (err) {
    console.error("❌ LinkedIn scrape failed:", err);
    return [];
  }
}