"use client";

import {
  Database,
  Play,
  RotateCcw,
  Download,
  Upload,
  Sparkles,
} from "lucide-react";

interface DemoHeaderProps {
  loading?: boolean;
  onGenerateAll?: () => void;
  onReset?: () => void;
  onExport?: () => void;
  onImport?: () => void;
}

export default function DemoHeader({
  loading = false,
  onGenerateAll,
  onReset,
  onExport,
  onImport,
}: DemoHeaderProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-sm">

      <div className="flex flex-col gap-10 p-8 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}

        <div className="max-w-3xl">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">

            <Sparkles className="h-4 w-4 text-orange-400" />

            Developer Tools

          </div>

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-blue-600 p-4 shadow-lg">

              <Database className="h-10 w-10" />

            </div>

            <div>

              <h1 className="text-4xl font-bold tracking-tight">

                Demo Data Generator

              </h1>

              <p className="mt-2 text-slate-300">

                Generate realistic organizations, CRM records,
                technicians, inventory, invoices, AI conversations,
                payroll, reports and more for development,
                QA and product demonstrations.

              </p>

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="grid gap-3 sm:grid-cols-2">

          <button
            onClick={onGenerateAll}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="h-5 w-5" />

            {loading
              ? "Generating..."
              : "Generate Everything"}
          </button>

          <button
            onClick={onReset}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="h-5 w-5" />

            Reset Demo Data
          </button>

          <button
            onClick={onExport}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/20"
          >
            <Download className="h-5 w-5" />

            Export Data
          </button>

          <button
            onClick={onImport}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/20"
          >
            <Upload className="h-5 w-5" />

            Import Data
          </button>

        </div>

      </div>

      {/* Bottom Information */}

      <div className="grid border-t border-white/10 bg-black/10 md:grid-cols-4">

        <InfoItem
          title="Purpose"
          value="QA & Development"
        />

        <InfoItem
          title="Supported Modules"
          value="30+"
        />

        <InfoItem
          title="Industry Templates"
          value="Roofing • HVAC • Plumbing"
        />

        <InfoItem
          title="Estimated Time"
          value="< 2 Minutes"
        />

      </div>

    </section>
  );
}

interface InfoItemProps {
  title: string;
  value: string;
}

function InfoItem({
  title,
  value,
}: InfoItemProps) {
  return (
    <div className="border-white/10 p-6 md:border-r last:border-r-0">

      <p className="text-sm text-slate-400">

        {title}

      </p>

      <h3 className="mt-2 text-lg font-semibold">

        {value}

      </h3>

    </div>
  );
}