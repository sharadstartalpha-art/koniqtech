export async function scrapeLinkedInApify() {
  const res = await fetch(
    `https://api.apify.com/v2/acts/apify~linkedin-people-search/run-sync-get-dataset-items?token=${process.env.APIFY_API_TOKEN}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keywords: "founder",
        maxItems: 10,
      }),
    }
  );

  const data = await res.json();

  return data.map((p: any) => ({
    name: p.fullName,
    title: p.headline,
    company: p.companyName || "",
  }));
}