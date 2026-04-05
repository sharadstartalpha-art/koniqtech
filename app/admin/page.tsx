"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Mon", users: 5, revenue: 20 },
  { name: "Tue", users: 8, revenue: 50 },
  { name: "Wed", users: 12, revenue: 80 },
  { name: "Thu", users: 15, revenue: 120 },
  { name: "Fri", users: 20, revenue: 200 },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard 📊</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p>Total Users</p>
          <h2 className="text-xl font-bold">120</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Total Revenue</p>
          <h2 className="text-xl font-bold">$2,340</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Total Leads Generated</p>
          <h2 className="text-xl font-bold">5,200</h2>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="mb-4 font-semibold">Growth Overview</h2>

        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="users" />
          <Line type="monotone" dataKey="revenue" />
        </LineChart>
      </div>
    </div>
  );
}