"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardClient() {
  const [data, setData] = useState({
    recovered: 0,
    pending: 0,
    count: 0,
    insights: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, []);

  const load = async () => {
    try {
      const res = await axios.get("/api/dashboard/stats");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="grid grid-cols-3 gap-4">
        <Card title="Recovered" value={`$${data.recovered}`} />
        <Card title="Pending" value={`$${data.pending}`} />
        <Card title="Invoices" value={data.count} />
      </div>

      {/* AI INSIGHTS */}
      <div className="bg-white border border-gray-200 rounded-md p-5">
        <h2 className="text-sm font-medium mb-2">
          AI Insights
        </h2>

        <p className="text-sm text-gray-600 leading-relaxed">
          {data.insights || "No insights yet"}
        </p>
      </div>
    </div>
  );
}

/* CARD */
function Card({ title, value }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-md px-4 py-3">
      <p className="text-xs text-gray-500 mb-1">{title}</p>
      <h2 className="text-lg font-semibold text-gray-900">
        {value}
      </h2>
    </div>
  );
}