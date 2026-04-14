"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);

  const load = async () => {
    const res = await fetch("/api/team");
    const data = await res.json();
    setTeams(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>

      {teams.map((t: any) => (
        <Link href={`/teams/${t.team.id}`} key={t.team.id}>
          <div className="border p-4 rounded cursor-pointer mb-2">
            {t.team.name}
          </div>
        </Link>
      ))}
    </div>
  );
}