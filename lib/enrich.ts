export async function getDomain(company: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://autocomplete.clearbit.com/v1/companies/suggest?query=${company}`
    );

    const data = await res.json();

    return data?.[0]?.domain || null;
  } catch {
    return null;
  }
}

export async function verifyEmail(email: string): Promise<boolean> {
  try {
    const url = new URL("https://api.hunter.io/v2/email-verifier");

    url.searchParams.append("email", email);
    url.searchParams.append("api_key", process.env.HUNTER_API_KEY || "");

    const res = await fetch(url.toString());
    const data = await res.json();

    const status = data?.data?.status;

    return status === "valid" || status === "accept_all";
  } catch {
    return false;
  }
}