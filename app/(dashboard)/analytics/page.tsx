import { prisma } from "@/lib/prisma";

export default async function AnalyticsPage() {
  const logs = await prisma.emailLog.findMany();

  const total = logs.length;
  const opened = logs.filter((l) => l.opened).length;
  const clicked = logs.filter((l) => l.clicked).length;

  const openRate = total ? ((opened / total) * 100).toFixed(1) : 0;
  const clickRate = total ? ((clicked / total) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold">Analytics 📊</h1>

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

    </div>
  );
}