export async function apifySearch(query: string) {
  try {
    const TOKEN = process.env.APIFY_API_TOKEN;

    if (!TOKEN) {
      console.error("❌ Missing APIFY_API_TOKEN");
      return [];
    }

    // 🔥 REAL LINKEDIN ACTOR
    const ACTOR = "apify/linkedin-profile-scraper";

    const res = await fetch(
      `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?token=${TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search: query, // 🔥 THIS IS DIFFERENT FROM GOOGLE
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
      company: item.companyName || undefined,
      location: item.location || undefined,
      title: item.headline || "",
      website: item.companyUrl || undefined,
    }));
  } catch (err) {
    console.error("❌ LinkedIn scrape failed:", err);
    return [];
  }
}