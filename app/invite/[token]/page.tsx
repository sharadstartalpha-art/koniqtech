"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function InvitePage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const acceptInvite = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/team/accept", {
      method: "POST",
      body: JSON.stringify({ token }),
    });

    const data = await res.json();

    if (data.error) {
      setError(data.error);
      setLoading(false);
      return;
    }

    // ✅ REDIRECT TO TEAM PAGE
    window.location.href = `/teams/${data.teamId}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Join Team 🚀</h1>

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={acceptInvite}
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded"
      >
        {loading ? "Joining..." : "Accept Invite"}
      </button>
    </div>
  );
}