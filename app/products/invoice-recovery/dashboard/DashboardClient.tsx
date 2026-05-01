"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type DashboardData = {
  recovered: number;
  pending: number;
  count: number;
  insights: string;
};

export default function DashboardClient() {
  const [data, setData] = useState<DashboardData>({
    recovered: 0,
    pending: 0,
    count: 0,
    insights: "",
  });

  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD DATA
  ========================= */
  const load = async () => {
    try {
      const res = await axios.get("/api/dashboard/stats");
      setData(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     AUTO REFRESH (LIVE DASHBOARD)
  ========================= */
  useEffect(() => {
    load();

    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your invoices and payments
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <StatCard
          title="Recovered"
          value={`$${data.recovered}`}
          color="green"
        />

        <StatCard
          title="Pending"
          value={`$${data.pending}`}
          color="red"
        />

        <StatCard
          title="Invoices"
          value={data.count}
          color="default"
        />

      </div>

      {/* AI INSIGHTS */}
      <div className="bg-white border rounded-lg p-5">
        <p className="text-sm font-medium mb-2">
          AI Insights
        </p>

        <p className="text-sm text-gray-600 leading-relaxed">
          {data.insights || "No insights yet"}
        </p>
      </div>

    </div>
  );
}

/* =========================
   CARD COMPONENT
========================= */
function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color?: "green" | "red" | "default";
}) {
  const colorMap = {
    green: "text-green-600",
    red: "text-red-600",
    default: "text-gray-900",
  };

  return (
    <div className="bg-white border rounded-lg px-4 py-4 shadow-sm">
      <p className="text-xs text-gray-500 mb-1">
        {title}
      </p>

      <h2
        className={`text-xl font-semibold ${colorMap[color || "default"]}`}
      >
        {value}
      </h2>
    </div>
  );
}