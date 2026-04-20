"use client";

import { useEffect, useState } from "react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const fetchLeads = async () => {
  const res = await fetch(`/api/leads?page=${page}&q=${query}`);
  const data = await res.json();
  setLeads(data);
};

  useEffect(() => {
    fetchLeads();
  }, [page, query]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Leads 📊</h1>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search leads..."
        className="border p-2 mb-4 w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* 📋 TABLE */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Company</th>
            <th className="p-2 border">Location</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, i) => (
            <tr key={lead.id}>
              <td className="p-2 border">{(page - 1) * 10 + i + 1}</td>
              <td className="p-2 border">{lead.name}</td>
              <td className="p-2 border">{lead.email}</td>
              <td className="p-2 border">{lead.company}</td>
              <td className="p-2 border">{lead.location}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📄 PAGINATION */}
      <div className="flex gap-2 mt-4">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Prev
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}