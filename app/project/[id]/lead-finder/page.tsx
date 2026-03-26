"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function LeadFinderPage() {
  const params = useParams();
  const projectId = params.id as string;

  if (!projectId) {
  return <div className="p-6">Loading...</div>;
}

  const [query, setQuery] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

const [credits, setCredits] = useState<any>(null);

useEffect(() => {
  fetch("/api/credits")
    .then((res) => res.json())
    .then(setCredits);
}, []);

  const exportCSV = async () => {
  const res = await fetch(`/api/leads/export?projectId=${projectId}`);
  const blob = await res.blob();
  

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leads.csv";
  a.click();
};

  // 🔁 fetch leads
 const fetchLeads = async () => {
  try {
    if (!projectId) return;

    const res = await fetch(`/api/leads?projectId=${projectId}`);

    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
    setLeads(data);
  } catch (err) {
    console.error("Fetch error:", err);
  }
};
 

useEffect(() => {
  if (!projectId) return;

  fetchLeads();

  const interval = setInterval(() => {
    if (!document.hasFocus()) return;
    fetchLeads();
  }, 3000);

  return () => clearInterval(interval);
}, [projectId]);

  // 🚀 generate leads
const generateLeads = async () => {
  if (!credits || credits.credits <= 0) {
    alert("No credits left. Please upgrade.");
    return;
  }

  setLoading(true);

  await fetch("/api/leads/generate", {
    method: "POST",
    body: JSON.stringify({ projectId, query }),
  });

  setLoading(false);
};

  // 📋 copy text
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  };





  return (
    <div className="p-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-4">Lead Finder</h1>

<button
  onClick={exportCSV}
  className="bg-green-600 text-white px-4 py-2 rounded" disabled={!leads.length}>
  Export CSV
</button>
      {/* INPUT */}
      <div className="flex gap-2 mb-6">
        <input
          className="border px-3 py-2 w-full rounded"
          placeholder="Find SaaS founders in Bangalore"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
  onClick={generateLeads}
  disabled={!credits}
  className="bg-black text-white px-4 py-2 rounded"
>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* TABLE */}
      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left sticky top-0">
            <tr>
              <th className="p-3">Company</th>
              <th className="p-3">Website</th>
              <th className="p-3">Email</th>
              <th className="p-3">Summary</th>
              <th className="p-3">Outreach</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t hover:bg-gray-50">
                {/* COMPANY */}
                <td className="p-3 font-medium">
                  {lead.company || "-"}
                </td>

                {/* WEBSITE */}
                <td className="p-3">
                  {lead.website ? (
                    <a
                      href={lead.website}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Visit
                    </a>
                  ) : (
                    "-"
                  )}
                </td>


<td className="p-3">
  {lead.email ? (
    <div className="flex gap-2 items-center">
      <span>{lead.email}</span>
      <button
        onClick={() => copy(lead.email)}
        className="text-xs text-blue-600"
      >
        Copy
      </button>
    </div>
  ) : (
    <span className="text-gray-400">Finding...</span>
  )}
</td>


                {/* SUMMARY */}
                <td className="p-3 max-w-xs">
                  {lead.enrichment?.summary || (
                    <span className="text-gray-400">Generating...</span>
                  )}
                </td>

                {/* OUTREACH */}
                <td className="p-3 max-w-xs">
                  {lead.enrichment?.summary ? (
                    <div className="flex gap-2 items-center">
                      <span className="truncate">
                        {lead.enrichment.summary.slice(0, 80)}...
                      </span>

                      <button
                        onClick={() =>
                          copy(lead.enrichment.summary)
                        }
                        className="text-xs text-blue-600"
                      >
                        Copy
                      </button>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>

                {/* STATUS */}
                <td className="p-3">
                  <StatusBadge status={lead.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 🎨 STATUS BADGE
function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    NEW: "bg-gray-200 text-gray-700",
    ENRICHING: "bg-yellow-200 text-yellow-800",
    ENRICHED: "bg-green-200 text-green-800",
    FAILED: "bg-red-200 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}