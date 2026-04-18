type ApolloPerson = {
  first_name?: string;
  last_name?: string;
  email?: string;
  title?: string;
  headline?: string;
  organization?: {
    name?: string;
    website_url?: string;
  };
};

export async function searchApolloLeads(query: string) {
  if (!query) return [];

  try {
    // ✅ DEBUG: check if API key exists
    console.log("APOLLO KEY:", process.env.APOLLO_API_KEY);

    const res = await fetch("https://api.apollo.io/v1/mixed_people/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "X-Api-Key": process.env.APOLLO_API_KEY || "",
      },
      body: JSON.stringify({
        q_keywords: query,
        page: 1,
        per_page: 25,
      }),
    });

    // ❌ Handle API errors properly
    if (!res.ok) {
      const text = await res.text();
      console.error("Apollo API error:", res.status, text);
      return [];
    }

    const data = await res.json();

    // ✅ Safety check
    if (!data?.people || !Array.isArray(data.people)) {
      console.warn("No Apollo leads");
      return [];
    }

    // ✅ Normalize response
    return data.people.map((p: ApolloPerson) => ({
      name: `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim(),
      email: p.email ?? null,
      company: p.organization?.name ?? "",
      domain: p.organization?.website_url ?? "",
      title: p.title || p.headline || "", // 🔥 important for your filter
    }));

  } catch (err) {
    console.error("Apollo fetch error:", err);
    return [];
  }
}