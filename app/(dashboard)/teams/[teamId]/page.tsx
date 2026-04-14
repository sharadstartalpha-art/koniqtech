"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function TeamPage() {
  const { teamId } = useParams();
  const [team, setTeam] = useState<any>(null);
  const [email, setEmail] = useState("");

  const load = () => {
    fetch(`/api/team/${teamId}`)
      .then((res) => res.json())
      .then(setTeam);
  };

  useEffect(() => {
    load();
  }, []);

  const invite = async () => {
    await fetch("/api/team/invite", {
      method: "POST",
      body: JSON.stringify({ email, teamId }),
    });

    setEmail("");
    load();
  };

  const remove = async (id: string) => {
    await fetch("/api/team/remove", {
      method: "POST",
      body: JSON.stringify({ memberId: id }),
    });

    load();
  };

  const changeRole = async (id: string, role: string) => {
    await fetch("/api/team/role", {
      method: "POST",
      body: JSON.stringify({ memberId: id, role }),
    });

    load();
  };

  if (!team) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{team.name}</h1>

      {/* Invite */}
      <div className="flex gap-2 mt-4">
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button onClick={invite} className="bg-black text-white px-4 rounded">
          Invite
        </button>
      </div>

      {/* Members */}
      <h2 className="mt-6 font-semibold">Members</h2>
      <div className="space-y-2">
        {team.members.map((m: any) => (
          <div key={m.id} className="border p-3 flex justify-between">
            <div>
              {m.user.email} ({m.role})
            </div>

            <div className="flex gap-2">
              <select
                value={m.role}
                onChange={(e) => changeRole(m.id, e.target.value)}
              >
                <option value="OWNER">OWNER</option>
                <option value="MEMBER">MEMBER</option>
              </select>

              <button
                onClick={() => remove(m.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Invites */}
      <h2 className="mt-6 font-semibold">Pending Invites</h2>
      <div>
        {team.invites.map((i: any) => (
          <div key={i.id}>{i.email}</div>
        ))}
      </div>
    </div>
  );
}