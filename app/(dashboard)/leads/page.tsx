"use client";

import { useEffect, useState } from "react";
import { useTeamStore } from "@/lib/teamStore";
import toast from "react-hot-toast";
import ProjectSwitcher from "@/components/ProjectSwitcher";

export default function LeadsPage() {
  const { activeTeamId } = useTeamStore();

  const [leads, setLeads] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;

  // 🔄 LOAD
  const load = async () => {
    if (!activeTeamId) return;

    const [leadRes, campRes] = await Promise.all([
      fetch(`/api/leads?teamId=${activeTeamId}`),
      fetch(`/api/campaign`),
    ]);

    setLeads(await leadRes.json());
    setCampaigns(await campRes.json());
  };

  useEffect(() => {
    load();
  }, [activeTeamId]);

  // 🚀 GENERATE
  const generateLeads = async () => {
    if (!projectId) return toast.error("Select project");

    setLoading(true);

    const res = await fetch("/api/leads/generate", {
      method: "POST",
      body: JSON.stringify({
        teamId: activeTeamId,
        projectId,
        query,
      }),
    });

    const data = await res.json();

    if (data.error) toast.error(data.error);
    else {
      toast.success(`Generated ${data.count}`);
      load();
    }

    setLoading(false);
  };

  // ✅ SELECT
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // 🚀 ADD TO CAMPAIGN
  const addToCampaign = async () => {
    if (selected.length === 0) {
      return toast.error("Select leads first");
    }

    if (!selectedCampaign) {
      return toast.error("Select a campaign");
    }

    const res = await fetch("/api/campaign/add-leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        campaignId: selectedCampaign,
        leadIds: selected,
      }),
    });

    const data = await res.json();

    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success("Leads added to campaign 🚀");
      setSelected([]);
      setSelectedCampaign("");
    }
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

      <h1 className="text-2xl font-bold">Lead Engine 🚀</h1>

      <ProjectSwitcher onChange={setProjectId} />

      {/* INPUT */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search leads (e.g. SaaS founder USA)"
        className="border p-2 w-full rounded"
      />

      {/* ACTION BAR */}
      <div className="flex justify-between items-center">

        <div className="flex gap-3 items-center">

          <button
            onClick={generateLeads}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Generating..." : "Generate Leads 🤖"}
          </button>

          {/* 🎯 CAMPAIGN SELECT */}
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">Select Campaign</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={addToCampaign}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add to Campaign 📥
          </button>
        </div>

        {/* 🔍 SEARCH */}
        <input
          type="text"
          placeholder="Search in leads..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded w-64"
        />

      </div>

      {/* TABLE */}
      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3"></th>
              <th className="p-3">#</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Company</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((lead, i) => (
              <tr key={lead.id} className="border-t">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(lead.id)}
                    onChange={() => toggleSelect(lead.id)}
                  />
                </td>

                <td className="p-3">{start + i + 1}</td>
                <td className="p-3">{lead.email}</td>
                <td className="p-3">{lead.company || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>

        <span>
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