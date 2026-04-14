"use client";

import { useEffect, useState } from "react";
import KPI from "@/components/dashboard/KPI";
import RevenueChart from "@/components/charts/RevenueChart";
import UserChart from "@/components/charts/UserChart";

export default function DashboardClient() {
  const [data, setData] = useState<any>({});

  // ✅ REAL-TIME POLLING HERE
  useEffect(() => {
    const load = () => {
      fetch("/api/admin/analytics/kpi")
        .then((res) => res.json())
        .then(setData);
    };

    load();

    const interval = setInterval(load, 5000); // 🔥 every 5 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* KPI */}
      <div className="grid grid-cols-4 gap-6 mt-6">
        <KPI title="Revenue" value={`$${data.revenue || 0}`} />
        <KPI title="Users" value={data.users || 0} />
        <KPI title="Credits Used" value={data.creditsUsed || 0} />
        <KPI title="Active Subs" value={data.subs || 0} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <RevenueChart />
        <UserChart />
      </div>
    </>
  );
}