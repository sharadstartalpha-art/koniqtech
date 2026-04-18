import { searchApolloLeads } from "./apollo";
import { findEmail } from "./hunter";

type Lead = {
  name: string;
  email: string;
  company: string;
};

export async function scrapeLinkedIn(query: string): Promise<Lead[]> {
  if (!query) return [];

  try {
    // ✅ Step 1: Fetch people from Apollo
    const people = await searchApolloLeads(query);

    if (!people.length) {
      console.warn("⚠️ No people found from Apollo");
      return [];
    }

    const enriched: Lead[] = [];

    // ✅ Step 2: Enrich with emails
    for (const p of people) {
      let email = p.email;

      if (!email && p.domain && p.name) {
        const [firstName, lastName] = p.name.split(" ");

        if (firstName && lastName) {
          email = await findEmail({
            domain: p.domain,
            firstName,
            lastName,
          });
        }
      }

      // ❌ Skip if still no email
      if (!email) continue;

      enriched.push({
        name: p.name,
        email,
        company: p.company,
      });
    }

    console.log("🔥 Enriched Leads:", enriched.length);

    return enriched;
  } catch (err) {
    console.error("❌ Lead pipeline error:", err);
    return [];
  }
}