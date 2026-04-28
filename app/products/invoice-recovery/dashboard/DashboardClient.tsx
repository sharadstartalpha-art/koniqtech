"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardClient() {
  const [data, setData] = useState({
    recovered: 0,
    pending: 0,
    count: 0,
  });

  useEffect(() => {
    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, []);

  const load = async () => {
    const res = await axios.get("/api/dashboard/stats");
    setData(res.data);
  };

  return (
    <div className="space-y-6">

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6">
        <Card title="Recovered" value={`$${data.recovered}`} />
        <Card title="Pending" value={`$${data.pending}`} />
        <Card title="Invoices" value={data.count} />
      </div>

      {/* ACTIVITY */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-sm font-medium mb-3">
          Recent Activity
        </h2>
        <p className="text-gray-500 text-sm">
          Payments & reminders will show here
        </p>
      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white border rounded-lg p-5">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-semibold">{value}</h2>
    </div>
  );
}