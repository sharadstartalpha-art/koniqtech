"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardClient({ user, leadsCount }: any) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const balance = user?.balance?.credits || 0;

  const handleGenerate = async () => {
    if (balance <= 0) {
      alert("No credits left");
      return;
    }

    setLoading(true);

    await fetch("/api/leads/generate", {
      method: "POST",
      body: JSON.stringify({
        projectId: user.projects?.[0]?.id, // simple default
      }),
    });

    router.refresh();
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Welcome back 🚀</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2>Leads Generated</h2>
          <p className="text-3xl font-bold">{leadsCount}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2>Credits Left</h2>
          <p className="text-3xl font-bold">{balance}</p>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded"
      >
        {loading ? "Generating..." : "Generate Leads"}
      </button>
    </div>
  );
}