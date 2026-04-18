export async function findEmail({
  domain,
  firstName,
  lastName,
}: {
  domain: string;
  firstName: string;
  lastName: string;
}): Promise<string | null> {
  if (!domain || !firstName || !lastName) return null;

  try {
    const url = new URL("https://api.hunter.io/v2/email-finder");

    url.searchParams.append("domain", domain);
    url.searchParams.append("first_name", firstName);
    url.searchParams.append("last_name", lastName);
    url.searchParams.append("api_key", process.env.HUNTER_API_KEY || "");

    const res = await fetch(url.toString());

    if (!res.ok) {
      console.error("Hunter API error:", res.status);
      return null;
    }

    const data = await res.json();

    return data?.data?.email ?? null;
  } catch (err) {
    console.error("Hunter error:", err);
    return null;
  }
}