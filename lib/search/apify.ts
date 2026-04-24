export async function apifySearch(query: string) {
  try {
    const TOKEN = process.env.APIFY_API_TOKEN;

    if (!TOKEN) {
      console.error("❌ Missing APIFY_API_TOKEN");
      return [];
    }

    const ACTOR = "apify~google-search-scraper";

    const res = await fetch(
      `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?token=${TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queries: query, // ✅ FIX: STRING (NOT ARRAY)
          maxPagesPerQuery: 2,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok || data?.error) {
      console.error("❌ APIFY RAW:", data);
      return [];
    }

    if (!Array.isArray(data)) {
      console.error("❌ Apify not array:", data);
      return [];
    }

    return data.map((item: any) => {
      const url = item.url || "";

      let company = "";
      try {
        const domain = new URL(url).hostname.replace("www.", "");
        company = domain.split(".")[0];
      } catch {}

      return {
        name: item.title || undefined,
        profileUrl: url,
        website: url,
        title: item.title || "",
        snippet: item.description || "",
        company,
      };
    });
  } catch (err) {
    console.error("❌ Apify failed:", err);
    return [];
  }
}