import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";
import { redirect } from "next/navigation";

export default async function BillingHistoryPage() {
  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const payments = await prisma.subscriptionPayment.findMany({
    where: {
      orgId: session.user.orgId,
    },
    orderBy: {
      paidAt: "desc",
    },
  });

  return (
    <main className="mx-auto max-w-7xl p-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Billing History
        </h1>

        <p className="mt-2 text-slate-600">
          View all subscription payments made for your organization.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Date
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Amount
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Currency
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                PayPal Payment ID
              </th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No subscription payments found.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-t"
                >
                  <td className="px-6 py-4">
                    {payment.paidAt.toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    ${payment.amount.toString()}
                  </td>

                  <td className="px-6 py-4">
                    {payment.currency}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        payment.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-mono text-sm">
                    {payment.paypalPaymentId ?? "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}