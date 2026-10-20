"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Candidate = {
  id: string;
  businessName: string;
  website?: string | null;
  businessPhone?: string | null;
  industry?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  sourceUrl?: string | null;
  status?: string;
  matchScore?: number | null;
};

type SearchHistoryItem = {
  id: string;
  query: string;
  industry?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  status: string;
  resultCount: number;
  createdAt: string;
};

type LocationOption = {
  id: string;
  name: string;
  city: string;
  state?: string | null;
  country?: string | null;
  isDefault?: boolean;
};

const INDUSTRIES = [
  "HVAC",
  "Roofing",
  "Plumbing",
  "Landscaping",
  "Electrical",
  "Construction",
  "Cleaning",
  "Other",
];

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function locationText(candidate: Candidate) {
  return [candidate.city, candidate.state, candidate.country]
    .filter(Boolean)
    .join(", ") || candidate.address || "Location not listed";
}

export default function LeadFinderPage() {
  const [industry, setIndustry] = useState("HVAC");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("USA");
  const [keywords, setKeywords] = useState("");
  const [limit, setLimit] = useState("10");
 
  const [results, setResults] = useState<Candidate[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeSearchId, setActiveSearchId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

 
  const loadHistory = useCallback(async () => {
    try {
      const response = await fetch("/api/ai/lead-finder/search", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json().catch(() => ({}));
      setHistory(Array.isArray(data.searches) ? data.searches : []);
    } catch {
      // Search history is optional; the main page should remain usable if it fails.
    }
  }, []);

  useEffect(() => {
  void loadHistory();
}, [loadHistory]);

  const selectedOnScreen = useMemo(
    () => results.filter((candidate) => selected.includes(candidate.id)),
    [results, selected],
  );

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setResults([]);
    setSelected([]);
    setActiveSearchId(null);

    if (!city.trim()) {
      setError("Enter a city to search in, so your results are targeted.");
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch("/api/ai/lead-finder/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry,
          city: city.trim(),
          state: state.trim(),
          country: country.trim() || "USA",
          keywords: keywords.trim(),
          limit: Number(limit),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "The business search failed.");
      setResults(Array.isArray(data.results) ? data.results : []);
      setActiveSearchId(typeof data.searchId === "string" ? data.searchId : null);
      setNotice(
        Array.isArray(data.results) && data.results.length
          ? `Found ${data.results.length} result${data.results.length === 1 ? "" : "s"}. Review them and select the prospects you want to import.`
          : "No results returned. Try broader keywords or another city.",
      );
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The business search failed.");
    } finally {
      setIsSearching(false);
    }
  }

  function toggleCandidate(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleAll() {
    const allVisibleSelected = results.length > 0 && results.every((item) => selected.includes(item.id));
    setSelected((current) =>
      allVisibleSelected
        ? current.filter((id) => !results.some((item) => item.id === id))
        : Array.from(new Set([...current, ...results.map((item) => item.id)])),
    );
  }

 
async function handleImport() {
  setError("");
  setNotice("");

  if (!selected.length) {
    setError("Select at least one prospect.");
    return;
  }

  setIsImporting(true);

  try {
    const response = await fetch("/api/ai/lead-finder/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateIds: selected }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Could not save selected prospects.");
    }

    const savedIds: string[] = Array.isArray(data.saved)
      ? data.saved.map(
          (item: { candidateId: string }) => item.candidateId,
        )
      : [];

    setResults((current) =>
      current.map((item) =>
        savedIds.includes(item.id)
          ? { ...item, status: "qualified" }
          : item,
      ),
    );

    setSelected((current) =>
      current.filter((id) => !savedIds.includes(id)),
    );

    setNotice(data.message || "Prospects updated successfully.");
    await loadHistory();
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Could not save selected prospects.",
    );
  } finally {
    setIsImporting(false);
  }
}


  return (
    <main className="min-h-screen bg-slate-50/70 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> AI SALES TOOL
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">AI Lead Finder</h1>
           <p className="text-xs text-slate-500">
  Search · Review · Qualify
</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">✦</span>
            <div>
              <p className="font-semibold">Prospecting workspace</p>
              <p className="text-xs text-slate-500">Search · Review · Import</p>
            </div>
          </div>
        </header>

        {error && (
          <div role="alert" className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <p>{error}</p>
            <button type="button" onClick={() => setError("")} className="font-semibold" aria-label="Dismiss error">×</button>
          </div>
        )}
        {notice && (
          <div role="status" className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <p>{notice}</p>
            <button type="button" onClick={() => setNotice("")} className="font-semibold" aria-label="Dismiss message">×</button>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-bold">Find businesses</h2>
                <p className="mt-1 text-sm text-slate-500">Narrow your search to the market you want to reach.</p>
              </div>
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">New search</span>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Industry
                  <select className={inputClass} value={industry} onChange={(event) => setIndustry(event.target.value)}>
                    {INDUSTRIES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Number of results
                  <select className={inputClass} value={limit} onChange={(event) => setLimit(event.target.value)}>
                    <option value="5">5 businesses</option>
                    <option value="10">10 businesses</option>
                    <option value="15">15 businesses</option>
                    <option value="20">20 businesses</option>
                    <option value="25">25 businesses</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  City <span className="text-red-500">*</span>
                  <input className={inputClass} value={city} onChange={(event) => setCity(event.target.value)} placeholder="e.g. Dallas" required />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  State / region
                  <input className={inputClass} value={state} onChange={(event) => setState(event.target.value)} placeholder="e.g. Texas" />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Country
                  <input className={inputClass} value={country} onChange={(event) => setCountry(event.target.value)} placeholder="USA" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Extra keywords <span className="font-normal text-slate-400">(optional)</span>
                  <input className={inputClass} value={keywords} onChange={(event) => setKeywords(event.target.value)} placeholder="e.g. residential, family-owned" />
                </label>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-slate-500">Search results depend on the configured provider and publicly indexed information.</p>
                <button type="submit" disabled={isSearching} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {isSearching ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Searching…</> : <>⌕ Search businesses</>}
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-6">
           
<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <h2 className="text-base font-bold">Platform Prospects</h2>
  <p className="mt-1 text-sm leading-6 text-slate-500">
    Save selected businesses to KoniqTech's internal prospect database.
    These prospects will not become customer CRM leads.
  </p>

  <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3">
    <span className="text-sm text-slate-600">Selected prospects</span>
    <span className="text-lg font-bold tabular-nums">{selected.length}</span>
  </div>

  <button
    type="button"
    onClick={handleImport}
    disabled={isImporting || selected.length === 0}
    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
  >
    {isImporting
      ? "Saving prospects…"
      : `Qualify ${selected.length || "selected"} prospects`}
  </button>

  <p className="mt-3 text-xs leading-5 text-slate-400">
    Only Super Admin can access this platform prospecting workflow.
  </p>
</section>


            <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
              <h3 className="text-sm font-bold text-slate-900">A quick prospecting tip</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">Start with one city and one industry. Review each business before importing, then personalize your outreach instead of sending the same message to everyone.</p>
            </section>
          </aside>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-base font-bold">Search results</h2>
              <p className="mt-1 text-sm text-slate-500">{results.length ? `${results.length} businesses returned` : "Your discovered businesses will appear here."}</p>
            </div>
            {results.length > 0 && (
              <button type="button" onClick={toggleAll} className="self-start rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:self-auto">
                {results.every((item) => selected.includes(item.id)) ? "Deselect all" : "Select all"}
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-500">⌕</div>
              <h3 className="mt-4 text-sm font-bold">No prospects to show yet</h3>
              <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">Choose an industry and location above, then search to discover potential customers.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {results.map((candidate) => {
                const isSelected = selected.includes(candidate.id);
                const imported = candidate.status === "imported";
                return (
                  <article key={candidate.id} className={`flex gap-3 p-4 transition sm:gap-4 sm:px-6 ${isSelected ? "bg-blue-50/50" : "hover:bg-slate-50/70"}`}>
                    <div className="pt-1">
                      <input type="checkbox" aria-label={`Select ${candidate.businessName}`} checked={isSelected} disabled={imported} onChange={() => toggleCandidate(candidate.id)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-40" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{candidate.businessName}</h3>
                        {imported && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">Imported</span>}
                        {candidate.industry && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{candidate.industry}</span>}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{locationText(candidate)}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
                        {candidate.website && <a href={candidate.website} target="_blank" rel="noreferrer" className="break-all font-medium text-blue-700 hover:underline">Website ↗</a>}
                        {candidate.businessPhone && <a href={`tel:${candidate.businessPhone}`} className="text-slate-600 hover:text-slate-900">{candidate.businessPhone}</a>}
                        {candidate.sourceUrl && <a href={candidate.sourceUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-800">Source ↗</a>}
                      </div>
                    </div>
                    {typeof candidate.matchScore === "number" && (
                      <div className="hidden shrink-0 text-right sm:block">
                        <p className="text-lg font-bold tabular-nums">{candidate.matchScore}%</p>
                        <p className="text-xs text-slate-400">Match</p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
          {results.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-xs text-slate-500 sm:px-6">
              {selectedOnScreen.length} of {results.length} visible prospects selected{activeSearchId ? ` · Search ${activeSearchId}` : ""}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold">Recent searches</h2>
              <p className="mt-1 text-sm text-slate-500">Your latest saved prospecting activity.</p>
            </div>
            <button type="button" onClick={loadHistory} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Refresh</button>
          </div>
          {history.length === 0 ? (
            <p className="rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-500">No saved searches yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-left text-sm">
                <thead><tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400"><th className="pb-3 pr-4 font-semibold">Search</th><th className="pb-3 pr-4 font-semibold">Location</th><th className="pb-3 pr-4 font-semibold">Results</th><th className="pb-3 pr-4 font-semibold">Status</th><th className="pb-3 font-semibold">Date</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td className="max-w-[260px] py-3 pr-4 font-medium text-slate-800">{item.industry || item.query}</td>
                      <td className="py-3 pr-4 text-slate-500">{[item.city, item.state, item.country].filter(Boolean).join(", ") || "—"}</td>
                      <td className="py-3 pr-4 tabular-nums text-slate-700">{item.resultCount}</td>
                      <td className="py-3 pr-4"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium capitalize text-slate-600">{item.status}</span></td>
                      <td className="py-3 text-slate-500">{formatDate(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
