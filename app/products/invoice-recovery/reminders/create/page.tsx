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

  // ✅ NEW: manual reminder amount
  const [amount, setAmount] = useState("");

  const [preview, setPreview] = useState<EmailPreview | null>(null);
  const [tab, setTab] = useState<"text" | "html">("text");

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);

  /* =========================
     LOAD INVOICES
  ========================= */
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const res = await axios.get("/api/invoices");
        setInvoices(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadInvoices();
  }, []);

  /* =========================
     FILTER
  ========================= */
  const filtered = invoices.filter((inv) =>
    inv.clientEmail.toLowerCase().includes(search.toLowerCase())
  );

  /* =========================
     GENERATE
  ========================= */
  const generate = async () => {
    if (!selected) return alert("Select client");
    if (!amount) return alert("Enter reminder amount");

    setLoading(true);

    try {
      const res = await axios.post("/api/reminders/preview", {
        amount: Number(amount), // ✅ use manual amount
      });

      setPreview(res.data);
    } catch {
      alert("Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SEND
  ========================= */
  const send = async () => {
    if (!selected || !preview) return alert("Missing data");

    setSending(true);

    try {
      await axios.post("/api/reminders/send-custom", {
        email: selected.clientEmail,
        html: preview.html,
        amount: Number(amount), // ✅ manual amount
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
          <div className="relative">
            <input
              placeholder="Search client email..."
              className="border p-2 w-full rounded"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />

            {showDropdown && (
              <div className="absolute z-10 w-full border mt-1 rounded max-h-40 overflow-y-auto bg-white shadow">

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
                        setShowDropdown(false);
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

          {/* TOTAL DUE (DISPLAY ONLY ✅) */}
          {selected && (
            <div className="bg-gray-50 border rounded p-3">
              <p className="text-sm text-gray-500">
                Total Amount Due
              </p>
              <p className="text-lg font-semibold text-black">
                ${selected.amount}
              </p>
            </div>
          )}

          {/* REMINDER AMOUNT INPUT ✅ */}
          <input
            type="number"
            placeholder="Enter reminder amount"
            className="border p-2 w-full rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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