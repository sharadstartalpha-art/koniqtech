"use client";

import { useEffect, useState } from "react";

export default function CollectPage() {
  const [data, setData] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ NEW STATES
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 5;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ==============================
  // 📡 Fetch Data
  // ==============================
  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/query-stats");
      const json = await res.json();
      setData(json || []);
    } catch (err) {
      console.error("❌ Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  // ==============================
  // ➕ CREATE QUERY
  // ==============================
  const createQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query }),
      });

      if (!res.ok) {
        showToast("❌ Failed to create query");
        return;
      }

      setQuery("");
      fetchData();
      showToast("✅ Query created");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // ==============================
  // 🔄 SEARCH AGAIN
  // ==============================
  const searchAgain = async (queryId: string) => {
    await fetch("/api/query/search-again", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queryId }),
    });

    showToast("🔄 Search started");
    fetchData();
  };

  // ==============================
  // ⚡ ENRICH AGAIN
  // ==============================
  const filterAgain = async (queryId: string) => {
    await fetch("/api/query/enrich-again", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queryId }),
    });

    showToast("⚡ Enrich started");
    fetchData();
  };

  // ==============================
  // 🔍 FILTER
  // ==============================
  const filtered = data.filter((q) =>
    q.text.toLowerCase().includes(search.toLowerCase())
  );

  // ==============================
  // 📄 PAGINATION
  // ==============================
  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Collect Data 🚀</h1>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. SaaS founders in UK"
          className="border p-2 w-full rounded"
        />

        <button
          onClick={createQuery}
          disabled={loading || !query}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          {loading ? "..." : "Generate"}
        </button>
      </div>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search query..."
        className="border px-3 py-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📊 TOTAL */}
      <div className="flex gap-6">
        <span>Total Queries: {filtered.length}</span>
      </div>

      {/* TABLE */}
      <div className="border rounded overflow-hidden">
        <table className="w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Query</th>
              <th className="p-2">Total</th>
              <th className="p-2">Email</th>
              <th className="p-2">Company</th>
              <th className="p-2">Finished</th>
              <th className="p-2">Progress</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center">
                  No data
                </td>
              </tr>
            ) : (
              paginated.map((q: any, index) => (
                <tr key={q.id} className="border-t">
                  {/* 🔢 SL NO */}
                  <td className="p-2">
                    {(page - 1) * pageSize + index + 1}
                  </td>

                  <td className="p-2">{q.text}</td>
                  <td className="p-2">{q.total}</td>
                  <td className="p-2">{q.withEmail}</td>
                  <td className="p-2">{q.withCompany}</td>
                  <td className="p-2">{q.finished}</td>

                  {/* 📊 Progress */}
                  <td className="p-2">
                    <div className="w-32 bg-gray-200 rounded h-2">
                      <div
                        className="bg-green-500 h-2 rounded transition-all duration-300"
                        style={{ width: `${q.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs">
                      {q.progress || 0}%
                    </span>
                  </td>

                  {/* ⚡ Actions */}
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => searchAgain(q.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      🔄
                    </button>

                    <button
                      onClick={() => filterAgain(q.id)}
                      className="bg-purple-500 text-white px-2 py-1 rounded"
                    >
                      ⚡
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <div className="flex gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="border px-3 py-1 rounded"
        >
          Prev
        </button>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="border px-3 py-1 rounded"
        >
          Next
        </button>
      </div>

      {/* 🔔 Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}