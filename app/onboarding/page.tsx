"use client";

import { useState } from "react";

export default function Onboarding() {
  const [name, setName] = useState("");

  async function createWorkspace() {
    await fetch("/api/workspace/create", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    window.location.href = "/dashboard";
  }

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-bold">
        Create your workspace 🚀
      </h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full"
        placeholder="Workspace name"
      />

      <button
        onClick={createWorkspace}
        className="bg-black text-white px-4 py-2 rounded w-full"
      >
        Continue
      </button>
    </div>
  );
}