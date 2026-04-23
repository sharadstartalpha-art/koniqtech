"use client";

import { useEffect, useState } from "react";

export default function CollectPage() {
  const [queries, setQueries] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // ==============================
  // 📡 Fetch Queries
  // ==============================
  const fetchQueries = async () => {
    try {
      const res = await fetch(`/api/query/list?page=${page}`);
      const data = await res.json();
      setQueries(data.queries || []);
    } catch (err) {
      console.error("❌ Failed to fetch queries:", err);
    }
  };

  useEffect(() => {
    fetchQueries();
    const interval = setInterval(fetchQueries, 2000);
    return () => clearInterval(interval);
  }, [page]);

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
      fetchQueries();
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // ==============================
  // 🚀 RUN SCRAPE
  // ==============================
  const runScrape = async (id: string) => {
    try {
      await fetch("/api/query/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queryId: id }),
      });

      alert("Scraping started 🚀");
      fetchQueries();
    } catch (err) {
      console.error(err);
    }
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
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Query</th>
              <th className="p-2">Scrape</th>
              <th className="p-2">Enrich</th>
              <th className="p-2">Dedup</th>
            </tr>
          </thead>

          <tbody>
            {queries.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  No queries yet
                </td>
              </tr>
            ) : (
              queries.map((q: any, i) => (
                <tr key={q.id} className="border-t">
                  <td className="p-2">{(page - 1) * 10 + i + 1}</td>
                  <td className="p-2">{q.text}</td>

                  <td className="p-2">
                    <button
                      onClick={() => runScrape(q.id)}
                      className="bg-black text-white px-2 py-1 rounded"
                    >
                      {q.scrapeStatus || "idle"}
                    </button>
                  </td>

                  <td className="p-2">{q.enrichStatus || "idle"}</td>
                  <td className="p-2">{q.dedupStatus || "idle"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}