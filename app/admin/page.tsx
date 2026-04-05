"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard 📊
      </h1>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="mb-4 font-semibold">
          Live SaaS Analytics
        </h2>


<div className="grid md:grid-cols-3 gap-4 mb-6">
  <div className="bg-white p-4 rounded shadow">
    <p>Total Users</p>
    <h2 className="text-xl font-bold">
      {data.reduce((a, b: any) => a + b.users, 0)}
    </h2>
  </div>

  <div className="bg-white p-4 rounded shadow">
    <p>Total Revenue</p>
    <h2 className="text-xl font-bold">
      $
      {data.reduce((a, b: any) => a + b.revenue, 0)}
    </h2>
  </div>

  <div className="bg-white p-4 rounded shadow">
    <p>Total Leads</p>
    <h2 className="text-xl font-bold">
      {data.reduce((a, b: any) => a + b.leads, 0)}
    </h2>
  </div>
</div>


        <LineChart width={700} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />

          <Line type="monotone" dataKey="users" />
          <Line type="monotone" dataKey="revenue" />
          <Line type="monotone" dataKey="leads" />
        </LineChart>
      </div>
    </div>
  );
}