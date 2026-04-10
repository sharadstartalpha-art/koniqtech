"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUpgrade } from "@/components/UpgradeProvider";

type Lead = {
  id: string;
  name: string;
  email?: string;
  contactEmail?: string;
  company?: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setShowUpgrade } = useUpgrade();

  // ✅ Fetch leads
  const fetchLeads = async () => {
    const res = await fetch("/api/leads");
    const data = await res.json();
    setLeads(data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // ✅ Generate lead
  const handleGenerate = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/leads/generate", {
        method: "POST",
      });

      // 🚨 No credits
      if (res.status === 403) {
        setShowUpgrade(true); // 🔥 open modal
        setLoading(false);
        return;
      }

      await fetchLeads(); // refresh list
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">CRM Pipeline</h1>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          {loading ? "Generating..." : "Generate Lead"}
        </button>
      </div>

      {/* EMPTY STATE */}
      {leads.length === 0 && (
        <div className="bg-white border rounded-xl p-6 text-center text-gray-500">
          No leads yet. Generate your first lead 🚀
        </div>
      )}

      {/* LEADS LIST */}
      <div className="grid gap-4">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition"
          >
            <p className="font-semibold">{lead.name}</p>

            <p className="text-sm text-gray-500">
              {lead.contactEmail || lead.email}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              {lead.company || "No company"}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}