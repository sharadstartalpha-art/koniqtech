import { scrapeLinkedInApify } from "@/lib/apify";

export async function scrapeLinkedIn(query: string = "founder") {
  try {
    const people = await scrapeLinkedInApify({
      keywords: query || "founder",
      maxItems: 20,
    });

    return people;

  } catch (err) {
    console.error("LINKEDIN SCRAPE ERROR:", err);
    return [];
  }
}