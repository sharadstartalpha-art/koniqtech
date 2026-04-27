"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

export default function DashboardPage() {
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

  const isSubscribed = false; // replace with DB later

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>

      {!isSubscribed ? (
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="mb-4 text-gray-600">
            You need a subscription to use this product.
          </p>

          <button
            onClick={subscribe}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            {loading ? "Redirecting..." : "Subscribe Now"}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-6">

            <div className="bg-blue-500 text-white p-6 rounded-xl">
              <p>Recovered</p>
              <h2 className="text-3xl font-bold">
                ${data.recovered || 0}
              </h2>
            </div>

            <div className="bg-green-500 text-white p-6 rounded-xl">
              <p>Pending</p>
              <h2 className="text-3xl font-bold">
                ${data.pending || 0}
              </h2>
            </div>

            <div className="bg-red-500 text-white p-6 rounded-xl">
              <p>Invoices</p>
              <h2 className="text-3xl font-bold">
                {data.count || 0}
              </h2>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}