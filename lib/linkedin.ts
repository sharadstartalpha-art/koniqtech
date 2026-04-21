import axios from "axios";

/* ============================= */
/* QUERY EXPANSION (APOLLO STYLE) */
/* ============================= */
function buildQueries(input: string) {
  const roles = [
    "founder",
    "co founder",
    "ceo",
    "co-founder",
    "owner",
    "director",
  ];

  const industries = [
    "saas",
    "b2b saas",
    "startup",
    "software",
    "ai startup",
  ];

  const locations = [
    "United States",
    "USA",
    "California",
    "New York",
    "Texas",
  ];

  const queries: string[] = [];

  for (const r of roles) {
    for (const i of industries) {
      for (const l of locations) {
        queries.push(`${r} ${i} ${l}`);
        queries.push(`"${r}" "${i}" "${l}"`);
        queries.push(`${r} of ${i} company ${l}`);
      }
    }
  }

  queries.push(input);

  return queries;
}

/* ============================= */
/* MAIN FUNCTION                 */
/* ============================= */
export async function scrapeLinkedIn(query: string) {
  const apiKey = process.env.SERP_API_KEY;

  if (!apiKey) {
    throw new Error("Missing SERP_API_KEY");
  }

  console.log("🔍 INPUT QUERY:", query);

  const queries = buildQueries(query);

  console.log("🧠 Expanded Queries:", queries.length);

  let results: any[] = [];

  for (const q of queries.slice(0, 20)) {
    console.log("➡️ Running query:", q);

    for (let page = 0; page < 3; page++) {
      const start = page * 10;

      const url = `https://serpapi.com/search.json?q=(site:linkedin.com/in OR site:linkedin.com/pub) ${encodeURIComponent(
        q
      )}&start=${start}&engine=google&api_key=${apiKey}`;

      try {
        const res = await axios.get(url);

        const organic = res.data?.organic_results || [];

        console.log(`📄 Page ${page + 1} results:`, organic.length);

        const links = organic
          .map((r: any) => r.link)
          .filter((l: string) =>
            l.includes("linkedin.com/in/")
          );

        console.log(`🔗 LinkedIn profiles found:`, links.length);

        results.push(
          ...links.map((url: string) => ({
            name: extractName(url),
            profileUrl: url,
            title: q,
          }))
        );

      } catch (err) {
        console.error("❌ SERP ERROR:", err);
      }
    }
  }

  // ==============================
  // ✅ DEDUPE
  // ==============================
  const unique = Array.from(
    new Map(results.map((r) => [r.profileUrl, r])).values()
  );

  console.log("🔥 TOTAL RAW RESULTS:", results.length);
  console.log("✅ UNIQUE PROFILES:", unique.length);

  // 🔥 FINAL OUTPUT LOG
  console.log("👥 FINAL PROFILES SAMPLE:", unique.slice(0, 5));

  return unique.slice(0, 500);
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