"use client";

import { useEffect, useState } from "react";

export default function CollectPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    scrape: false,
    enrich: false,
    dedup: false,
  });

  // ==============================
  // 📡 Fetch jobs
  // ==============================
  const fetchJobs = async () => {
    const res = await fetch("/api/jobs");
    const data = await res.json();
    setJobs(data);
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 2000);
    return () => clearInterval(interval);
  }, []);

  // ==============================
  // 🚀 Run jobs
  // ==============================
  const runJob = async (type: "scrape" | "enrich" | "dedup") => {
    setLoading((s) => ({ ...s, [type]: true }));

    await fetch(`/api/${type}`, { method: "POST" });

    // slight delay to let DB update
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

      {/* ACTION BUTTONS */}
      <div className="flex gap-2">
        <button
          disabled={loading.scrape}
          onClick={() => runJob("scrape")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading.scrape ? "Running..." : "Run Scraper"}
        </button>

        <button
          disabled={loading.enrich}
          onClick={() => runJob("enrich")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading.enrich ? "Running..." : "Run Enrichment"}
        </button>

        <button
          disabled={loading.dedup}
          onClick={() => runJob("dedup")}
          className="bg-green-600 text-white px-4 py-2 rounded"
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
          <div
            key={job.id}
            className="border p-3 rounded mb-2 flex justify-between"
          >
            <span className="font-medium">{job.type}</span>

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
          </div>
        ))}
      </div>
    </div>
  );
}