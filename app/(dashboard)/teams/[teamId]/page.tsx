"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

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
    const res = await fetch("/api/team/invite", {
      method: "POST",
      body: JSON.stringify({ email, teamId }),
    });

    const data = await res.json();

    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success("Invite sent 🚀");
    }

    setEmail("");
    load();
  };

  const remove = async (id: string) => {
    const ok = confirm("Remove this member?");
    if (!ok) return;

    await fetch("/api/team/remove", {
      method: "POST",
      body: JSON.stringify({ memberId: id }),
    });

    toast.success("Member removed");
    load();
  };

  const changeRole = async (id: string, role: string) => {
    await fetch("/api/team/role", {
      method: "POST",
      body: JSON.stringify({ memberId: id, role }),
    });

    toast.success("Role updated");
    load();
  };

  if (!team) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">{team.name}</h1>

      {/* INVITE */}
      <div className="flex gap-2">
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

      {/* MEMBERS */}
      <div>
        <h2 className="font-semibold mb-2">Members</h2>

        <div className="space-y-2">
          {team.members.map((m: any) => (
            <div
              key={m.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                {m.user.email} ({m.role})
              </div>

              <div className="flex gap-2">

                <select
                  value={m.role}
                  onChange={(e) => changeRole(m.id, e.target.value)}
                  className="border px-2 py-1"
                >
                  <option value="OWNER">OWNER</option>
                  <option value="ADMIN">ADMIN</option>
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
      </div>

      {/* INVITES */}
      <div>
        <h2 className="font-semibold mb-2">Pending Invites</h2>

        {team.invites.length === 0 && (
          <p className="text-gray-500">No pending invites</p>
        )}

        {team.invites.map((i: any) => (
          <div key={i.id} className="border p-2 rounded">
            {i.email}
          </div>
        ))}
      </div>

    </div>
  );
}