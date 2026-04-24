"use client";

import { useEffect, useState } from "react";

export default function CollectPage() {
  const [data, setData] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // ✅ NEW
  const [pageSize, setPageSize] = useState(10);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

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

  const createQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query.toLowerCase() }),
      });

      if (!res.ok) {
        showToast("❌ Failed");
        return;
      }

      setQuery("");
      fetchData();
      showToast("✅ Created");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const searchAgain = async (queryId: string) => {
    await fetch("/api/query/search-again", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queryId }),
    });

    showToast("🔄 Started");
    fetchData();
  };

  const enrichAgain = async (queryId: string) => {
    await fetch("/api/query/enrich-again", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queryId }),
    });

    showToast("⚡ Enrich");
    fetchData();
  };

  const filtered = data.filter((q) =>
    q.text.toLowerCase().includes(search.toLowerCase())
  );

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
          className="border p-2 w-full rounded"
          placeholder="e.g. SaaS founders in UK"
        />

        <button
          onClick={createQuery}
          disabled={loading || !query}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          {loading ? "..." : "Generate"}
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search query..."
        className="border px-3 py-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TOP BAR */}
      <div className="flex justify-between items-center">
        <span>Total Queries: {filtered.length}</span>

        {/* 🔥 PAGE SIZE */}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          className="border px-2 py-1"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={500}>500</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="border rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Query</th>
              <th className="p-2">Total</th>
              <th className="p-2">Progress</th>
              <th className="p-2">Scrape</th>
              <th className="p-2">Enrich</th>
              <th className="p-2">Dedup</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((q, index) => (
              <tr key={q.id} className="border-t">
                <td className="p-2">
                  {(page - 1) * pageSize + index + 1}
                </td>

                <td className="p-2">{q.text}</td>
                <td className="p-2">{q.total}</td>

                <td className="p-2">
                  <div className="w-32 bg-gray-200 h-2 rounded">
                    <div
                      className="bg-green-500 h-2 rounded"
                      style={{ width: `${q.progress || 0}%` }}
                    />
                  </div>
                </td>

                <td>{q.scrapeStatus}</td>
                <td>{q.enrichStatus}</td>
                <td>{q.dedupStatus}</td>

                <td className="flex gap-2">
                  <button
                    onClick={() => searchAgain(q.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    🔄
                  </button>

                  <button
                    onClick={() => enrichAgain(q.id)}
                    className="bg-purple-500 text-white px-2 py-1 rounded"
                  >
                    ⚡
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex gap-2">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Prev
        </button>

        <button onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded">
          {toast}
        </div>
      )}
    </div>
  );
}