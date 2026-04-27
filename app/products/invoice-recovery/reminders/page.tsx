"use client";

import { useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

export default function RemindersPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const sendNow = async () => {
    try {
      setLoading(true);
      setStatus(null);

      await axios.get("/api/reminders/send");

      setStatus("success");
    } catch (error) {
      console.error("Reminder error:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl">
        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-6">
          Email Reminders
        </h1>

        {/* CARD */}
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="mb-4 text-gray-600">
            Automatically send reminders for unpaid invoices to your clients.
          </p>

          {/* BUTTON */}
          <button
            onClick={sendNow}
            disabled={loading}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reminders Now"}
          </button>

          {/* STATUS MESSAGE */}
          {status === "success" && (
            <p className="mt-4 text-green-600 text-sm">
              ✅ Reminders sent successfully!
            </p>
          )}

          {status === "error" && (
            <p className="mt-4 text-red-500 text-sm">
              ❌ Failed to send reminders. Try again.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}