"use client";

import { useState } from "react";

export default function Onboarding() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function createTeam() {
    if (!name) return;

    setLoading(true);

    await fetch("/api/team/create", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    window.location.href = "/dashboard";
  }

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-bold">
        Create your team 🚀
      </h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full rounded"
        placeholder="Team name"
      />

      <button
        onClick={createTeam}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Creating..." : "Continue"}
      </button>
    </div>
  );
}