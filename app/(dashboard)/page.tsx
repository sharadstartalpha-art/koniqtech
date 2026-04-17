import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-gray-800">
        Dashboard 👋
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="p-6 bg-white rounded-xl border shadow-sm">
          <p className="text-gray-500">Total Leads</p>
          <h2 className="text-2xl font-bold">0</h2>
        </div>

        <div className="p-6 bg-white rounded-xl border shadow-sm">
          <p className="text-gray-500">Campaigns</p>
          <h2 className="text-2xl font-bold">0</h2>
        </div>

        <div className="p-6 bg-white rounded-xl border shadow-sm">
          <p className="text-gray-500">Replies</p>
          <h2 className="text-2xl font-bold">0</h2>
        </div>

      </div>
    </div>
  );
}