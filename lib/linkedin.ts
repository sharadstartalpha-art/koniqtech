import axios from "axios";

/* ============================= */
/* CONFIG                        */
/* ============================= */
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  "Mozilla/5.0 (X11; Linux x86_64)",
];

/* ============================= */
/* MAIN FUNCTION                 */
/* ============================= */
export async function scrapeLinkedIn(query: string) {
  const queries = [
    `${query}`,
    `${query} founder`,
    `${query} CEO`,
    `${query} startup`,
  ];

  let results: any[] = [];

  for (const q of queries) {
    for (let page = 0; page < 4; page++) {
      const start = page * 10;

      const googleUrl = `https://www.google.com/search?q=site:linkedin.com/in ${encodeURIComponent(
        q
      )}&start=${start}`;

      const html = await fetchWithStealth(googleUrl);

      let links = extractLinks(html);

      // 🔁 FALLBACK → BING (VERY IMPORTANT)
      if (links.length === 0) {
        const bingUrl = `https://www.bing.com/search?q=site:linkedin.com/in ${encodeURIComponent(
          q
        )}&first=${start}`;

        const bingHtml = await fetchWithStealth(bingUrl);
        links = extractLinks(bingHtml);
      }

      results.push(
        ...links.map((url) => ({
          name: extractName(url),
          profileUrl: url,
          title: q,
        }))
      );

      await delay(800 + Math.random() * 1000); // 🧠 anti-block
    }
  }

  // ✅ dedupe
  const unique = Array.from(
    new Map(results.map((r) => [r.profileUrl, r])).values()
  );

  console.log("🔥 TOTAL PROFILES:", unique.length);

  return unique.slice(0, 200);
}

/* ============================= */
/* STEALTH FETCH                 */
/* ============================= */
async function fetchWithStealth(url: string) {
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    return res.data;
  } catch (err) {
    console.error("FETCH ERROR:", err);
    return "";
  }
}

/* ============================= */
/* LINK EXTRACTOR                */
/* ============================= */
function extractLinks(html: string): string[] {
  if (!html) return [];

  const matches =
    html.match(/https:\/\/www\.linkedin\.com\/in\/[^"&]+/g) || [];

  return [...new Set(matches)];
}

/* ============================= */
/* NAME PARSER                   */
/* ============================= */
function extractName(url: string) {
  const slug = url.split("/in/")[1]?.split("/")[0] || "";

  return slug
    .replace(/-/g, " ")
    .replace(/\d+/g, "")
    .trim();
}

/* ============================= */
/* DELAY                         */
/* ============================= */
function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}