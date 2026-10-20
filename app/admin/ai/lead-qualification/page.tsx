"use client";

import { useMemo, useState } from "react";

type Answers = {
  hasWebsite: boolean;
  hasBusinessPhone: boolean;
  hasBusinessEmail: boolean;
  targetIndustry: boolean;
  targetLocation: boolean;
  establishedBusiness: boolean;
  visibleGrowthPotential: boolean;
  likelyNeedsCRM: boolean;
  reachableDecisionMaker: boolean;
  hasValidOnlinePresence: boolean;
};

const INITIAL_ANSWERS: Answers = {
  hasWebsite: false,
  hasBusinessPhone: false,
  hasBusinessEmail: false,
  targetIndustry: false,
  targetLocation: false,
  establishedBusiness: false,
  visibleGrowthPotential: false,
  likelyNeedsCRM: false,
  reachableDecisionMaker: false,
  hasValidOnlinePresence: false,
};

const CRITERIA: { key: keyof Answers; label: string; points: number; group: string }[] = [
  { key: "hasWebsite", label: "Business has a working website", points: 10, group: "Business presence" },
  { key: "hasBusinessPhone", label: "Business phone number is available", points: 10, group: "Business presence" },
  { key: "hasBusinessEmail", label: "Business email is available and verified", points: 15, group: "Business presence" },
  { key: "hasValidOnlinePresence", label: "Online business details appear consistent", points: 10, group: "Business presence" },
  { key: "targetIndustry", label: "Matches a KoniqTech target industry", points: 15, group: "Fit" },
  { key: "targetLocation", label: "Located in a target USA/EU market", points: 10, group: "Fit" },
  { key: "establishedBusiness", label: "Appears to be an established operating business", points: 10, group: "Fit" },
  { key: "visibleGrowthPotential", label: "Shows signs of growth or operational complexity", points: 5, group: "Opportunity" },
  { key: "likelyNeedsCRM", label: "Has a plausible need for field-service CRM software", points: 10, group: "Opportunity" },
  { key: "reachableDecisionMaker", label: "Owner or decision-maker can be identified", points: 5, group: "Opportunity" },
];

function scoreLabel(score: number) {
  if (score >= 75) return { label: "High priority", style: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (score >= 50) return { label: "Medium priority", style: "bg-amber-50 text-amber-700 border-amber-200" };
  return { label: "Low priority", style: "bg-slate-100 text-slate-600 border-slate-200" };
}

export default function LeadQualificationPage() {
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("HVAC");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("USA");
  const [notes, setNotes] = useState("");
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [savedReport, setSavedReport] = useState<{
    name: string;
    industry: string;
    location: string;
    score: number;
    priority: string;
    notes: string;
  } | null>(null);
  const [error, setError] = useState("");

  const score = useMemo(
    () => CRITERIA.reduce((total, item) => total + (answers[item.key] ? item.points : 0), 0),
    [answers],
  );

  const priority = scoreLabel(score);

  const groupedCriteria = useMemo(() => {
    const groups: Record<string, typeof CRITERIA> = {};
    for (const criterion of CRITERIA) {
      (groups[criterion.group] ??= []).push(criterion);
    }
    return groups;
  }, []);

  function resetForm() {
    setBusinessName("");
    setIndustry("HVAC");
    setWebsite("");
    setPhone("");
    setEmail("");
    setCity("");
    setRegion("");
    setCountry("USA");
    setNotes("");
    setAnswers(INITIAL_ANSWERS);
    setError("");
    setSavedReport(null);
  }

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!businessName.trim()) {
      setError("Enter a business name.");
      return;
    }

    if (!city.trim() || !country.trim()) {
      setError("Enter the business city and country.");
      return;
    }

    setError(
      "The qualification has not been saved to the platform database. Connect this page to the verified internal prospect API before using it for persistent records.",
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/70 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              PLATFORM SALES INTELLIGENCE
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Lead Qualification
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
              Evaluate potential KoniqTech customers, assess their fit, and
              prioritize businesses for personalized outreach.
            </p>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            New assessment
          </button>
        </header>

        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
          <strong>Internal prospect workflow.</strong> This page is designed
          for KoniqTech platform prospecting. It does not create customer CRM
          leads. Database saving and loading existing prospects must be
          connected to the platform's verified API.
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900"
          >
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)]">
          <form onSubmit={handleSave} className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-base font-bold">Business information</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the details of the prospect you want to evaluate.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                  Business name *
                  <input
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. ABC Heating & Cooling"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Industry
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 outline-none focus:border-blue-500"
                  >
                    {["HVAC", "Roofing", "Plumbing", "Landscaping", "Electrical", "Construction", "Cleaning", "Other"].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Website
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-blue-500"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Business phone
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 ..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-blue-500"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Business email
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@example.com"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-blue-500"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  City *
                  <input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Dallas"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-blue-500"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  State / region
                  <input
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="Texas"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-blue-500"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                  Country *
                  <input
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="USA"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-blue-500"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-base font-bold">Qualification checklist</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Select only the criteria you have evidence to support.
                  The maximum score is 100 points.
                </p>
              </div>

              <div className="space-y-6">
                {Object.entries(groupedCriteria).map(([group, criteria]) => (
                  <div key={group}>
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                      {group}
                    </h3>
                    <div className="space-y-3">
                      {criteria.map((criterion) => (
                        <label
                          key={criterion.key}
                          className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 p-3.5 transition hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={answers[criterion.key]}
                            onChange={(e) =>
                              setAnswers((current) => ({
                                ...current,
                                [criterion.key]: e.target.checked,
                              }))
                            }
                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex-1 text-sm text-slate-700">
                            {criterion.label}
                          </span>
                          <span className="shrink-0 text-xs font-semibold text-slate-500">
                            +{criterion.points}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <label className="mt-6 block text-sm font-medium text-slate-700">
                Research notes
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record evidence, potential business needs, research sources, and possible outreach angles..."
                  className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </label>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save qualification
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Reset form
                </button>
              </div>
            </section>
          </form>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-base font-bold">Qualification score</h2>
              <p className="mt-1 text-sm text-slate-500">
                Based on the criteria selected above.
              </p>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-bold tracking-tight tabular-nums">
                  {score}
                </span>
                <span className="pb-1 text-sm text-slate-400">/ 100 points</span>
              </div>

              <div
                className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label="Qualification score"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={score}
              >
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${score}%` }}
                />
              </div>

              <div className={`mt-4 inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${priority.style}`}>
                {priority.label}
              </div>

              <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Business</span>
                  <span className="max-w-[60%] truncate font-medium">
                    {businessName || "Not entered"}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Industry</span>
                  <span className="font-medium">{industry}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Location</span>
                  <span className="max-w-[60%] text-right font-medium">
                    {[city, region, country].filter(Boolean).join(", ") || "Not entered"}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Criteria met</span>
                  <span className="font-medium">
                    {CRITERIA.filter((item) => answers[item.key]).length} / {CRITERIA.length}
                  </span>
                </div>
              </div>

              <p className="mt-5 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                This score is a prioritization aid, not a prediction of whether
                a business will purchase KoniqTech.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold">Suggested next action</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {score >= 75
                  ? "Research the decision-maker and prepare personalized outreach based on verified business needs."
                  : score >= 50
                    ? "Verify contact details and look for stronger evidence of product fit before prioritizing outreach."
                    : "Gather more reliable business information before spending time on outreach."}
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold">Scoring guide</h2>
              <div className="mt-3 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">High priority</span>
                  <span className="font-semibold text-emerald-700">75–100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Medium priority</span>
                  <span className="font-semibold text-amber-700">50–74</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Low priority</span>
                  <span className="font-semibold text-slate-600">0–49</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
