"use client";

import { useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

export default function CreateReminderPage() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const generate = async () => {
    if (!amount) return alert("Amount required");

    setLoading(true);

    try {
      const res = await axios.post("/api/reminders/preview", {
        amount: Number(amount),
      });

      setPreview(res.data.html); // ✅ FIX
    } catch {
      alert("Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!email || !preview) return alert("Missing data");

    setSending(true);

    try {
      await axios.post("/api/reminders/send-custom", {
        email,
        html: preview,
      });

      alert("✅ Sent");
      window.location.href = "/products/invoice-recovery/reminders";
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