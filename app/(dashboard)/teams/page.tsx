"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  const loadTeams = async () => {
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
    loadTeams();
  }, []);

  const createTeam = async () => {
    if (!name) return;

    await fetch("/api/team", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name }),
});

    setName("");
    loadTeams();
  };

  const deleteTeam = async (id: string) => {
    if (!confirm("Delete this team?")) return;

    await fetch(`/api/team/${id}`, {
      method: "DELETE",
    });

    loadTeams();
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl">

      <h1 className="text-2xl font-bold mb-6">Teams 🚀</h1>

      {/* CREATE */}
      <div className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New team name"
          className="border px-3 py-2 rounded w-full"
        />

        <button
          onClick={createTeam}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border overflow-hidden">

        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">Team</th>
              <th className="p-3">Members</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="border-t">

                <td className="p-3 font-medium">
                  <Link href={`/teams/${team.id}`}>
                    {team.name}
                  </Link>
                </td>

                <td className="p-3 text-sm text-gray-500">
                  {team.members?.length || 1}
                </td>

                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => {
                      const newName = prompt("New name:", team.name);
                      if (!newName) return;

                     fetch(`/api/team/${team.id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: newName }),
}).then(loadTeams);
                    }}
                    className="px-3 py-1 border rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTeam(team.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}

            {teams.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No teams yet
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}