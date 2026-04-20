"use client";

export default function CollectPage() {
  const runScrape = async () => {
    await fetch("/api/scrape", { method: "POST" });
    alert("Scraping started 🚀");
  };

  const runEnrich = async () => {
    await fetch("/api/enrich", { method: "POST" });
    alert("Enrichment running ⚡");
  };

  const runDedup = async () => {
    await fetch("/api/dedup", { method: "POST" });
    alert("Deduplication done 🔥");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Collect Data 🚀</h1>

      <div className="grid grid-cols-1 gap-4">

        <div className="border p-4 rounded">
          <h2 className="font-bold">Step 1: Scrape</h2>
          <button
            onClick={runScrape}
            className="mt-2 bg-black text-white px-4 py-2 rounded"
          >
            Run LinkedIn Scraper
          </button>
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-bold">Step 2: Enrich</h2>
          <button
            onClick={runEnrich}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Run Enrichment
          </button>
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-bold">Step 3: Deduplicate</h2>
          <button
            onClick={runDedup}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            Clean Duplicates
          </button>
        </div>

      </div>
    </div>
  );
}