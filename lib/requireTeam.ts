export function requireTeam(teamId?: string) {
  if (!teamId) {
    throw new Error("TEAM_REQUIRED");
  }
}