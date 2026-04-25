import { apifySearch } from "./apify";
import { googleMapsSearch } from "./maps";
import { twitterSearch } from "./twitter";
import { instagramSearch } from "./instagram";

export async function multiSourceSearch(query: string) {
  const results = await Promise.allSettled([
    apifySearch(query),               // Google → LinkedIn
    googleMapsSearch(query),          // Businesses
    twitterSearch(query),             // Founders
    instagramSearch(query),           // Brands
  ]);

  const merged = results
    .filter((r) => r.status === "fulfilled")
    .flatMap((r: any) => r.value || []);

  return merged;
}