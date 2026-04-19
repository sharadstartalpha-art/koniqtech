import axios from "axios";

/* ============================= */
/* MAIN FUNCTION                 */
/* ============================= */
export async function scrapeLinkedIn(query: string) {
  const apiKey = process.env.SERP_API_KEY;

  if (!apiKey) {
    throw new Error("Missing SERP_API_KEY");
  }

  const queries = [
    `${query}`,
    `${query} founder`,
    `${query} CEO`,
    `${query} startup`,
  ];

  let results: any[] = [];

  for (const q of queries) {
    for (let page = 0; page < 5; page++) {
      const start = page * 10;

      const url = `https://serpapi.com/search.json?q=site:linkedin.com/in ${encodeURIComponent(
        q
      )}&start=${start}&engine=google&api_key=${apiKey}`;

      try {
        const res = await axios.get(url);

        const organic = res.data?.organic_results || [];

        const links = organic
          .map((r: any) => r.link)
          .filter((l: string) =>
            l.includes("linkedin.com/in/")
          );

        results.push(
          ...links.map((url: string) => ({
            name: extractName(url),
            profileUrl: url,
            title: q,
          }))
        );

      } catch (err) {
        console.error("SERP ERROR:", err);
      }
    }
  }

  // ✅ dedupe
  const unique = Array.from(
    new Map(results.map((r) => [r.profileUrl, r])).values()
  );

  console.log("🔥 SERP TOTAL PROFILES:", unique.length);

  return unique.slice(0, 200);
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