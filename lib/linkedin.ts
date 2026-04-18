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

    if (!Array.isArray(leads) || leads.length === 0) {
      console.warn("⚠️ No leads from Apify");
      return [];
    }

    console.log("✅ Apify leads:", leads.length);

    return leads.map((p: any) => ({
      name: p.name || "",
      title: p.title || p.headline || "",
      company: p.companyName || "",
      domain: p.companyWebsite || "",
      profileUrl: p.profileUrl || "",
      email: null, // will enrich later
    }));

  } catch (err) {
    console.error("❌ APIFY ERROR:", err);
    return [];
  }
}