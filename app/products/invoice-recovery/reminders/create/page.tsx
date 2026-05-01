"use client";

import { useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

type EmailPreview = {
  html: string;
  text: string;
};

export default function CreateReminderPage() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [preview, setPreview] = useState<EmailPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

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

      setPreview(res.data); // ✅ object { html, text }
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
        html: preview.html, // ✅ correct
        amount: Number(amount),
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

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Client Email"
            className="border p-2 w-full rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* AMOUNT */}
          <input
            type="number"
            placeholder="Amount"
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
              {/* HTML EDITOR */}
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

              {/* LIVE PREVIEW */}
              <div className="border p-3 rounded bg-gray-50">
                <p className="text-xs text-gray-500 mb-2">
                  Preview:
                </p>

                <div
                  dangerouslySetInnerHTML={{
                    __html: preview.html,
                  }}
                />
              </div>

              {/* SEND */}
              <button
                onClick={send}
                disabled={sending}
                className="bg-black text-white px-4 py-2 rounded w-full disabled:opacity-50"
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