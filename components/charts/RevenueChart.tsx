"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { useEffect, useState } from "react";

export default function RevenueChart() {
  const [data, setData] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = () => {
    fetch(`/api/admin/analytics/revenue?from=${from}&to=${to}`)
      .then((res) => res.json())
      .then(setData);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2 className="mb-4 font-semibold">Revenue</h2>

      {/* 🔥 FILTER */}
      <div className="flex gap-2 mb-4">
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <button onClick={load} className="bg-black text-white px-3">
          Filter
        </button>
      </div>

      <LineChart width={500} height={300} data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" />
      </LineChart>
    </div>
  );
}