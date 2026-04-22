export async function googleSearch(query: string) {
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    query
  )}&key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CX}`;

  const res = await fetch(url);
  const data = await res.json();

  console.log("GOOGLE RAW:", data);

  if (!data.items) return [];

  return data.items.map((item: any) => ({
    name: item.title,
    profileUrl: item.link,
    snippet: item.snippet,
  }));
}