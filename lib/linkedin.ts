import { scrapeLinkedInApify } from "@/lib/apify";

export async function scrapeLinkedIn(query: string = "founder") {
  try {
    const data = await scrapeLinkedInApify({
      keywords: query,
      maxItems: 20,
    });

    return data;
  } catch (err) {
    console.error("LINKEDIN SCRAPE ERROR:", err);
    return [];
  }
}