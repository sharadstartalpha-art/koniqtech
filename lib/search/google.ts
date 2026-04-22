export async function googleSearch(query: string) {
  try {
    const API_KEY = process.env.GOOGLE_API_KEY!;
    const CX = process.env.GOOGLE_CSE_ID!;

    if (!API_KEY || !CX) {
      console.error("❌ Missing Google API env");
      return [];
    }

    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      query
    )}&key=${API_KEY}&cx=${CX}`;

    const res = await fetch(url);
    const json = await res.json();

    // 🚨 HANDLE ERROR
    if (!json || json.error) {
      console.error("❌ GOOGLE RAW:", json);
      return [];
    }

    if (!Array.isArray(json.items)) {
      console.log("⚠️ No Google results");
      return [];
    }

    return json.items.map((item: any) => ({
      name: item.title || "",
      website: item.link || "",
      snippet: item.snippet || "",
      source: "google",
    }));
  } catch (err) {
    console.error("❌ Google search failed:", err);
    return [];
  }
}