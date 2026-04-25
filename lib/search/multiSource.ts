import { apifySearch } from "./apify";
import { googleMapsSearch } from "./maps";
import { twitterSearch } from "./twitter";
import { instagramSearch } from "./instagram";

const USE_APIFY = process.env.USE_APIFY === "true";

export async function multiSourceSearch(query: string) {
  const tasks = [
    // 🔥 toggle expensive source
    USE_APIFY ? apifySearch(query) : Promise.resolve([]),

    googleMapsSearch(query),
    twitterSearch(query),
    instagramSearch(query),
  ];

  const results = await Promise.allSettled(tasks);

  const merged = results
    .filter((r) => r.status === "fulfilled")
    .flatMap((r: any) => r.value || []);

  return merged;
}