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
          queries: `site:linkedin.com/in ${query}`, // ✅ STRING
          maxPagesPerQuery: 2,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok || data?.error) {
      console.error("❌ APIFY ERROR:", data);
      return [];
    }

    if (!Array.isArray(data)) {
      console.error("❌ Invalid response:", data);
      return [];
    }

    return data.map((item: any) => {
      const title = item.title || "";
      const url = item.url || "";

      // 🔥 SMART PARSING
      let name = "";
      let company = "";

      if (title.includes(" - ")) {
        const parts = title.split(" - ");

        name = parts[0]; // John Doe
        company = parts[1]?.split("|")[0] || ""; // CEO at XYZ
      }

      return {
        name: name || undefined,
        profileUrl: url || undefined,
        website: url || undefined,
        title,
        snippet: item.description || "",
        company: company || undefined,
      };
    });
  } catch (err) {
    console.error("❌ Apify failed:", err);
    return [];
  }
}