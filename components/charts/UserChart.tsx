"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { useEffect, useState } from "react";

export default function UserChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/admin/analytics/users")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h2 className="mb-4 font-semibold">User Growth</h2>

      <LineChart width={500} height={300} data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="users" />
      </LineChart>
    </div>
  );
}