"use client";

import { useState } from "react";

export default function TeamPage() {
  const [email, setEmail] = useState("");

  async function invite() {
    await fetch("/api/team/invite", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    alert("Invite sent 🚀");
  }

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-bold">Team 👥</h1>

      <input
        placeholder="Invite email"
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full"
      />

      <button
        onClick={invite}
        className="bg-black text-white px-4 py-2"
      >
        Invite Member
      </button>
    </div>
  );
}