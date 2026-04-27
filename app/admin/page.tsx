"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Stats = {
  revenue: number;
  users: number;
  mrr: number;
};

export default function AdminDashboard() {
  const [data, setData] = useState<Stats>({
    revenue: 0,
    users: 0,
    mrr: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/admin/stats");
        setData(res.data);
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          <div className="border p-4 rounded">
            <p className="text-gray-500">Revenue</p>
            <p className="text-xl font-bold">
              ${data.revenue}
            </p>
          </div>

          <div className="border p-4 rounded">
            <p className="text-gray-500">Users</p>
            <p className="text-xl font-bold">
              {data.users}
            </p>
          </div>

          <div className="border p-4 rounded">
            <p className="text-gray-500">MRR</p>
            <p className="text-xl font-bold">
              ${data.mrr}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}