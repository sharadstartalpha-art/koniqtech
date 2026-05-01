"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

type Reminder = {
  id: string;
  email: string;
  amount: number;
  type: "friendly" | "firm" | "final";
  status: "sent" | "failed";
  sentAt: string;
};

export default function RemindersPage() {
  const [data, setData] = useState<Reminder[]>([]);
  const [filtered, setFiltered] = useState<Reminder[]>([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  // 👇 NEW: modal state
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  /* =========================
     LOAD DATA
  ========================= */
  const load = async () => {
    try {
      const res = await axios.get("/api/reminders");
      setData(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* =========================
     SEARCH
  ========================= */
  useEffect(() => {
    const result = data.filter((r) =>
      r.email.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
    setPage(1);
  }, [search, data]);

  /* =========================
     PAGINATION
  ========================= */
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  /* =========================
     STATUS COLOR
  ========================= */
  const getStatusStyle = (status: string) => {
    if (status === "sent") {
      return "bg-green-100 text-green-700";
    }
    if (status === "failed") {
      return "bg-red-100 text-red-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  return (
    <Layout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            Reminders
          </h1>

          <a
            href="/products/invoice-recovery/reminders/create"
            className="bg-black text-white px-3 py-2 rounded-md text-sm"
          >
            + Send Reminder
          </a>
        </div>

        {/* SEARCH + LIMIT */}
        <div className="flex justify-between items-center">
          <input
            placeholder="Search email..."
            className="border px-3 py-2 rounded-md text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border px-2 py-1 text-sm rounded"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-md overflow-hidden">

          {filtered.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              No reminders yet
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginated.map((r, i) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3">
                      {start + i + 1}
                    </td>

                    <td className="p-3">
                      {r.email}
                    </td>

                    <td className="p-3">
                      ${r.amount}
                    </td>

                    <td className="p-3 capitalize">
                      {r.type}
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

                    {/* 👇 VIEW BUTTON */}
                    <td className="p-3">
                      <button
                        onClick={() => setSelectedEmail(r.email)}
                        className="text-blue-600 text-xs underline"
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

        {/* =========================
           MODAL
        ========================= */}
        {selectedEmail && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded w-[400px] shadow-lg">

              <h2 className="font-semibold mb-3">
                Email Details
              </h2>

              <p className="text-sm break-all">
                {selectedEmail}
              </p>

              <button
                onClick={() => setSelectedEmail(null)}
                className="mt-4 bg-black text-white px-3 py-2 rounded w-full"
              >
                Close
              </button>

            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}