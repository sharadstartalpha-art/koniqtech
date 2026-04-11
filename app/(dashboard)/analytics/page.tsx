import { prisma } from "@/lib/prisma";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

export default async function AnalyticsPage() {
  const logs = await prisma.emailLog.findMany();

  // 📊 BASIC STATS
  const total = logs.length;
  const opened = logs.filter((l) => l.opened).length;
  const clicked = logs.filter((l) => l.clicked).length;

  const openRate = total ? ((opened / total) * 100).toFixed(1) : "0";
  const clickRate = total ? ((clicked / total) * 100).toFixed(1) : "0";

  // 📈 GROUP DATA FOR CHART
  const grouped: Record<string, { opens: number; clicks: number }> = {};

  logs.forEach((l) => {
    const date = new Date(l.createdAt).toLocaleDateString();

    if (!grouped[date]) {
      grouped[date] = { opens: 0, clicks: 0 };
    }

    if (l.opened) grouped[date].opens++;
    if (l.clicked) grouped[date].clicks++;
  });

  const chartData = Object.entries(grouped).map(([date, val]) => ({
    date,
    ...val,
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-10">

      <h1 className="text-2xl font-bold">Analytics 📊</h1>

      {/* 🔥 STATS */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-white p-6 rounded-xl border">
          <p className="text-gray-500">Total Emails</p>
          <p className="text-3xl font-bold">{total}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <p className="text-gray-500">Open Rate</p>
          <p className="text-3xl font-bold text-green-600">
            {openRate}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <p className="text-gray-500">Click Rate</p>
          <p className="text-3xl font-bold text-blue-600">
            {clickRate}%
          </p>
        </div>

      </div>

      {/* 📈 CHART */}
      <AnalyticsChart data={chartData} />

    </div>
  );
}