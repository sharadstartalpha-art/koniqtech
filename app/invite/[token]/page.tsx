"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function InvitePage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const acceptInvite = async () => {
      try {
        const res = await fetch(`/api/invite/${token}`);
        const data = await res.json();

        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }

        // ✅ redirect after success
        window.location.href = "/dashboard";

      } catch (err) {
        console.error(err);
        setError("Something went wrong");
        setLoading(false);
      }
    };

    acceptInvite();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Join Team 🚀</h1>

      {error && <p className="text-red-500">{error}</p>}

      <button
        disabled
        className="bg-black text-white px-6 py-2 rounded"
      >
        {loading ? "Joining..." : "Failed"}
      </button>
    </div>
  );
}