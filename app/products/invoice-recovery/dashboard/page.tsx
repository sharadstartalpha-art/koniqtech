"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Invoice = {
  id: string;
  amount: number;
};

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get("/api/invoices/list");
      setInvoices(res.data);
    } catch (err) {
      console.error("Failed to fetch invoices", err);
    }
  };

  // ✅ CLEAN SUBSCRIBE FUNCTION
  const subscribe = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/payments/subscribe", {
        method: "POST",
      });

      const data = await res.json();

      console.log("SUBSCRIBE RESPONSE:", data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Payment error");
      }
    } catch (err) {
      console.error("SUBSCRIBE ERROR:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const total = invoices.reduce((sum, i) => sum + i.amount, 0);

  const isSubscribed = false; // 🔥 replace with DB check later

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Dashboard
      </h1>

      {!isSubscribed ? (
        <div className="mb-6">
          <p className="mb-4">
            You need a subscription to use this product.
          </p>

          <button
            onClick={subscribe}
            disabled={loading}
            className="bg-black text-white px-4 py-2"
          >
            {loading ? "Redirecting..." : "Subscribe Now"}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded">
              Total: ${total}
            </div>

            <div className="p-4 border rounded">
              Invoices: {invoices.length}
            </div>
          </div>

          <a
            href="/products/invoice-recovery/invoices/create"
            className="bg-black text-white px-4 py-2"
          >
            Add Invoice
          </a>
        </>
      )}
    </div>
  );
}