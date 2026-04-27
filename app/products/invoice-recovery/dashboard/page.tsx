"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

export default function Page() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/dashboard/stats");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  // ✅ Subscribe
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

  const isSubscribed = false; // 🔥 replace with real DB check

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      {!isSubscribed ? (
        <div className="bg-white p-6 rounded shadow">
          <p className="mb-4">
            You need a subscription to use this product.
          </p>

          <button
            onClick={subscribe}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? "Redirecting..." : "Subscribe Now"}
          </button>
        </div>
      ) : (
        <>
          {/* ✅ CARDS */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <p className="text-sm text-gray-500">
                Recovered
              </p>
              <h2 className="text-2xl font-bold">
                ${data.recovered || 0}
              </h2>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <p className="text-sm text-gray-500">
                Pending
              </p>
              <h2 className="text-2xl font-bold">
                ${data.pending || 0}
              </h2>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <p className="text-sm text-gray-500">
                Invoices
              </p>
              <h2 className="text-2xl font-bold">
                {data.count || 0}
              </h2>
            </div>
          </div>

          {/* ✅ ACTION */}
          <div className="mt-6">
            <a
              href="/products/invoice-recovery/invoices/create"
              className="bg-black text-white px-4 py-2 rounded"
            >
              Add Invoice
            </a>
          </div>
        </>
      )}
    </Layout>
  );
}