type ApolloPerson = {
  first_name: string;
  last_name: string;
  email?: string;
  organization?: {
    name?: string;
    website_url?: string;
  };
};

export async function searchApolloLeads(query: string) {
  if (!query) return [];

  try {
    const res = await fetch("https://api.apollo.io/v1/mixed_people/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.APOLLO_API_KEY || "",
      },
      body: JSON.stringify({
        q_keywords: query,
        page: 1,
        per_page: 25,
      }),
    });

    if (!res.ok) {
      console.error("Apollo API error:", res.status);
      return [];
    }

    const data = await res.json();

    return (data.people || []).map((p: ApolloPerson) => ({
      name: `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim(),
      email: p.email ?? null,
      company: p.organization?.name ?? "",
      domain: p.organization?.website_url ?? "",
    }));
  } catch (err) {
    console.error("Apollo error:", err);
    return [];
  }
}