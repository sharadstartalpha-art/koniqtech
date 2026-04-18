export async function scrapeLinkedInV2(profileUrls: string[]) {
  const token = process.env.APIFY_API_TOKEN;

  const res = await fetch(
    `https://api.apify.com/v2/acts/apify~linkedin-profile-scraper/run-sync-get-dataset-items?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileUrls,
      }),
    }
  );

  return res.json();
}