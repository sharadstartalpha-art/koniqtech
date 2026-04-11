export async function fetchApolloLeads(filters: any) {
  const res = await fetch("https://api.apollo.io/v1/mixed_people/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": process.env.APOLLO_API_KEY!,
    },
    body: JSON.stringify({
      person_titles: [filters.title],
      organization_locations: [filters.location],
      organization_industries: [filters.industry],
    }),
  });

  const data = await res.json();

  return data.people.map((p: any) => ({
    name: p.name,
    email: p.email,
    company: p.organization?.name,
  }));
}