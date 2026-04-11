import { getMRR, getChurnRate, getRevenueSeries } from "@/lib/analytics";
import AdminChart from "@/components/admin/AdminChart";

export default async function AnalyticsPage() {
  const mrr = await getMRR();
  const churn = await getChurnRate();
  const revenue = await getRevenueSeries();

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Analytics 📊
      </h1>

      {/* METRICS */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-white p-6 rounded-xl border">
          <p className="text-gray-500">MRR</p>
          <p className="text-2xl font-bold">${mrr}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <p className="text-gray-500">Churn</p>
          <p className="text-2xl font-bold">{churn}%</p>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <p className="text-gray-500">Growth</p>
          <p className="text-2xl font-bold">+12%</p>
        </div>

      </div>

      {/* CHART */}
      <AdminChart data={revenue} />

    </div>
  );
}