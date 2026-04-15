export async function scrapeLinkedInApify({
  keywords,
  maxItems = 20,
}: {
  keywords: string;
  maxItems?: number;
}) {
  const res = await fetch(
    `https://api.apify.com/v2/acts/apify~linkedin-people-search/run-sync-get-dataset-items?token=${process.env.APIFY_API_TOKEN}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keywords: keywords || "founder",
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

  console.log("RAW APIFY COUNT:", data.length);

  // ✅ NORMALIZE HERE (THIS IS YOUR CODE)
  const people = (data || []).map((p: any) => ({
    name: `${p.firstName || ""} ${p.lastName || ""}`.trim(),
    title: p.headline || "",
    profileUrl: p.linkedinUrl || "",
    email: null,
  }));

  console.log("NORMALIZED PEOPLE:", people.length);

  return people;
}