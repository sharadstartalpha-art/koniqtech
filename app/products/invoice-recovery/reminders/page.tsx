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
  const [error, setError] = useState("");

  // 🔮 Generate email
  const generate = async () => {
    try {
      if (!amount) {
        setError("Amount is required");
        return;
      }

      setError("");
      setLoading(true);

      const res = await axios.post("/api/reminders/preview", {
        amount: Number(amount), // ✅ FIX
      });

      if (!res.data?.content) {
        throw new Error("No content returned");
      }

      setPreview(res.data.content);
    } catch (err) {
      console.error("Generate error:", err);
      setError("Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  // 📧 Send email
  const send = async () => {
    try {
      if (!email || !preview) {
        setError("Email and content required");
        return;
      }

      setError("");
      setSending(true);

      await axios.post("/api/reminders/send-custom", {
        email,
        content: preview,
      });

      alert("✅ Email sent!");
      setPreview("");
      setEmail("");
      setAmount("");
    } catch (err) {
      console.error("Send error:", err);
      setError("Failed to send email");
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-6">
          Send Reminder
        </h1>

        <div className="bg-white p-6 rounded-xl shadow">
          {/* EMAIL */}
          <input
            type="email"
            placeholder="Client Email"
            className="border p-2 w-full mb-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* AMOUNT */}
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
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4 w-full disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Email"}
          </button>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm mb-3">
              {error}
            </p>
          )}

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
        </div>
      </div>
    </Layout>
  );
}