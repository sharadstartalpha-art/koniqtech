"use client";

import { useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

export default function RemindersPage() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // 🔮 Generate AI email
  const generate = async () => {
    try {
      if (!amount) {
        alert("Enter amount");
        return;
      }

      setLoading(true);
      setStatus(null);

      const res = await axios.post("/api/reminders/preview", {
        amount: Number(amount),
      });

      setPreview(res.data.content);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // 📧 Send email
  const send = async () => {
    try {
      if (!email || !preview) {
        alert("Email and content required");
        return;
      }

      setSending(true);
      setStatus(null);

      await axios.post("/api/reminders/send-custom", {
        email,
        content: preview,
      });

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl">
        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-6">
          Send Reminder
        </h1>

        {/* FORM */}
        <div className="bg-white p-6 rounded-xl shadow">
          <input
            type="email"
            placeholder="Client Email"
            className="border p-2 w-full mb-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            className="border p-2 w-full mb-3 rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* GENERATE BUTTON */}
          <button
            onClick={generate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Email"}
          </button>

          {/* PREVIEW */}
          {preview && (
            <>
              <textarea
                value={preview}
                onChange={(e) => setPreview(e.target.value)}
                className="border p-2 w-full h-40 mb-4 rounded"
              />

              <button
                onClick={send}
                disabled={sending}
                className="bg-black text-white px-4 py-2 rounded w-full disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Email"}
              </button>
            </>
          )}

          {/* STATUS */}
          {status === "success" && (
            <p className="mt-4 text-green-600 text-sm">
              ✅ Email sent successfully!
            </p>
          )}

          {status === "error" && (
            <p className="mt-4 text-red-500 text-sm">
              ❌ Something went wrong
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}