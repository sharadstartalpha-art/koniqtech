"use client";

import { useEffect, useState } from "react";

export default function CollectPage() {
  const [data, setData] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // ==============================
  // 📡 Fetch Query Stats
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

    // 🔄 Auto refresh every 2s
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
        alert("Failed to create query");
        return;
      }

      setQuery("");
      fetchData();
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

    alert("Search triggered 🔄");
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

    alert("Enrich triggered ⚡");
    fetchData();
  };

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

      {/* TABLE */}
      <div className="border rounded overflow-hidden">
        <table className="w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
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
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  No data yet
                </td>
              </tr>
            ) : (
              data.map((q: any) => (
                <tr key={q.id} className="border-t">
                  <td className="p-2">{q.text}</td>
                  <td className="p-2">{q.total}</td>
                  <td className="p-2">{q.withEmail}</td>
                  <td className="p-2">{q.withCompany}</td>
                  <td className="p-2">{q.finished}</td>

                  {/* ✅ Progress */}
                  <td className="p-2">
                    <div className="w-full bg-gray-200 h-2 rounded">
                      <div
                        className="bg-green-500 h-2 rounded transition-all duration-300"
                        style={{ width: `${q.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {q.progress || 0}%
                    </span>
                  </td>

                  {/* ✅ Actions */}
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => searchAgain(q.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      🔄 Search
                    </button>

                    <button
                      onClick={() => filterAgain(q.id)}
                      className="bg-purple-500 text-white px-2 py-1 rounded"
                    >
                      ⚡ Enrich
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}