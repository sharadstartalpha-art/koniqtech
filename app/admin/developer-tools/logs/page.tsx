"use client";

import { useMemo, useState } from "react";

import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Database,
  Download,
  Eye,
  FileText,
  Filter,
  RefreshCw,
  Search,
  Server,
  Settings,
  Shield,
  Trash2,
  XCircle,
} from "lucide-react";

type LogLevel =
  | "Info"
  | "Warning"
  | "Error"
  | "Success";

type LogCategory =
  | "API"
  | "Auth"
  | "Queue"
  | "Storage"
  | "Email"
  | "System";

interface LogEntry {
  id: string;

  level: LogLevel;

  category: LogCategory;

  message: string;

  user: string;

  createdAt: string;
}

const logEntries: LogEntry[] = [
  {
    id: "1",

    level: "Success",

    category: "API",

    message: "GET /api/leads completed.",

    user: "admin@koniqtech.com",

    createdAt: "2026-08-06 09:30",
  },

  {
    id: "2",

    level: "Error",

    category: "Storage",

    message: "S3 upload failed.",

    user: "system",

    createdAt: "2026-08-06 09:42",
  },

  {
    id: "3",

    level: "Warning",

    category: "Queue",

    message: "Job retry scheduled.",

    user: "system",

    createdAt: "2026-08-06 09:55",
  },

  {
    id: "4",

    level: "Info",

    category: "Auth",

    message: "User logged in.",

    user: "owner@demo.com",

    createdAt: "2026-08-06 10:05",
  },

  {
    id: "5",

    level: "Success",

    category: "Email",

    message: "Invoice email delivered.",

    user: "sales@demo.com",

    createdAt: "2026-08-06 10:20",
  },
];

export default function LogsPage() {

  const [loading, setLoading] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

const [autoRefresh, setAutoRefresh] =
  useState(false);

const [showClearModal, setShowClearModal] =
  useState(false);

  const [selectedLevel, setSelectedLevel] =
    useState<LogLevel | "All">(
      "All"
    );

  const [selectedCategory, setSelectedCategory] =
    useState<
      LogCategory | "All"
    >("All");

  const [selectedLog, setSelectedLog] =
    useState<LogEntry | null>(
      null
    );

  const stats = useMemo(
    () => ({
      total:
        logEntries.length,

      errors:
        logEntries.filter(
          (log) =>
            log.level === "Error"
        ).length,

      warnings:
        logEntries.filter(
          (log) =>
            log.level ===
            "Warning"
        ).length,

      success:
        logEntries.filter(
          (log) =>
            log.level ===
            "Success"
        ).length,
    }),
    []
  );

  const filteredLogs =
    logEntries.filter((log) => {

      const matchesSearch =
        log.message
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        log.user
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesLevel =
        selectedLevel ===
          "All" ||
        log.level ===
          selectedLevel;

      const matchesCategory =
        selectedCategory ===
          "All" ||
        log.category ===
          selectedCategory;



      return (
        matchesSearch &&
        matchesLevel &&
        matchesCategory
      );

    });

  function refreshLogs() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  function getLevelColor(
    level: LogLevel
  ) {
    switch (level) {

      case "Success":
        return "bg-green-100 text-green-700";

      case "Warning":
        return "bg-yellow-100 text-yellow-700";

      case "Error":
        return "bg-red-100 text-red-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  }


  async function exportLogs() {
  try {
    setActionLoading(true);

    // TODO:
    // GET /api/admin/developer-tools/logs/export

    setSuccess(
      "Logs exported successfully."
    );
  } catch {
    setError(
      "Unable to export logs."
    );
  } finally {
    setActionLoading(false);
  }
}

async function downloadCsv() {
  try {
    setActionLoading(true);

    // TODO:
    // GET /api/admin/developer-tools/logs/csv

    setSuccess(
      "CSV downloaded successfully."
    );
  } catch {
    setError(
      "Unable to download CSV."
    );
  } finally {
    setActionLoading(false);
  }
}

async function clearLogs() {
  try {
    setActionLoading(true);

    // TODO:
    // DELETE /api/admin/developer-tools/logs

    setSuccess(
      "Logs cleared successfully."
    );
  } catch {
    setError(
      "Unable to clear logs."
    );
  } finally {
    setActionLoading(false);
  }
}

async function copyLog() {
  if (!selectedLog) return;

  await navigator.clipboard.writeText(
    JSON.stringify(
      selectedLog,
      null,
      2
    )
  );

  setSuccess(
    "Log copied to clipboard."
  );
}

const activityTimeline = [
  {
    id: 1,
    title: "Logs refreshed",
    description: "System logs synchronized successfully.",
    time: "2 minutes ago",
  },
  {
    id: 2,
    title: "CSV exported",
    description: "Application logs exported as CSV.",
    time: "10 minutes ago",
  },
  {
    id: 3,
    title: "JSON exported",
    description: "JSON log archive downloaded.",
    time: "18 minutes ago",
  },
  {
    id: 4,
    title: "Error detected",
    description: "Storage upload returned HTTP 500.",
    time: "26 minutes ago",
  },
];


    return (
    <div className="space-y-8">

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Header */}

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 p-8 text-white shadow-xl">

        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

          <div>

            <div className="mb-4 flex items-center gap-4">

              <div className="rounded-2xl bg-white/10 p-4">

                <FileText className="h-8 w-8" />

              </div>

              <div>

                <h1 className="text-4xl font-bold">
                  System Logs
                </h1>

                <p className="mt-2 text-slate-200">
                  Monitor API requests, authentication, storage, queue and system events.
                </p>

              </div>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={refreshLogs}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 font-medium hover:bg-white/20"
            >

              <RefreshCw
                className={`h-5 w-5 ${
                  loading ? "animate-spin" : ""
                }`}
              />

              Refresh

            </button>

          </div>

        </div>

      </section>

      {/* Statistics */}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <Database className="mb-4 h-8 w-8 text-blue-600" />

          <p className="text-sm text-slate-500">
            Total Logs
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.total}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <XCircle className="mb-4 h-8 w-8 text-red-600" />

          <p className="text-sm text-slate-500">
            Errors
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.errors}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <AlertCircle className="mb-4 h-8 w-8 text-yellow-600" />

          <p className="text-sm text-slate-500">
            Warnings
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.warnings}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <CheckCircle2 className="mb-4 h-8 w-8 text-green-600" />

          <p className="text-sm text-slate-500">
            Successful
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.success}
          </h3>

        </div>

      </section>

      {/* Filters */}

      <section className="rounded-2xl border bg-white shadow-sm">

        <div className="border-b p-6">

          <div className="flex items-center gap-3">

            <Filter className="h-6 w-6 text-blue-600" />

            <h2 className="text-2xl font-bold">
              Log Filters
            </h2>

          </div>

        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-3">

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Search
            </label>

            <div className="relative">

              <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search logs..."
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4"
              />

            </div>

          </div>

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Level
            </label>

            <select
              value={selectedLevel}
              onChange={(e) =>
                setSelectedLevel(
                  e.target
                    .value as
                    | LogLevel
                    | "All"
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >

              <option>All</option>
              <option>Info</option>
              <option>Success</option>
              <option>Warning</option>
              <option>Error</option>

            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Category
            </label>

            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(
                  e.target
                    .value as
                    | LogCategory
                    | "All"
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >

              <option>All</option>
              <option>API</option>
              <option>Auth</option>
              <option>Queue</option>
              <option>Storage</option>
              <option>Email</option>
              <option>System</option>

            </select>

          </div>

        </div>

      </section>

      {/* Logs Table */}

      <section className="space-y-8">

  {/* Logs Table */}

  <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

    <div className="border-b p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            System Logs
          </h2>

          <p className="mt-2 text-slate-500">
            Browse and inspect application logs.
          </p>

        </div>

        <button
          onClick={refreshLogs}
          className="rounded-xl border px-4 py-2 hover:bg-slate-100"
        >
          Refresh
        </button>

      </div>

    </div>

    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Level
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Category
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Message
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              User
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Time
            </th>

            <th className="px-6 py-4 text-right text-sm font-semibold">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {filteredLogs.map((log) => (

            <tr
              key={log.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="px-6 py-5">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getLevelColor(
                    log.level
                  )}`}
                >
                  {log.level}
                </span>

              </td>

              <td className="px-6 py-5">

                {log.category}

              </td>

              <td className="px-6 py-5 font-medium">

                {log.message}

              </td>

              <td className="px-6 py-5">

                {log.user}

              </td>

              <td className="px-6 py-5 text-center text-slate-500">

                {log.createdAt}

              </td>

              <td className="px-6 py-5">

                <div className="flex justify-end gap-2">

                  <button
                   onClick={() => {
  setSelectedLog(log);
}}
                    className="rounded-lg border p-2 hover:bg-blue-50"
                    title="View Details"
                  >

                    <Eye className="h-4 w-4 text-blue-600" />

                  </button>

                </div>

              </td>

            </tr>

          ))}

          {filteredLogs.length === 0 && (

            <tr>

              <td
                colSpan={6}
                className="py-12 text-center text-slate-500"
              >

                No logs found.

              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>

  </div>

  {/* Selected Log */}

  {selectedLog && (

    <div className="rounded-2xl border bg-white shadow-sm">

      <div className="border-b p-6">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            Log Details
          </h2>

          <button
            onClick={() =>
              setSelectedLog(null)
            }
            className="rounded-lg border px-4 py-2 hover:bg-slate-100"
          >
            Close
          </button>

        </div>

      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2">

        <div>

          <p className="text-sm text-slate-500">
            Log ID
          </p>

          <p className="mt-2 font-semibold">
            {selectedLog.id}
          </p>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            Level
          </p>

          <span
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getLevelColor(
              selectedLog.level
            )}`}
          >
            {selectedLog.level}
          </span>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            Category
          </p>

          <p className="mt-2 font-semibold">
            {selectedLog.category}
          </p>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            User
          </p>

          <p className="mt-2 font-semibold">
            {selectedLog.user}
          </p>

        </div>

        <div className="md:col-span-2">

          <p className="text-sm text-slate-500">
            Message
          </p>

          <div className="mt-2 rounded-xl border bg-slate-50 p-4">

            {selectedLog.message}

          </div>

        </div>

        <div className="md:col-span-2">

          <p className="text-sm text-slate-500">
            Created At
          </p>

          <p className="mt-2 font-semibold">
            {selectedLog.createdAt}
          </p>

        </div>

      </div>

    </div>

  )}

        </section>

           <section className="rounded-2xl border bg-white shadow-sm">

  <div className="border-b p-6">

    <h2 className="text-2xl font-bold">
      Log Actions
    </h2>

    <p className="mt-2 text-slate-500">
      Perform maintenance and export operations.
    </p>

  </div>

  <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">

    <button
      onClick={refreshLogs}
      disabled={loading}
      className="rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
    >

      <div className="flex items-center justify-center gap-2">

        <RefreshCw className="h-5 w-5" />

        Refresh Logs

      </div>

    </button>

    <button
      onClick={exportLogs}
      disabled={actionLoading}
      className="rounded-xl bg-green-600 px-5 py-4 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
    >

      <div className="flex items-center justify-center gap-2">

        <Download className="h-5 w-5" />

        Export JSON

      </div>

    </button>

    <button
      onClick={downloadCsv}
      disabled={actionLoading}
      className="rounded-xl bg-indigo-600 px-5 py-4 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
    >

      <div className="flex items-center justify-center gap-2">

        <Download className="h-5 w-5" />

        Export CSV

      </div>

    </button>

    <button
      onClick={copyLog}
      disabled={!selectedLog}
      className="rounded-xl bg-amber-600 px-5 py-4 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
    >

      Copy Selected Log

    </button>

    <button
      onClick={() =>
        setShowClearModal(true)
      }
      className="rounded-xl bg-red-600 px-5 py-4 font-semibold text-white hover:bg-red-700"
    >

      <div className="flex items-center justify-center gap-2">

        <Trash2 className="h-5 w-5" />

        Clear Logs

      </div>

    </button>

    <button
      onClick={() => {
        setSuccess("");
        setError("");
      }}
      className="rounded-xl border px-5 py-4 hover:bg-slate-100"
    >
      Clear Messages
    </button>

  </div>

  <div className="border-t p-6">

    <label className="flex items-center gap-3">

      <input
        type="checkbox"
        checked={autoRefresh}
        onChange={(e) =>
          setAutoRefresh(
            e.target.checked
          )
        }
        className="h-4 w-4"
      />

      <span className="font-medium">
        Enable Auto Refresh
      </span>

    </label>

  </div>

          </section>

          {showClearModal && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

  <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

    <div className="border-b p-6">

      <h2 className="text-xl font-bold text-red-600">

        Clear System Logs

      </h2>

      <p className="mt-3 text-slate-600">

        This action will remove all application logs.

        <br />

        This cannot be undone.

      </p>

    </div>

    <div className="flex justify-end gap-3 p-6">

      <button
        onClick={() =>
          setShowClearModal(false)
        }
        className="rounded-xl border px-5 py-2"
      >
        Cancel
      </button>

      <button
        onClick={async () => {

          await clearLogs();

          setShowClearModal(false);

        }}
        className="rounded-xl bg-red-600 px-5 py-2 text-white hover:bg-red-700"
      >
        Clear Logs
      </button>

    </div>

  </div>

</div>

)}

<section className="rounded-2xl border bg-white shadow-sm">

  <div className="border-b p-6">

    <h2 className="text-2xl font-bold">

      Recent Activity

    </h2>

    <p className="mt-2 text-slate-500">

      Recent actions performed in the logging system.

    </p>

  </div>

  <div className="divide-y">

    {activityTimeline.map((item) => (

      <div
        key={item.id}
        className="flex items-start gap-4 p-6 hover:bg-slate-50"
      >

        <div className="mt-1 rounded-full bg-blue-100 p-2">

          <Activity className="h-4 w-4 text-blue-600" />

        </div>

        <div className="flex-1">

          <div className="flex items-center justify-between">

            <h3 className="font-semibold">

              {item.title}

            </h3>

            <span className="text-sm text-slate-400">

              {item.time}

            </span>

          </div>

          <p className="mt-2 text-sm text-slate-500">

            {item.description}

          </p>

        </div>

      </div>

    ))}

  </div>

</section>

    </div>
  );
}