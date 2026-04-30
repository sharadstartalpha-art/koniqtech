"use client";

import { useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import { useParams } from "next/navigation";

export default function RemindersPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    try {
      if (!amount) {
        setError("Amount is required");
        return;
      }

      setError("");
      setLoading(true);

      const res = await axios.post("/api/reminders/preview", {
        amount: Number(amount),
      });

      setPreview(res.data.content);
    } catch {
      setError("Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    try {
      if (!email || !preview) {
        setError("Email and content required");
        return;
      }

      setSending(true);

      await axios.post("/api/reminders/send-custom", {
        email,
        content: preview,
      });

      alert("Email sent!");
      setPreview("");
      setEmail("");
      setAmount("");
    } catch {
      setError("Failed to send email");
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout slug={slug}>
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-6">Send Reminder</h1>

        <input
          type="email"
          placeholder="Client Email"
          className="border p-2 w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          className="border p-2 w-full mb-3"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={generate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 w-full mb-4"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {preview && (
          <>
            <textarea
              value={preview}
              onChange={(e) => setPreview(e.target.value)}
              className="border p-2 w-full h-40 mb-4"
            />

            <button
              onClick={send}
              disabled={sending}
              className="bg-black text-white px-4 py-2 w-full"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </>
        )}
      </div>
    </Layout>
  );
}