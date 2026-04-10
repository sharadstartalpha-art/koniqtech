"use client";

import { useState, useEffect } from "react";
import { useUpgrade } from "@/components/UpgradeProvider";

type Lead = {
  id: string;
  name: string;
  email: string;
  company?: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    industry: "",
    location: "",
    title: "",
  });

  const { setShowUpgrade } = useUpgrade();

  const generateLeads = async () => {
    setLoading(true);

    const res = await fetch("/api/leads/generate", {
      method: "POST",
      body: JSON.stringify(filters),
    });

    if (res.status === 403) {
      setShowUpgrade(true);
      setLoading(false);
      return;
    }

    const data = await res.json();
    setLeads(data.leads);
    setLoading(false);
  };

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Lead Generator 🚀</h1>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl border grid md:grid-cols-3 gap-4">
        <input
          placeholder="Industry (e.g SaaS)"
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, industry: e.target.value })
          }
        />

        <input
          placeholder="Location (e.g USA)"
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, location: e.target.value })
          }
        />

        <input
          placeholder="Job Title (e.g CEO)"
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, title: e.target.value })
          }
        />
      </div>

      {/* BUTTON */}
      <button
        onClick={generateLeads}
        className="bg-black text-white px-6 py-2 rounded-lg"
      >
        {loading ? "Generating..." : "Generate Leads"}
      </button>

      {/* RESULTS */}
      <div className="grid gap-4">
        {leads.map((lead) => (
          <div key={lead.id} className="p-4 bg-white rounded-xl border">
            <p className="font-semibold">{lead.name}</p>
            <p className="text-sm text-gray-500">{lead.email}</p>
            <p className="text-sm">{lead.company}</p>
          </div>
        ))}
      </div>
    </div>
  );
}