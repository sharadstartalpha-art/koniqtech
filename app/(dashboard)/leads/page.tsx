"use client";

import { useState } from "react";
import { useUpgrade } from "@/components/UpgradeProvider";
import { useSession } from "next-auth/react";

type Lead = {
  id?: string;
  name: string;
  email: string;
  company?: string;
  score?: number;
};

export default function LeadsPage() {
  const sessionData = useSession();
const session = sessionData?.data;

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    industry: "",
    location: "",
    title: "",
  });

  const { openUpgrade } = useUpgrade();

  const generateLeads = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/leads/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (res.status === 403) {
        openUpgrade();
        return;
      }

      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Lead Generator 🚀</h1>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl border grid md:grid-cols-3 gap-4">
        <input
          placeholder="Industry"
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, industry: e.target.value })
          }
        />
        <input
          placeholder="Location"
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, location: e.target.value })
          }
        />
        <input
          placeholder="Job Title"
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, title: e.target.value })
          }
        />
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button
          onClick={generateLeads}
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          {loading ? "Generating..." : "Generate Leads"}
        </button>

        <button
          onClick={() => window.open("/api/leads/export")}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Export CSV 📥
        </button>
      </div>

      {/* RESULTS */}
      <div className="grid gap-4">
        {leads.map((lead) => (
          <div key={lead.id} className="p-4 bg-white rounded-xl border">

            {lead.score && (
              <p className="text-xs text-green-600">
                Score: {lead.score} 🔥
              </p>
            )}

            <p>{lead.name}</p>
            <p>{lead.email}</p>

            {/* EMAIL */}
            <button
              onClick={() =>
                fetch("/api/leads/email", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: lead.email,
                    name: lead.name,
                  }),
                })
              }
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded mt-2"
            >
              Email
            </button>

            {/* SEQUENCE */}
            <button
              onClick={() =>
                fetch("/api/sequences/start", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    userId: session?.user?.id,
                    email: lead.email,
                    name: lead.name,
                  }),
                })
              }
              className="text-sm bg-green-600 text-white px-3 py-1 rounded mt-2 ml-2"
            >
              Start Sequence 🚀
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}