import axios from "axios";

export async function scrapeLinkedIn(query: string) {
  const queries = [
    `${query}`,
    `${query} founder`,
    `${query} CEO`,
    `${query} startup`,
  ];

  let results: any[] = [];

  for (const q of queries) {
    for (let page = 0; page < 5; page++) { // 🔥 5 pages each
      const start = page * 10;

      const url = `https://www.google.com/search?q=site:linkedin.com/in ${encodeURIComponent(
        q
      )}&start=${start}`;

      try {
        const res = await axios.get(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          },
        });

        const html = res.data;

        const matches =
          html.match(/https:\/\/www\.linkedin\.com\/in\/[^"&]+/g) || [];

        results.push(
          ...matches.map((link: string) => ({
            name: extractName(link),
            profileUrl: link,
            title: q,
          }))
        );

      } catch (err) {
        console.error("SCRAPE ERROR:", err);
      }
    }
  }

  // ✅ remove duplicates
  const unique = Array.from(
    new Map(results.map((r) => [r.profileUrl, r])).values()
  );

  console.log("🔥 TOTAL PROFILES:", unique.length);

  return unique.slice(0, 200); // 🚀 BIG LIMIT
}

/* ============================= */
/* SIMPLE NAME EXTRACTOR         */
/* ============================= */
function extractName(url: string) {
  const slug = url.split("/in/")[1]?.split("/")[0] || "";
  return slug
    .replace(/-/g, " ")
    .replace(/\d+/g, "")
    .trim();
}