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
      console.error("Failed to fetch queries:", err);
    }
  };

  useEffect(() => {
    fetchQueries();
    const interval = setInterval(fetchQueries, 2000);
    return () => clearInterval(interval);
  }, [page]);

  // ==============================
  // ➕ Create Query
  // ==============================
  const createQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      setQuery("");
      fetchQueries();
    } catch (err) {
      console.error("Failed to create query:", err);
    }

    setLoading(false);
  };

  // ==============================
  // 🚀 Run Scraper (per query)
  // ==============================
  const runScrape = async (id: string) => {
    try {
      await fetch("/api/query/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ queryId: id }),
      });

      fetchQueries();
    } catch (err) {
      console.error("Failed to run scrape:", err);
    }
  };

  // ==============================
  // 🎨 UI
  // ==============================
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Collect Data 🚀</h1>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. SaaS founders in Germany"
          className="border p-2 w-full rounded"
        />

        <button
          onClick={createQuery}
          disabled={loading || !query}
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
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
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No queries yet
                </td>
              </tr>
            ) : (
              queries.map((q: any, i) => (
                <tr key={q.id} className="border-t">
                  <td className="p-2">{(page - 1) * 10 + i + 1}</td>

                  <td className="p-2 font-medium">{q.text}</td>

                  {/* 🕷 SCRAPE */}
                  <td className="p-2">
                    <button
                      disabled={q.scrapeStatus === "running"}
                      onClick={() => runScrape(q.id)}
                      className={`px-3 py-1 rounded text-white ${
                        q.scrapeStatus === "done"
                          ? "bg-green-600"
                          : q.scrapeStatus === "running"
                          ? "bg-yellow-500"
                          : "bg-black"
                      }`}
                    >
                      {q.scrapeStatus || "idle"}
                    </button>
                  </td>

                  {/* ✨ ENRICH */}
                  <td className="p-2">
                    <span
                      className={
                        q.enrichStatus === "done"
                          ? "text-green-600"
                          : q.enrichStatus === "running"
                          ? "text-yellow-500"
                          : "text-gray-500"
                      }
                    >
                      {q.enrichStatus || "idle"}
                    </span>
                  </td>

                  {/* 🧹 DEDUP */}
                  <td className="p-2">
                    <span
                      className={
                        q.dedupStatus === "done"
                          ? "text-green-600"
                          : q.dedupStatus === "running"
                          ? "text-yellow-500"
                          : "text-gray-500"
                      }
                    >
                      {q.dedupStatus || "idle"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
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
    </div>
  );
}