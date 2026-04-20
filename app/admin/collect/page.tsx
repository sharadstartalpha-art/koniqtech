"use client";

import { useState } from "react";

export default function CollectPage() {
  const [loading, setLoading] = useState({
    scrape: false,
    enrich: false,
    dedup: false,
  });

  const runScrape = async () => {
    setLoading((s) => ({ ...s, scrape: true }));
    await fetch("/api/scrape", { method: "POST" });
  };

  const runEnrich = async () => {
    setLoading((s) => ({ ...s, enrich: true }));
    await fetch("/api/enrich", { method: "POST" });
  };

  const runDedup = async () => {
    setLoading((s) => ({ ...s, dedup: true }));
    await fetch("/api/dedup", { method: "POST" });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Collect Data 🚀</h1>

      {/* SCRAPE */}
      <button
        disabled={loading.scrape}
        onClick={runScrape}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading.scrape ? "Running..." : "Run LinkedIn Scraper"}
      </button>

      {/* ENRICH */}
      <button
        disabled={loading.enrich}
        onClick={runEnrich}
        className="bg-blue-600 text-white px-4 py-2 rounded ml-2"
      >
        {loading.enrich ? "Running..." : "Run Enrichment"}
      </button>

      {/* DEDUP */}
      <button
        disabled={loading.dedup}
        onClick={runDedup}
        className="bg-green-600 text-white px-4 py-2 rounded ml-2"
      >
        {loading.dedup ? "Running..." : "Clean Duplicates"}
      </button>
    </div>
  );
}