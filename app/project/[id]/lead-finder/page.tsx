"use client";

import { useState } from "react";

export default function LeadFinderPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    await fetch("/api/leads/generate", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
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
          onClick={generate}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
}