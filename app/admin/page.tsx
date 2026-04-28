"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    axios.get("/api/admin/stats").then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <h1 className="text-lg font-medium text-gray-900">
        Overview
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">

        <Card title="Total Revenue" value={`$${data.revenue || 0}`} />
        <Card title="Users" value={data.users || 0} />
        <Card title="Active Subs" value={data.subs || 0} />
        <Card title="Invoices Paid" value={data.paid || 0} />

      </div>
    </div>
  );
}

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