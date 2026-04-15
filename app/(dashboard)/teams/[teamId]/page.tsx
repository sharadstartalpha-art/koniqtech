"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function TeamPage() {
  const params = useParams();
  const teamId = params?.teamId as string;

  const [team, setTeam] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔄 LOAD TEAM
  const load = async () => {
    try {
      const res = await fetch(`/api/team/${teamId}`);
      const data = await res.json();
      setTeam(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load team");
    }
  };

  useEffect(() => {
    if (teamId) load();
  }, [teamId]);

  // ✅ INVITE
  const invite = async () => {
    if (!email) return toast.error("Enter email");

    setLoading(true);

    const res = await fetch("/api/team/invite", {
      method: "POST",
      body: JSON.stringify({ email, teamId }),
    });

    const data = await res.json();

    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success("Invite sent 🚀");
      setEmail("");
      load();
    }

    setLoading(false);
  };

  // ✅ REMOVE MEMBER
  const remove = async (memberId: string) => {
    if (!confirm("Remove this member?")) return;

    await fetch("/api/team/member", {
      method: "DELETE",
      body: JSON.stringify({ memberId }),
    });

    toast.success("Member removed");
    load();
  };

  // ✅ CHANGE ROLE
  const changeRole = async (memberId: string, role: string) => {
    await fetch("/api/team/role", {
      method: "POST",
      body: JSON.stringify({ memberId, role }),
    });

    toast.success("Role updated");
    load();
  };

  // ✅ REMOVE INVITE
  const removeInvite = async (inviteId: string) => {
    if (!confirm("Delete this invite?")) return;

    await fetch("/api/team/invite/delete", {
      method: "DELETE",
      body: JSON.stringify({ inviteId }),
    });

    toast.success("Invite removed");
    load();
  };

  if (!team) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">{team.name} 🚀</h1>
        <p className="text-gray-500 text-sm">Manage your team members</p>
      </div>

      {/* INVITE BOX */}
      <div className="flex gap-2 items-center bg-gray-100 p-3 rounded-xl shadow-sm">
        <input
          placeholder="Enter email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-white border px-3 py-2 rounded outline-none"
        />
        <button
          onClick={invite}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {loading ? "Sending..." : "Invite 🚀"}
        </button>
      </div>

      {/* MEMBERS */}
      <div>
        <h2 className="font-semibold mb-3 text-lg">Members</h2>

        <div className="space-y-3">
          {team.members.map((m: any) => (
            <div
              key={m.id}
              className="border p-4 rounded-xl flex justify-between items-center shadow-sm"
            >
              <div>
                <p className="font-medium">{m.user.email}</p>
                <p className="text-xs text-gray-500">{m.role}</p>
              </div>

              <div className="flex gap-2 items-center">

                <select
                  value={m.role}
                  onChange={(e) => changeRole(m.id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="OWNER">OWNER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="MEMBER">MEMBER</option>
                </select>

                <button
                  onClick={() => remove(m.id)}
                  className="text-red-500 hover:underline"
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
        <h2 className="font-semibold mb-3 text-lg">Pending Invites</h2>

        {team.invites.length === 0 && (
          <p className="text-gray-500">No pending invites</p>
        )}

        <div className="space-y-2">
          {team.invites.map((i: any) => (
            <div
              key={i.id}
              className="border p-3 rounded-xl flex justify-between items-center shadow-sm"
            >
              <span>{i.email}</span>

              <button
                onClick={() => removeInvite(i.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}