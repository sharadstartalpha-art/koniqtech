"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);

  const generateLead = async () => {
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
      
      // optional: refresh page
      window.location.reload();

    } catch (err) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <button
      onClick={generateLead}
      disabled={loading}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      {loading ? "Generating..." : "Generate Leads"}
    </button>
  );
}