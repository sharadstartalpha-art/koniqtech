export async function fallbackSearch(query: string) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
        "site:linkedin.com/in " + query
      )}&key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CSE_ID}`
    );

    const data = await res.json();

    if (!data.items) return [];

    return data.items.map((item: any) => ({
      name: item.title,
      profileUrl: item.link,
      website: item.link,
      title: item.title,
      snippet: item.snippet,
      source: "fallback",
    }));
  } catch {
    return [];
  }
}