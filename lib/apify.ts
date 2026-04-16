export async function scrapeLinkedInApify({
  query,
  maxItems = 100,
}: {
  query: string;
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
        search: query || "founder", // 🔥 UPDATED
        maxItems, // 🔥 100 results
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("APIFY ERROR:", text);
    throw new Error("Apify failed");
  }

  const data = await res.json();

  console.log("RAW APIFY:", data.length);

  return (data || []).map((p: any) => ({
    name: `${p.firstName || ""} ${p.lastName || ""}`.trim(),
    title: p.headline || "",
    profileUrl: p.linkedinUrl || "",
    company: p.companyName || "",
    companyWebsite: p.companyWebsite || "",
    email: null,
  }));
}