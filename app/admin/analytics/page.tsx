"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AnalyticsPage() {
  const [data, setData] = useState({
    revenue: 0,
    users: 0,
    subs: 0,
    paid: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await axios.get("/api/admin/stats");
      setData(res.data);
    } catch (err) {
      console.error("Analytics load error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-lg font-semibold">
          Analytics
        </h1>
        <p className="text-sm text-gray-500">
          Overview of your platform performance
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <Card
          title="Total Revenue"
          value={`$${data.revenue}`}
        />

        <Card
          title="Users"
          value={data.users}
        />

        <Card
          title="Active Subscriptions"
          value={data.subs}
        />

        <Card
          title="Invoices Paid"
          value={data.paid}
        />

      </div>

      {/* INSIGHTS (future ready) */}
      <div className="bg-white border rounded-md p-5">
        <h2 className="text-sm font-medium mb-2">
          Insights
        </h2>

        <p className="text-sm text-gray-500">
          Analytics insights will appear here (conversion rate, churn, growth).
        </p>
      </div>

    </div>
  );
}

/* CARD */
function Card({ title, value }: any) {
  return (
    <div className="bg-white border rounded-md p-4">
      <p className="text-xs text-gray-500 mb-1">
        {title}
      </p>
      <h2 className="text-lg font-semibold">
        {value}
      </h2>
    </div>
  );
}