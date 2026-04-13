"use client";

import { useEffect, useState } from "react";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch("/api/team")
      .then(res => res.json())
      .then(setTeams);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Teams</h1>

      <CreateTeam />

      <div className="mt-6 space-y-4">
        {teams.map((t: any) => (
          <div key={t.team.id} className="border p-4 rounded">
            <h2>{t.team.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreateTeam() {
  const [name, setName] = useState("");

  const handleCreate = async () => {
    await fetch("/api/team/create", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    window.location.reload();
  };

  return (
    <div className="flex gap-2">
      <input
        placeholder="Team name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-3 py-2 rounded"
      />
      <button onClick={handleCreate} className="bg-black text-white px-4 py-2 rounded">
        Create
      </button>
    </div>
  );
}