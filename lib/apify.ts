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
      `https://api.apify.com/v2/acts/apify~google-search-results-scraper/run-sync-get-dataset-items?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queries: [`site:linkedin.com/in ${query}`],
          maxPagesPerQuery: 1,
        }),
      }
    );

    const data = await res.json();

    console.log("📦 GOOGLE RAW:", data.length);

    // 🔥 Extract LinkedIn profiles
    return data
      .flatMap((item: any) => item.organicResults || [])
      .filter((r: any) => r.url?.includes("linkedin.com/in"))
      .slice(0, maxItems)
      .map((r: any) => ({
        name: r.title?.split(" - ")[0] || "",
        title: r.title || "",
        profileUrl: r.url,
        company: "",
        domain: "",
        email: null,
      }));

  } catch (err) {
    console.error("SCRAPER ERROR:", err);
    return [];
  }
}