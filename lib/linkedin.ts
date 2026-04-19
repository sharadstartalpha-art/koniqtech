import { scrapeLinkedInApify } from "@/lib/apify";

type Lead = {
  name: string;
  title?: string;
  company?: string;
  domain?: string;
  profileUrl?: string;
  email?: string | null;
};

// Helper to extract company from title string
function extractCompany(title: string): string {
  if (!title) return "";

  const parts = title.split(" at ");
  if (parts.length > 1) return parts[1].trim();

  return "";
}

export async function scrapeLinkedIn(query: string): Promise<Lead[]> {
  try {
    const leads = await scrapeLinkedInApify({
      query,
      maxItems: 50,
    });

    if (!Array.isArray(leads)) return [];

    return leads.map((p: any) => {
      const company =
        p.companyName ||
        extractCompany(p.title || "");

      return {
        name: p.name || "",
        title: p.title || "",
        company,
        domain: "", // can enrich later
        profileUrl: p.profileUrl || "",
        email: null,
      };
    });

  } catch (err) {
    console.error("SCRAPE ERROR:", err);
    return [];
  }
}