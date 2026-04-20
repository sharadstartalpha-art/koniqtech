"use client";

import { useEffect, useState } from "react";

export default function CollectPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState({
    scrape: false,
    enrich: false,
    dedup: false,
  });

  // ==============================
  // 📡 Fetch jobs
  // ==============================
  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 2000);
    return () => clearInterval(interval);
  }, []);

  // 🔒 Disable all buttons if any job is running
  const isRunning = jobs.some((j) => j.status === "running");

  // ==============================
  // 🚀 Run jobs
  // ==============================
  const runJob = async (type: "scrape" | "enrich" | "dedup") => {
    if (isRunning) return;

    setLoading((s) => ({ ...s, [type]: true }));

    try {
      await fetch(`/api/${type}`, {
        method: "POST",
        body: JSON.stringify(type === "scrape" ? { query } : {}),
      });
    } catch (err) {
      console.error(`Failed to run ${type}:`, err);
    }

    setTimeout(() => {
      fetchJobs();
      setLoading((s) => ({ ...s, [type]: false }));
    }, 1000);
  };

  // ==============================
  // 🎨 UI
  // ==============================
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Collect Data 🚀</h1>

      {/* 🔍 QUERY INPUT */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. SaaS founders in Germany"
        className="border p-2 w-full rounded"
      />

      {/* ACTION BUTTONS */}
      <div className="flex gap-2">
        <button
          disabled={loading.scrape || isRunning || !query}
          onClick={() => runJob("scrape")}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading.scrape ? "Running..." : "Run Scraper"}
        </button>

        <button
          disabled={loading.enrich || isRunning}
          onClick={() => runJob("enrich")}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading.enrich ? "Running..." : "Run Enrichment"}
        </button>

        <button
          disabled={loading.dedup || isRunning}
          onClick={() => runJob("dedup")}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading.dedup ? "Running..." : "Clean Duplicates"}
        </button>
      </div>

      {/* JOB STATUS */}
      <div>
        <h2 className="font-bold mb-2">Job Status</h2>

        {jobs.length === 0 && (
          <p className="text-gray-500">No jobs yet</p>
        )}

        {jobs.map((job) => (
          <div key={job.id} className="border p-3 rounded mb-3">
            {/* STATUS */}
            <p className="font-medium">
              {job.type} →{" "}
              <span
                className={
                  job.status === "running"
                    ? "text-yellow-500"
                    : job.status === "done"
                    ? "text-green-600"
                    : "text-red-500"
                }
              >
                {job.status}
              </span>
            </p>

            {/* 🔥 PROGRESS BAR */}
            <div className="w-full bg-gray-200 h-2 mt-2 rounded">
              <div
                className="bg-green-500 h-2 rounded transition-all"
                style={{ width: `${job.progress || 0}%` }}
              />
            </div>

            {/* 🧠 LOG */}
            <p className="text-sm mt-2 text-gray-600">
              {job.logs || "Waiting..."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}