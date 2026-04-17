"use client";

import { useEffect, useState } from "react";
import { useTeamStore } from "@/lib/teamStore";

export default function TeamSwitcher() {
  const { activeTeamId, setTeam } = useTeamStore();
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);

        if (!activeTeamId && data.length > 0) {
          setTeam(data[0].id); // ✅ NO redirect
        }
      });
  }, []);

  return (
    <select
      value={activeTeamId || ""}
      onChange={(e) => setTeam(e.target.value)}
      className="border px-3 py-1 rounded"
    >
      {teams.map((team) => (
        <option key={team.id} value={team.id}>
          {team.name}
        </option>
      ))}
    </select>
  );
}