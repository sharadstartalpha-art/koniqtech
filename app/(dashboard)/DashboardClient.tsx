"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UpgradeModal from "@/components/UpgradeModal";
import Logo from "@/components/Logo";

export default function DashboardClient({ user, leadsCount }: any) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const balance = user?.balance?.balance || 0;

 const handleGenerate = async () => {
  if (balance <= 0) {
    setShowUpgrade(true);
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("/api/leads/generate", {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("✅ Lead generated!");

    router.refresh(); // ✅ DO THIS (NOT reload)

  } catch (err) {
    alert("Something went wrong");
  }

  setLoading(false);
};

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <Logo />

        <div className="flex items-center gap-4">
          <span className="text-sm">
            Balance: <b>{balance}</b>
          </span>

          <button
            onClick={() => setShowUpgrade(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Upgrade
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="p-8 max-w-5xl mx-auto">

        <h1 className="text-2xl font-bold mb-6">
          Welcome back 🚀
        </h1>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Leads */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="font-semibold mb-2">Leads Generated</h2>
            <p className="text-3xl font-bold">{leadsCount}</p>
          </div>

          {/* Emails */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="font-semibold mb-2">Emails Sent</h2>
            <p className="text-3xl font-bold">0</p>
          </div>

          {/* Credits */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="font-semibold mb-2">Credits Left</h2>
            <p className="text-3xl font-bold">{balance}</p>
          </div>

        </div>

        {/* Button */}
        <div className="mt-10">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded"
          >
            {loading ? "Generating..." : "Generate Leads"}
          </button>
        </div>

      </div>

      {/* Modal */}
      {showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} />
      )}
    </div>
  );
}