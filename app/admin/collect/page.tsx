export default function CollectPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Collect Data 🚀</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Step 1: Import / Scrape</h2>
          <p>Upload CSV or run LinkedIn scraping</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Step 2: Enrichment Pipeline</h2>
          <p>Auto find domain, email, verify</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Step 3: Deduplication</h2>
          <p>System auto-merges duplicates</p>
        </div>
      </div>
    </div>
  );
}