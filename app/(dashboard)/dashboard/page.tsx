import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // ✅ get user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { balance: true },
  });

  // ✅ handle null user
  if (!user) {
    redirect("/login");
  }

  // ✅ get subscription
  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id },
    include: { plan: true },
  });

  return (
   <div className="space-y-6">

  {/* 💰 UPGRADE BANNER */}
  <div className="bg-gradient-to-r from-black to-gray-800 text-white p-6 rounded-xl flex justify-between items-center">
    <div>
      <h2 className="text-lg font-semibold">
        Upgrade your plan 🚀
      </h2>
      <p className="text-sm opacity-70">
        Get more credits and unlock features
      </p>
    </div>

    <a
      href="/pricing"
      className="bg-white text-black px-4 py-2 rounded-lg"
    >
      Upgrade
    </a>
  </div>

  {/* 📊 STATS GRID */}
  <div className="grid grid-cols-4 gap-6">

    {/* Credits */}
    <div className="bg-white p-5 rounded-xl border shadow-sm">
      <p className="text-sm text-gray-500">Credits</p>
      <h2 className="text-2xl font-bold mt-2">
        {user.balance?.amount ?? 0}
      </h2>
    </div>

    {/* Plan */}
    <div className="bg-white p-5 rounded-xl border shadow-sm">
      <p className="text-sm text-gray-500">Plan</p>
      <h2 className="text-xl font-semibold mt-2">
        {subscription?.plan?.name || "Free"}
      </h2>
    </div>

    {/* Projects */}
    <div className="bg-white p-5 rounded-xl border shadow-sm">
      <p className="text-sm text-gray-500">Projects</p>
      <h2 className="text-2xl font-bold mt-2">1</h2>
    </div>

    {/* Revenue */}
    <div className="bg-white p-5 rounded-xl border shadow-sm">
      <p className="text-sm text-gray-500">Revenue</p>
      <h2 className="text-2xl font-bold mt-2">$0</h2>
    </div>

  </div>

</div>
  );
}