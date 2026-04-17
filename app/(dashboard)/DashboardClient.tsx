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
        projectId: user.projects?.[0]?.id,
      }),
    });

    router.refresh();
    setLoading(false);
  };

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Welcome back 🚀</h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-gray-500">Leads Generated</p>
          <h2 className="text-2xl font-bold">{leadsCount}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-gray-500">Credits Left</p>
          <h2 className="text-2xl font-bold">{balance}</h2>
        </div>

      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
      >
        {loading ? "Generating..." : "Generate Leads"}
      </button>
    </div>
  );
}