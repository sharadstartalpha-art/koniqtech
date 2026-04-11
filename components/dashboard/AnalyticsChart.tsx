"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: { date: string; opens: number; clicks: number }[];
};

export default function AnalyticsChart({ data }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="font-semibold mb-4">Performance</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />

          <Line type="monotone" dataKey="opens" />
          <Line type="monotone" dataKey="clicks" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}