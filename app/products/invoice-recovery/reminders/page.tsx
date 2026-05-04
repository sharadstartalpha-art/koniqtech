"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import EmailViewerModal from "@/components/EmailViewerModal";

/* =========================
   TYPES
========================= */
type Reminder = {
  id: string;
  email: string;
  amount: number;
  type: "friendly" | "firm" | "final";
  status: "sent" | "failed";
  sentAt: string;
  mode: "manual" | "auto";
  html?: string;
};

/* =========================
   COMPONENT
========================= */
export default function RemindersPage() {
  const [data, setData] = useState<Reminder[]>([]);
  const [filtered, setFiltered] = useState<Reminder[]>([]);
  const [search, setSearch] = useState("");

  const [mode, setMode] = useState<"all" | "manual" | "auto">("all");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const [selectedReminder, setSelectedReminder] =
    useState<Reminder | null>(null);

  /* =========================
     LOAD DATA
  ========================= */
  const load = async () => {
    try {
      const res = await axios.get("/api/reminders");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* =========================
     FILTER (SEARCH + MODE)
  ========================= */
  useEffect(() => {
    let result = data;

    if (search) {
      result = result.filter((r) =>
        r.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (mode !== "all") {
      result = result.filter((r) => r.mode === mode);
    }

    setFiltered(result);
    setPage(1);
  }, [search, data, mode]);

  /* =========================
     PAGINATION
  ========================= */
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  /* =========================
     STYLES
  ========================= */
  const getStatusStyle = (status: string) => {
    if (status === "sent") return "bg-green-100 text-green-700";
    if (status === "failed") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const getModeStyle = (mode: string) => {
    return mode === "auto"
      ? "bg-purple-100 text-purple-700"
      : "bg-blue-100 text-blue-700";
  };

  /* =========================
     UI
  ========================= */
  return (
    <Layout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Reminders</h1>

          <a
            href="/products/invoice-recovery/reminders/create"
            className="bg-black text-white px-3 py-2 rounded-md text-sm hover:opacity-90"
          >
            + Send Reminder
          </a>
        </div>

        {/* FILTER BAR */}
        <div className="flex justify-between items-center gap-4 flex-wrap">

          {/* SEARCH */}
          <input
            placeholder="Search email..."
            className="border px-3 py-2 rounded-md text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* 🔥 CLEAN TOGGLE SWITCH */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {["all", "manual", "auto"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as any)}
                className={`px-4 py-1 text-sm rounded-md capitalize transition ${
                  mode === m
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* PER PAGE */}
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border px-2 py-1 text-sm rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-md overflow-hidden">

          {filtered.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              No reminders found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Mode</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginated.map((r, i) => (
                  <tr key={r.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{start + i + 1}</td>

                    <td className="p-3">{r.email}</td>

                    <td className="p-3 font-medium">${r.amount}</td>

                    <td className="p-3 capitalize">{r.type}</td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${getModeStyle(
                          r.mode
                        )}`}
                      >
                        {r.mode}
                      </span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${getStatusStyle(
                          r.status
                        )}`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {new Date(r.sentAt).toLocaleString()}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => setSelectedReminder(r)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* PAGINATION */}
          <div className="flex justify-between items-center p-3 text-sm">
            <span>
              Page {page} of {totalPages || 1}
            </span>

            <div className="space-x-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="border px-2 py-1 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((p) => p + 1)}
                className="border px-2 py-1 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* MODAL */}
        <EmailViewerModal
          isOpen={!!selectedReminder}
          onClose={() => setSelectedReminder(null)}
          email={selectedReminder?.email || ""}
          html={selectedReminder?.html || "<p>No content</p>"}
          date={selectedReminder?.sentAt || ""}
        />

      </div>
    </Layout>
  );
}