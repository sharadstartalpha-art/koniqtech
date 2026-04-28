"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

type Stats = {
  recovered: number;
  pending: number;
  count: number;
};

export default function DashboardPage() {
  const [data, setData] = useState<Stats>({
    recovered: 0,
    pending: 0,
    count: 0,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/dashboard/stats");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setFetching(false);
    }
  };

  const subscribe = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/payments/subscribe", {
        method: "POST",
      });

      const result = await res.json();

      if (result.url) {
        window.location.href = result.url;
      } else {
        alert(result.error || "Payment error");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Replace with real DB check later
  const isSubscribed = false;

  return (
    <Layout>
      <div>
        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-8">
          Dashboard
        </h1>

        {!isSubscribed ? (
          <div className="bg-white p-6 rounded-xl shadow max-w-md">
            <p className="mb-4 text-gray-600">
              You need a subscription to use this product.
            </p>

            <button
              onClick={subscribe}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "Redirecting..." : "Subscribe Now"}
            </button>
          </div>
        ) : fetching ? (
          <div className="text-gray-500">Loading dashboard...</div>
        ) : (
          <>
            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card
                title="Recovered"
                value={`$${data.recovered}`}
                color="blue"
              />

              <Card
                title="Pending"
                value={`$${data.pending}`}
                color="green"
              />

              <Card
                title="Invoices"
                value={data.count}
                color="red"
              />
            </div>

            {/* ACTIVITY */}
            <div className="bg-white mt-6 p-6 rounded-xl shadow">
              <h2 className="mb-4 font-semibold">
                Recent Activity
              </h2>

              <p className="text-gray-500">
                Payments & reminders will show here
              </p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

/* CARD COMPONENT */
function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: "blue" | "green" | "red";
}) {
  const styles = {
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    red: "bg-red-500 text-white",
  };

  return (
    <div className={`${styles[color]} p-6 rounded-xl shadow`}>
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}