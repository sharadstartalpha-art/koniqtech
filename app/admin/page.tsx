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
    <div className="p-6 grid grid-cols-4 gap-6">

      <Card title="Total Revenue" value={`$${data.revenue}`} />
      <Card title="Users" value={data.users} />
      <Card title="Active Subs" value={data.subs} />
      <Card title="Invoices Paid" value={data.paid} />

    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-6 shadow rounded">
      <p>{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}