export async function scrapeLinkedInApify({
  keywords,
  maxItems = 20,
}: {
  keywords: string;
  maxItems?: number;
}) {
  const res = await fetch(
    `https://api.apify.com/v2/acts/harvestapi~linkedin-profile-search/run-sync-get-dataset-items?token=${process.env.APIFY_API_TOKEN}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searchKeywords: keywords || "founder", // ✅ correct field
        locations: ["United States"],          // ✅ improves results
        maxItems,
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("APIFY ERROR:", text);
    throw new Error("Apify failed");
  }

  const data = await res.json();

  return (data || []).map((p: any) => ({
    name: `${p.firstName || ""} ${p.lastName || ""}`.trim(),
    title: p.headline || "",
    profileUrl: p.linkedinUrl || "",
    email: null,
  }));
}