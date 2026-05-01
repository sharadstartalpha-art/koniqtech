"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

type EmailPreview = {
  html: string;
  text: string;
};

type Invoice = {
  id: string;
  clientEmail: string;
  amount: number;
};

export default function CreateReminderPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState<Invoice | null>(null);

  const [preview, setPreview] = useState<EmailPreview | null>(null);
  const [tab, setTab] = useState<"text" | "html">("text");

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  /* =========================
     LOAD INVOICES
  ========================= */
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const res = await axios.get("/api/invoices");
        setInvoices(res.data);
      } catch (err) {
        console.error("LOAD INVOICES ERROR:", err);
      }
    };

    loadInvoices();
  }, []);

  /* =========================
     FILTER EMAILS
  ========================= */
  const filtered = invoices.filter((inv) =>
    inv.clientEmail.toLowerCase().includes(search.toLowerCase())
  );

  /* =========================
     GENERATE EMAIL
  ========================= */
  const generate = async () => {
    if (!selected) return alert("Select client");

    setLoading(true);

    try {
      const res = await axios.post("/api/reminders/preview", {
        amount: selected.amount,
      });

      setPreview(res.data);
    } catch {
      alert("Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SEND EMAIL
  ========================= */
  const send = async () => {
    if (!selected || !preview) return alert("Missing data");

    setSending(true);

    try {
      await axios.post("/api/reminders/send-custom", {
        email: selected.clientEmail,
        html: preview.html,
        amount: selected.amount,
      });

      alert("✅ Sent");

      window.location.href =
        "/products/invoice-recovery/reminders";
    } catch {
      alert("Failed to send");
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl space-y-6">

        <h1 className="text-xl font-semibold">
          Send Reminder
        </h1>

        <div className="bg-white border rounded-md p-6 space-y-4">

          {/* SEARCHABLE DROPDOWN */}
          <div>
            <input
              placeholder="Search client email..."
              className="border p-2 w-full rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <div className="border mt-1 rounded max-h-40 overflow-y-auto bg-white">
                {filtered.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">
                    No results
                  </div>
                ) : (
                  filtered.map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => {
                        setSelected(inv);
                        setSearch(inv.clientEmail);
                      }}
                      className="p-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {inv.clientEmail}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* TOTAL AMOUNT */}
          <input
            type="text"
            value={
              selected
                ? `$${selected.amount} (Total Due)`
                : ""
            }
            readOnly
            className="border p-2 w-full rounded bg-gray-50"
            placeholder="Amount will appear here"
          />

          {/* GENERATE */}
          <button
            onClick={generate}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Generating..." : "Generate Email"}
          </button>

          {/* PREVIEW */}
          {preview && (
            <>
              <div className="flex gap-2 border-b">
                <button
                  onClick={() => setTab("text")}
                  className={`px-3 py-1 ${
                    tab === "text" ? "border-b-2 font-semibold" : ""
                  }`}
                >
                  Text
                </button>

                <button
                  onClick={() => setTab("html")}
                  className={`px-3 py-1 ${
                    tab === "html" ? "border-b-2 font-semibold" : ""
                  }`}
                >
                  HTML
                </button>
              </div>

              {tab === "text" && (
                <textarea
                  value={preview.text}
                  readOnly
                  className="border p-2 w-full h-40 rounded"
                />
              )}

              {tab === "html" && (
                <>
                  <textarea
                    value={preview.html}
                    onChange={(e) =>
                      setPreview({
                        ...preview,
                        html: e.target.value,
                      })
                    }
                    className="border p-2 w-full h-40 rounded"
                  />

                  <div className="border p-3 rounded bg-gray-50">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: preview.html,
                      }}
                    />
                  </div>
                </>
              )}

              <button
                onClick={send}
                disabled={sending}
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