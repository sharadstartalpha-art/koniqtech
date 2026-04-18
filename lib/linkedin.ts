import { scrapeLinkedInApify } from "@/lib/apify";

type Lead = {
  name: string;
  title?: string;
  company?: string;
  domain?: string;
  profileUrl?: string;
  email?: string | null;
};

export async function scrapeLinkedIn(query: string): Promise<Lead[]> {
  try {
    const leads = await scrapeLinkedInApify({
      query,
      maxItems: 50,
    });

    if (!Array.isArray(leads)) return [];

    return leads.map((p: any) => ({
      name: p.name || "",
      title: p.title || "",
      company: "",
      domain: "",
      profileUrl: p.profileUrl || "",
      email: null,
    }));

  } catch (err) {
    console.error("SCRAPE ERROR:", err);
    return [];
  }
}