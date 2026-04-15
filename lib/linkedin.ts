import { scrapeLinkedInApify } from "@/lib/apify";

export async function scrapeLinkedIn() {
  try {
    // 🔥 Call Apify (no arguments)
    const data = await scrapeLinkedInApify();

    // ✅ Normalize data
    const people = (data || []).map((p: any) => ({
      name: p.fullName || "",
      title: p.headline || "",
      profileUrl: p.profileUrl || "",
      email: p.email || null,
    }));

    return people;

  } catch (err) {
    console.error("LINKEDIN SCRAPE ERROR:", err);
    return [];
  }
}