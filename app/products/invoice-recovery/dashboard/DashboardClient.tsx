"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Stats = {
  recovered: number;
  pending: number;
  count: number;
};

export default function DashboardClient() {
  const [data, setData] = useState<Stats>({
    recovered: 0,
    pending: 0,
    count: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();

    const interval = setInterval(load, 5000); // 🔥 less aggressive
    return () => clearInterval(interval);
  }, []);

  const load = async () => {
    try {
      const res = await axios.get("/api/dashboard/stats");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading dashboard...</div>;
  }

  return (
    <>
      {/* 📊 STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Recovered" value={`$${data.recovered}`} color="green" />
        <Card title="Pending" value={`$${data.pending}`} color="red" />
        <Card title="Invoices" value={data.count} />
      </div>

      {/* 📜 ACTIVITY */}
      <div className="bg-white mt-6 p-6 rounded-xl shadow">
        <h2 className="mb-4 font-semibold">Recent Activity</h2>
        <p className="text-gray-500">
          Payments & reminders will show here
        </p>
      </div>
    </>
  );
}

/* 📦 CARD */
function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color?: "green" | "red";
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>

      <h2
        className={`text-3xl font-bold ${
          color === "green"
            ? "text-green-600"
            : color === "red"
            ? "text-red-500"
            : ""
        }`}
      >
        {value}
      </h2>
    </div>
  );
}