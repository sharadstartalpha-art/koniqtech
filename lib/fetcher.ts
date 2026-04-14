export async function apiFetch(url: string, options: any = {}) {
  const teamId =
    typeof window !== "undefined"
      ? localStorage.getItem("teamId")
      : null;

  const body = options.body ? JSON.parse(options.body) : {};

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: JSON.stringify({
      ...body,
      activeTeamId: teamId,
    }),
  });
}