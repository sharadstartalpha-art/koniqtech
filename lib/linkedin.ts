import { scrapeLinkedInApify } from "@/lib/apify";

export async function scrapeLinkedIn(query: string = "founder") {
  try {
    const leads = await scrapeLinkedInApify({
      query,
      maxItems: 100,
    });

    // 🔥 LIMIT INITIAL SET
    const people = leads.slice(0, 25);

    return people;

  } catch (err) {
    console.error("LINKEDIN SCRAPE ERROR:", err);
    return [];
  }
}