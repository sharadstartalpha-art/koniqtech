import { getDomain } from "./enrich";
import { findEmailMulti } from "./emailProviders";

export async function enrichLead(p: any) {
  if (!p?.name) return null;

  const parts = p.name.split(" ");
  const first = parts[0];
  const last = parts.slice(1).join(" ");

  let domain = p.domain;

  if (!domain && p.company) {
    domain = await getDomain(p.company);
  }

  if (!domain && !p.profileUrl) return null;

  const email = await findEmailMulti({
    first,
    last,
    domain,
  });

  if (!email) return null;

  return {
    email,
    name: p.name,
    company: p.company || "",
    profileUrl: p.profileUrl,
  };
}