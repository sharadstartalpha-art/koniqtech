"use client";

import { useState } from "react";

export default function LeadFinderPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!query) return;

    setLoading(true);

    const res = await fetch("/api/leads/generate", {
      method: "POST",
      body: JSON.stringify({ query }),
    });

    const data = await res.json();

    setLeads(data.leads); // ✅ IMPORTANT

    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Lead Finder</h1>

      <div className="flex gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find SaaS founders in USA"
          className="border px-4 py-2 rounded w-full"
        />

        <button
          onClick={handleGenerate}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* ✅ SHOW RESULTS */}
      <div className="space-y-3">
        {leads.map((lead, i) => (
          <div
            key={i}
            className="p-4 border rounded bg-white shadow-sm"
          >
            <p className="font-semibold">{lead.name}</p>
            <p className="text-gray-500 text-sm">{lead.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}