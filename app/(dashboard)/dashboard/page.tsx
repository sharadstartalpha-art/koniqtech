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
    <div className="grid grid-cols-4 gap-6">

      {/* 💰 Credits */}
      <div className="bg-white p-5 rounded-xl border">
        <h2 className="text-sm text-gray-500">Credits Left</h2>

        <p className="text-2xl font-bold">
          {user.balance?.amount ?? 0}
        </p>
      </div>

      {/* 📦 Plan */}
      <div className="bg-white p-5 rounded-xl border">
        <h2 className="text-sm text-gray-500">Current Plan</h2>

        <p className="text-xl font-semibold mt-1">
          {subscription?.plan?.name || "Free"}
        </p>

        <p className="text-sm text-gray-500">
          {subscription?.plan?.credits || 0} credits
        </p>
      </div>

      {/* 📊 Stats */}
      {[
        { title: "Users", value: "1" },
        { title: "Projects", value: "1" },
        { title: "Revenue", value: "$0" },
        { title: "Credits", value: user.balance?.amount ?? 0 },
      ].map((item) => (
        <div
          key={item.title}
          className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition"
        >
          <p className="text-sm text-gray-500">
            {item.title}
          </p>

          <h2 className="text-2xl font-semibold mt-2">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}