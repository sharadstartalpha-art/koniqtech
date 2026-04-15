import axios from "axios";

export async function findEmail(domain: string, name: string) {
  try {
    const res = await axios.get(
      `https://api.hunter.io/v2/email-finder`,
      {
        params: {
          domain,
          full_name: name,
          api_key: process.env.HUNTER_API_KEY,
        },
      }
    );

    return res.data.data.email || null;
  } catch (err) {
    return null;
  }
}