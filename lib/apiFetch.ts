import { useTeamStore } from "./teamStore";

export async function apiFetch(url: string, options: any = {}) {
  const teamId = localStorage.getItem("activeTeamId");

  const body = options.body
    ? JSON.parse(options.body)
    : {};

  const res = await fetch(url, {
    ...options,
    body: JSON.stringify({
      ...body,
      activeTeamId: teamId, // 🔥 AUTO INJECT
    }),
  });

  return res.json();
}