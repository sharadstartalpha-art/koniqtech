import { searchApolloLeads } from "./apollo";

export async function scrapeLinkedIn(query: string) {
  try {
    const people = await searchApolloLeads(query);

    if (!people.length) {
      console.log("❌ No Apollo leads");
      return [];
    }

    return people.map((p: any) => ({
      name: p.name,
      email: p.email || null,
      company: p.company || "",
      title: "founder", // 🔥 IMPORTANT (so filter passes)
      domain: p.domain || "",
    }));

  } catch (err) {
    console.error("SCRAPER ERROR:", err);
    return [];
  }
}