"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function InvitePage() {
  const { token } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const acceptInvite = async () => {
    setLoading(true);
    setMessage("");

    const res = await fetch(`/api/invite/${token}`, {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed");
    } else {
      setMessage("✅ Joined successfully!");
      setTimeout(() => {
        router.push("/teams");
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="bg-white p-8 rounded-xl shadow text-center space-y-4">
        <h1 className="text-2xl font-bold">Join Team 🚀</h1>

        {message && (
          <p className="text-sm text-red-500">{message}</p>
        )}

        <button
          onClick={acceptInvite}
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded"
        >
          {loading ? "Joining..." : "Accept Invite"}
        </button>
      </div>
    </div>
  );
}