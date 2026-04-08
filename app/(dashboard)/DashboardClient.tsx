"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardClient({ user, leadsCount = 0 }: any) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const balance = user?.balance?.balance || 0;

  const handleGenerate = async () => {
    if (balance <= 0) {
      alert("No credits left");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/leads/generate", {
        method: "POST",
      });

      const data = await res.json();
      console.log("API RESPONSE:", data); // 🔥 DEBUG

      router.refresh(); // ✅ refresh server data
    } catch (err) {
      console.error("ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Welcome back 🚀</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Leads */}
        <div className="bg-white p-6 rounded shadow">
          <h2>Leads Generated</h2>
          <p className="text-3xl font-bold">{leadsCount}</p>
        </div>

        {/* Credits */}
        <div className="bg-white p-6 rounded shadow">
          <h2>Credits Left</h2>
          <p className="text-3xl font-bold">{balance}</p>
        </div>
      </div>

      {/* Button */}
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