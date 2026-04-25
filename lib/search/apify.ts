import { fallbackSearch } from "./fallback";

export async function apifySearch(query: string) {
  try {
    const TOKEN = process.env.APIFY_API_TOKEN;

    if (!TOKEN) {
      console.log("⚠️ No APIFY token → fallback");
      return fallbackSearch(query);
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
          // ✅ ALWAYS ARRAY (stable)
          queries: [`site:linkedin.com/in ${query}`],
          maxPagesPerQuery: 1, // 🔥 reduce cost
        }),
      }
    );

    const data = await res.json();

    // ❌ fallback if error / no credits
    if (!res.ok || data?.error) {
      console.log("⚠️ Apify failed → fallback");
      return fallbackSearch(query);
    }

    if (!Array.isArray(data)) {
      console.log("⚠️ Invalid Apify response → fallback");
      return fallbackSearch(query);
    }

    return data.map((item: any) => {
      const title = item.title || "";
      const url = item.url || "";

      let name = "";
      let company = "";

      // 🔥 BETTER PARSING
      if (title.includes(" - ")) {
        const [left, right] = title.split(" - ");

        name = left?.trim();

        if (right) {
          company = right.split("|")[0]?.trim();
        }
      }

      return {
        name: name || undefined,
        profileUrl: url || undefined,
        website: url || undefined,
        title,
        snippet: item.description || "",
        company: company || undefined,
        source: "google",
      };
    });
  } catch (err) {
    console.log("⚠️ Apify crashed → fallback");
    return fallbackSearch(query);
  }
}