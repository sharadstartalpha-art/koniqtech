export async function scrapeLinkedInApify({
  query,
  maxItems = 50,
}: {
  query: string;
  maxItems?: number;
}) {
  try {
    const token = process.env.APIFY_API_TOKEN;

    if (!token) {
      throw new Error("Missing APIFY_API_TOKEN");
    }

    // 🔥 Improve query (VERY IMPORTANT)
    const formattedQuery = query
      ? `${query} founder OR ceo`
      : "startup founder";

    console.log("🚀 APIFY QUERY:", formattedQuery);

    const res = await fetch(
      `https://api.apify.com/v2/acts/harvestapi~linkedin-profile-search/run-sync-get-dataset-items?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search: formattedQuery, // ✅ correct param
          maxItems,
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ APIFY ERROR:", res.status, text);
      return [];
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("❌ Invalid Apify response:", data);
      return [];
    }

    console.log("📦 APIFY RESULTS:", data.length);

    if (data.length === 0) {
      console.warn("⚠️ No leads from Apify");
      return [];
    }

    return data.map((p: any) => {
      const firstName = p.firstName || "";
      const lastName = p.lastName || "";

      const fullName = `${firstName} ${lastName}`.trim();

      // 🔥 Clean domain
      let domain = "";
      if (p.companyWebsite) {
        domain = p.companyWebsite;
      } else if (p.company?.website) {
        domain = p.company.website;
      }

      if (domain) {
        domain = domain
          .replace(/^https?:\/\//, "")
          .replace(/^www\./, "")
          .split("/")[0];
      }

      return {
        name: fullName,
        firstName,
        lastName,
        title: p.headline || "",
        profileUrl: p.linkedinUrl || "",
        company: p.companyName || p.company?.name || "",
        domain,
        location: p.location || "",
        email: null, // will enrich later
      };
    });

  } catch (err) {
    console.error("❌ APIFY SCRAPE ERROR:", err);
    return [];
  }
}