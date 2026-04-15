"use client";

import { useEffect, useState } from "react";
import { useTeamStore } from "@/lib/teamStore";
import { useRouter } from "next/navigation";

export default function TeamSwitcher() {
  const { activeTeamId, setTeam } = useTeamStore();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);
        setLoading(false);

        // 🔥 AUTO SELECT FIRST TEAM
        if (!activeTeamId && data.length > 0) {
          setTeam(data[0].id);
          router.push(`/teams/${data[0].id}`);
        }
      });
  }, []);

  const handleChange = (teamId: string) => {
    setTeam(teamId);
    router.push(`/teams/${teamId}`); // ✅ THIS FIXES YOUR ISSUE
  };

  return (
    <select
      value={activeTeamId || ""}
      onChange={(e) => handleChange(e.target.value)}
      className="border px-3 py-1 rounded"
    >
      {loading && <option>Loading...</option>}

      {!loading && teams.length === 0 && (
        <option>No Teams</option>
      )}

      {teams.map((team) => (
        <option key={team.id} value={team.id}>
          {team.name}
        </option>
      ))}
    </select>
  );
}