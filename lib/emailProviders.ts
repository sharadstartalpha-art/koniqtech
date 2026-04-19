import { findEmail } from "@/lib/hunter";

/* 🔥 SNOV (OPTIONAL) */
async function findEmailSnov(domain: string, first: string, last: string) {
  try {
    const res = await fetch("https://api.snov.io/v1/get-emails-from-names", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SNOV_API_KEY}`,
      },
      body: JSON.stringify({
        domain,
        firstName: first,
        lastName: last,
      }),
    });

    const data = await res.json();
    return data?.email || null;
  } catch {
    return null;
  }
}

/* 🧠 MASTER EMAIL FINDER */
export async function findEmailMulti({
  domain,
  first,
  last,
}: {
  domain: string;
  first: string;
  last: string;
}) {
  // 1️⃣ Hunter
  let email = await findEmail({
    domain,
    firstName: first,
    lastName: last,
  });

  if (email) return email;

  // 2️⃣ Snov
  email = await findEmailSnov(domain, first, last);
  if (email) return email;

  return null;
}