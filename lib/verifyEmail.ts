export async function verifyEmail(email: string): Promise<boolean> {
  try {
    const key = process.env.HUNTER_API_KEY;
    if (!key) return false;

    const res = await fetch(
      `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${key}`
    );

    const data = await res.json();

    return data?.data?.status === "valid";
  } catch {
    return false;
  }
}