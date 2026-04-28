"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardClient() {
  const [data, setData] = useState({
    recovered: 0,
    pending: 0,
    count: 0,
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

      {/* 🔥 PAGE TITLE */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your invoices and payments
        </p>
      </div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-3 gap-4">
        <Card title="Recovered" value={`$${data.recovered}`} />
        <Card title="Pending" value={`$${data.pending}`} />
        <Card title="Invoices" value={data.count} />
      </div>

      {/* 📜 ACTIVITY */}
      <div className="bg-white border border-gray-200 rounded-md p-5">
        <h2 className="text-sm font-medium text-gray-900 mb-2">
          Recent Activity
        </h2>

        <p className="text-sm text-gray-500">
          Payments and reminders will appear here.
        </p>
      </div>
    </div>
  );
}

/* 🔥 CARD (RESEND STYLE) */
function Card({ title, value }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-md px-4 py-4">
      <p className="text-xs text-gray-500 mb-1">
        {title}
      </p>

      <h2 className="text-xl font-semibold text-gray-900">
        {value}
      </h2>
    </div>
  );
}