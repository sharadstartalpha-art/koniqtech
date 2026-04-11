import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      subscriptions: { include: { plan: true } },
      payments: true,
      balance: true,
    },
  });

  if (!user) redirect("/login");

  const subscription = user.subscriptions[0];

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold">Billing 💳</h1>

      {/* PLAN */}
      <div className="bg-white border rounded-xl p-6 flex justify-between">
        <div>
          <p className="text-sm text-gray-500">Current Plan</p>
          <h2 className="text-xl font-semibold">
            {subscription?.plan?.name || "Free"}
          </h2>
          <p className="text-gray-500">
            {subscription?.plan?.credits || 0} credits
          </p>
        </div>

        <a
          href="/pricing"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Upgrade
        </a>
      </div>

      {/* CREDITS */}
      <div className="bg-white border rounded-xl p-6">
        <p className="text-sm text-gray-500">Credits Remaining</p>
        <p className="text-2xl font-bold mt-2">
          {user.balance?.amount ?? 0}
        </p>
      </div>

      {/* INVOICES */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Invoices</h2>

        {user.payments.length === 0 ? (
          <p className="text-gray-500 text-sm">No invoices yet</p>
        ) : (
          user.payments.map((p) => (
            <div
              key={p.id}
              className="flex justify-between text-sm border-b pb-2"
            >
              <span>${p.amount}</span>
              <span>{p.status}</span>
              <span>
                {new Date(p.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}