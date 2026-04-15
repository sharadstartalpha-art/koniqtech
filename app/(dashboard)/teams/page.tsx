"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>

      {/* ✅ CREATE TEAM */}
      <button
        onClick={async () => {
          const name = prompt("Enter team name");
          if (!name) return;

          await fetch("/api/team", {
            method: "POST",
            body: JSON.stringify({ name }),
          });

          load(); // reload
        }}
        className="bg-black text-white px-4 py-2 rounded mb-4"
      >
        + Create Team
      </button>

      {teams.length === 0 ? (
        <p>No teams yet</p>
      ) : (
        teams.map((team: any) => (
          <Link href={`/teams/${team.id}`} key={team.id}>
            <div className="border p-4 rounded cursor-pointer mb-2">
              {team.name}
            </div>
          </Link>
        ))
      )}
    </div>
  );
}