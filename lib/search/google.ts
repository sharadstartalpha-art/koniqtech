// lib/search/google.ts

export async function googleSearch(query: string) {
  try {
    const API_KEY = process.env.GOOGLE_API_KEY!;
    const CX = process.env.GOOGLE_CX!;

    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      query
    )}&key=${API_KEY}&cx=${CX}&num=10`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.items) return [];

    return data.items.map((item: any) => ({
      name: item.title,
      profileUrl: item.link,
      snippet: item.snippet,
    }));
  } catch (err) {
    console.error("❌ Google search error:", err);
    return [];
  }
}