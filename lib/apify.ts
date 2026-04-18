export async function scrapeLinkedInApify({
  query,
  maxItems = 20,
}: {
  query: string;
  maxItems?: number;
}) {
  try {
    const token = process.env.APIFY_API_TOKEN;

    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queries: `site:linkedin.com/in ${query}`, // ✅ FIXED
          maxPagesPerQuery: 1,
        }),
      }
    );

    const raw = await res.json();

    console.log("📦 RAW:", raw);

    const items = Array.isArray(raw) ? raw : [raw];

   const results = items
  .map((item: any) => item.organicResults || [])
  .flat()
  .filter((r: any) => r.link?.includes("linkedin.com/in"))
  .slice(0, maxItems)
  .map((r: any) => ({
    name: r.title?.split(" - ")[0] || "",
    title: r.title || "",
    profileUrl: r.link, // ✅ FIXED
    company: "",
    domain: "",
    email: null,
  }));
    console.log("✅ FINAL LEADS:", results.length);

    return results;

  } catch (err) {
    console.error("❌ SCRAPER ERROR:", err);
    return [];
  }
}