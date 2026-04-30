"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardClient({ slug }: { slug: string }) {
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
  }, [slug]);

  const load = async () => {
    try {
      const res = await axios.get(`/api/dashboard/stats?slug=${slug}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card title="Recovered" value={`$${data.recovered}`} />
        <Card title="Pending" value={`$${data.pending}`} />
        <Card title="Invoices" value={data.count} />
      </div>

      <div className="bg-white border p-5 rounded-lg">
        <p className="text-sm font-medium mb-2">AI Insights</p>
        <p className="text-sm text-gray-600">
          {data.insights || "No insights yet"}
        </p>
      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <p className="text-xs text-gray-500">{title}</p>
      <h2 className="text-lg font-semibold">{value}</h2>
    </div>
  );
}