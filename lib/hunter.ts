export async function findEmail({
  domain,
  firstName,
  lastName,
}: {
  domain: string;
  firstName: string;
  lastName: string;
}) {
  if (!domain) return null;

  try {
    const res = await fetch(
      `https://api.hunter.io/v2/email-finder?domain=${domain}&first_name=${firstName}&last_name=${lastName}&api_key=${process.env.HUNTER_API_KEY}`
    );

    const data = await res.json();

    return data?.data?.email || null;
  } catch (err) {
    console.error("Hunter error:", err);
    return null;
  }
}