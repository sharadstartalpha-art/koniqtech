import { scrapeLinkedInApify } from "@/lib/apify";

export async function scrapeLinkedIn(query: string = "founder") {
  try {
    const leads = await scrapeLinkedInApify({
      query,
      maxItems: 100,
    });

    if (!Array.isArray(leads) || leads.length === 0) {
      console.warn("⚠️ No leads returned from Apify");
      return [];
    }

    // 🔥 LIMIT INITIAL SET (for performance)
    const people = leads.slice(0, 25);

    console.log("✅ LinkedIn leads fetched:", people.length);

    return people;

  } catch (err) {
    console.error("❌ LINKEDIN SCRAPE ERROR:", err);
    return [];
  }
}