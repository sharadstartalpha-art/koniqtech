"use client";

import { useState } from "react";

export default function WorkspaceSwitcher({ workspaces }: any) {
  const [loading, setLoading] = useState(false);

  async function switchWs(id: string) {
    setLoading(true);

    await fetch("/api/workspace/switch", {
      method: "POST",
      body: JSON.stringify({ workspaceId: id }),
    });

    window.location.reload();
  }

  return (
    <div className="space-y-2">
      {workspaces.map((w: any) => (
        <button
          key={w.id}
          onClick={() => switchWs(w.id)}
          className="block w-full text-left p-2 hover:bg-gray-100 rounded"
        >
          {w.name}
        </button>
      ))}
    </div>
  );
}