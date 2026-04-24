"use client";

import { useEffect, useState } from "react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20); // ✅ LIMIT STATE
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // ==============================
  // 📡 Fetch Leads
  // ==============================
  const fetchLeads = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/leads?page=${page}&limit=${limit}&q=${query}` // ✅ UPDATED
      );
      const data = await res.json();

      setLeads(data.leads || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [page, limit, query]);

  const totalPages = Math.ceil(total / limit);

  // ==============================
  // 🎨 UI
  // ==============================
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Leads 📊</h1>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search leads..."
        className="border p-2 w-full rounded"
        value={query}
        onChange={(e) => {
          setPage(1);
          setQuery(e.target.value);
        }}
      />

      {/* 📊 INFO BAR */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Total Leads: {total}</p>

        {/* ✅ DROPDOWN */}
        <select
          value={limit}
          onChange={(e) => {
            setPage(1); // reset page
            setLimit(Number(e.target.value));
          }}
          className="border px-2 py-1 rounded"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={500}>500</option>
        </select>
      </div>

      {/* 📋 TABLE */}
      <div className="border rounded overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Company</th>
              <th className="p-2">Location</th>
              <th className="p-2">Query</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map((lead, i) => (
                <tr key={lead.id} className="border-t">
                  <td className="p-2">
                    {(page - 1) * limit + i + 1}
                  </td>
                  <td className="p-2">{lead.name}</td>
                  <td className="p-2">{lead.email}</td>
                  <td className="p-2">{lead.company}</td>
                  <td className="p-2">{lead.location}</td>

                  <td className="p-2 text-gray-600">
                    {lead.query?.text || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 PAGINATION */}
      <div className="flex justify-between items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-gray-600">
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}