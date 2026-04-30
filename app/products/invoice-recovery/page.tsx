"use client";

import { useState } from "react";

export default function ProductPage() {
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/payments/subscribe", {
        method: "POST",
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Payment error");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Invoice Recovery System
      </h1>

      <p className="mb-6">
        Automate reminders and recover unpaid invoices easily.
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