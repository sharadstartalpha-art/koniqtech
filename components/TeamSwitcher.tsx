"use client";

import { useEffect, useState } from "react";
import { useTeamStore } from "@/lib/store/useTeam";

export default function TeamSwitcher() {
  const [teams, setTeams] = useState<any[]>([]);
  const { activeTeamId, setActiveTeam } = useTeamStore();

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then(setTeams);
  }, []);

  return (
    <select
      value={activeTeamId || ""}
      onChange={(e) => setActiveTeam(e.target.value)}
      className="border px-3 py-1 rounded"
    >
      <option value="">Personal</option>

      {teams.map((t) => (
        <option key={t.team.id} value={t.team.id}>
          {t.team.name}
        </option>
      ))}
    </select>
  );
}