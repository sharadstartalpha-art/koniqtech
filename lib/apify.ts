export async function scrapeLinkedInApify({
  query,
  maxItems = 20,
}: {
  query: string;
  maxItems?: number;
}) {
  try {
    const token = process.env.APIFY_API_TOKEN;

    if (!token) {
      console.error("❌ Missing APIFY_API_TOKEN");
      return [];
    }

    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queries: `site:linkedin.com/in ${query}`,
          maxPagesPerQuery: 1,
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ APIFY ERROR:", res.status, text);
      return [];
    }

    const raw = await res.json();

    console.log("📦 RAW:", JSON.stringify(raw).slice(0, 500));

    const items = Array.isArray(raw) ? raw : [raw];

    const results = items
      .flatMap((item: any) => item.organicResults || [])
      .map((r: any) => {
        // 🔥 handle both possible fields
        const link = r.link || r.url || "";

        return {
          name: (r.title || "").split(" - ")[0] || "",
          title: r.title || "",
          profileUrl: link,
          company: "",
          domain: "",
          email: null,
        };
      })
      .filter((p: any) =>
        p.profileUrl.includes("linkedin.com/in")
      )
      .slice(0, maxItems);

    console.log("✅ FINAL LEADS:", results.length);

    return results;

  } catch (err) {
    console.error("❌ SCRAPER ERROR:", err);
    return [];
  }
}