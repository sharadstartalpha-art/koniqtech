import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // ✅ Session
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // ✅ Get user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { balance: true },
  });

  if (!user) {
    redirect("/login");
  }

  // ✅ Get subscription (🔥 FIXED)
  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
    include: { plan: true },
  });

  return (
    <div className="space-y-6">
      
      {/* 💳 CURRENT PLAN */}
      <div className="bg-white p-5 rounded-xl border">
        <h2 className="text-sm text-gray-500">Current Plan</h2>

        <p className="text-xl font-semibold mt-1">
          {subscription?.plan?.name || "Free"}
        </p>

        <p className="text-sm text-gray-500">
          {subscription?.plan?.credits || 0} credits
        </p>
      </div>

      {/* 💰 CREDIT BALANCE */}
      <div className="bg-white p-5 rounded-xl border">
        <h2 className="text-sm text-gray-500">Credits Balance</h2>

        <p className="text-2xl font-bold mt-2">
          {user.balance?.amount || 0}
        </p>
      </div>

    </div>
  );
}