export async function scrapeLinkedInApify({
  query,
  maxItems = 100,
}: {
  query: string;
  maxItems?: number;
}) {
  try {
    const token = process.env.APIFY_API_TOKEN;

    if (!token) {
      throw new Error("Missing APIFY_API_TOKEN");
    }

    const res = await fetch(
      `https://api.apify.com/v2/acts/harvestapi~linkedin-profile-search/run-sync-get-dataset-items?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search: query || "founder",
          maxItems,
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ APIFY ERROR:", text);
      throw new Error("Apify request failed");
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("❌ Invalid Apify response:", data);
      return [];
    }

    console.log("📦 RAW APIFY RESULTS:", data.length);

    // 🔥 CLEAN + SAFE MAP
    return data.map((p: any) => {
      const firstName = p.firstName || "";
      const lastName = p.lastName || "";

      return {
        name: `${firstName} ${lastName}`.trim() || "Unknown",
        title: p.headline || "",
        profileUrl: p.linkedinUrl || "",
        company: p.companyName || "",
        companyWebsite: p.companyWebsite || "",
        email: null,
      };
    });

  } catch (err) {
    console.error("❌ APIFY SCRAPE ERROR:", err);
    return [];
  }
}