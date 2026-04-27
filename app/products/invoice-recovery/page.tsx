"use client";

import { useState } from "react";

export default function InvoiceRecoveryPage() {
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    setLoading(true);

    const res = await fetch("/api/payments/checkout", {
      method: "POST",
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">
        Invoice Recovery System
      </h1>

      <p className="mb-6 text-gray-600">
        Automatically send reminders and recover unpaid invoices.
      </p>

      <button
        onClick={subscribe}
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded"
      >
        {loading ? "Redirecting..." : "Subscribe Now"}
      </button>
    </div>
  );
}