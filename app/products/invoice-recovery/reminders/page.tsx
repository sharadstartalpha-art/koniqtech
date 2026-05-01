"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

type Reminder = {
  id: string;
  email: string;
  amount: number;
  type: "friendly" | "firm" | "final";
  status: string;
  createdAt: string;
};

export default function RemindersPage() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [preview, setPreview] = useState("");

  const [data, setData] = useState<Reminder[]>([]);
  const [filtered, setFiltered] = useState<Reminder[]>([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  /* =========================
     📦 LOAD REMINDERS
  ========================= */
  const load = async () => {
    const res = await axios.get("/api/reminders/list");
    setData(res.data);
    setFiltered(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  /* =========================
     🔍 SEARCH
  ========================= */
  useEffect(() => {
    const result = data.filter((r) =>
      r.email.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
    setPage(1);
  }, [search, data]);

  /* =========================
     🔮 GENERATE EMAIL
  ========================= */
  const generate = async () => {
    if (!amount) return alert("Amount required");

    setLoading(true);

    try {
      const res = await axios.post("/api/reminders/preview", {
        amount: Number(amount),
      });

      // ✅ FIX: use html not object
      setPreview(res.data.html);
    } catch {
      alert("Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     📧 SEND EMAIL
  ========================= */
  const send = async () => {
    if (!email || !preview) return alert("Missing data");

    setSending(true);

    try {
      await axios.post("/api/reminders/send-custom", {
        email,
        html: preview,
      });

      alert("✅ Sent");
      setPreview("");
      setEmail("");
      setAmount("");

      load();
    } catch {
      alert("Failed to send");
    } finally {
      setSending(false);
    }
  };

  /* =========================
     📊 PAGINATION
  ========================= */
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <Layout>
      <div className="space-y-6">

        {/* HEADER */}
        <h1 className="text-xl font-semibold">Reminders</h1>

        {/* SEARCH + PER PAGE */}
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
            <option value={20}>20 / page</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((r, i) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{start + i + 1}</td>
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">${r.amount}</td>
                  <td className="p-3 capitalize">{r.type}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-between items-center p-3 text-sm">
            <span>
              Page {page} of {totalPages}
            </span>

            <div className="space-x-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="border px-2 py-1 rounded"
              >
                Prev
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="border px-2 py-1 rounded"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* =========================
           ⚙️ AUTO SETTINGS
        ========================= */}
        <div className="bg-white p-4 rounded-md border space-y-3">
          <h2 className="font-medium">Automation</h2>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" />
            Auto reminders (Day 1 / Day 3 / Day 7)
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked />
            Tone escalation (friendly → firm → final)
          </label>
        </div>

        {/* =========================
           ✉️ FORM (AFTER TABLE)
        ========================= */}
        <div className="bg-white p-6 rounded-md border space-y-4 max-w-xl">

          <h2 className="font-medium">Send Manual Reminder</h2>

          <input
            type="email"
            placeholder="Client Email"
            className="border p-2 w-full rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            className="border p-2 w-full rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={generate}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Generating..." : "Generate Email"}
          </button>

          {preview && (
            <>
              <textarea
                value={preview}
                onChange={(e) => setPreview(e.target.value)}
                className="border w-full h-40 p-2 rounded"
              />

              <button
                onClick={send}
                className="bg-black text-white px-4 py-2 rounded w-full"
              >
                {sending ? "Sending..." : "Send Email"}
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}