"use client";

import { useEffect, useState } from "react";
import { useTeamStore } from "@/lib/teamStore";
import toast from "react-hot-toast";
import ProjectSwitcher from "@/components/ProjectSwitcher";

export default function LeadsPage() {
  const { activeTeamId } = useTeamStore();

  const [leads, setLeads] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;

  // 🔄 LOAD LEADS
  const load = async () => {
    if (!activeTeamId) return;

    try {
      const res = await fetch(`/api/leads?teamId=${activeTeamId}`);
      const data = await res.json();
      setLeads(data || []);
    } catch {
      toast.error("Failed to load leads");
    }
  };

  useEffect(() => {
    load();
  }, [activeTeamId]);

  // 🚀 GENERATE LEADS
  const generateLeads = async () => {
    if (!activeTeamId) {
      toast.error("Select a team first");
      return;
    }

    if (!projectId) {
      toast.error("Select a project first");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/leads/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId: activeTeamId,
          projectId,
          query,
        }),
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(`Generated ${data.count} leads 🚀`);
        setQuery("");
        load();
      }
    } catch {
      toast.error("Generation failed");
    }

    setLoading(false);
  };

  // 🔍 FILTER
  const filtered = leads.filter((l) =>
    `${l.email} ${l.company || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 📄 PAGINATION
  const start = (page - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">Lead Engine 🚀</h1>

      {/* PROJECT SWITCHER */}
      <ProjectSwitcher onChange={(id) => setProjectId(id)} />

      {/* GENERATE INPUT */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search leads (e.g. SaaS founder USA)"
        className="border p-2 w-full rounded"
      />

      <button
        onClick={generateLeads}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Leads 🤖"}
      </button>

      {/* TABLE SEARCH */}
      <input
        type="text"
        placeholder="Search in leads..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // reset page on search
        }}
        className="border px-3 py-2 rounded w-full max-w-sm"
      />

      {/* TABLE */}
      {paginated.length === 0 ? (
        <p className="text-gray-500">No leads found</p>
      ) : (
        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Company</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((lead, i) => (
                <tr key={lead.id} className="border-t">
                  <td className="p-3">{start + i + 1}</td>
                  <td className="p-3">{lead.email}</td>
                  <td className="p-3">{lead.company || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          Page {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>

    </div>
  );
}