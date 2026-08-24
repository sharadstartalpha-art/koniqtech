import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function PaymentsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const payments = await prisma.payment.findMany({
    where: {
      orgId,
    },
    include: {
      invoice: true,
      customer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const totalReceived = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  )

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Payments
          </h1>

          <p className="text-slate-500 mt-2">
            Record and manage customer payments.
          </p>

        </div>

        <Link
          href="/payments/create"
          className="
            bg-emerald-600
            hover:bg-emerald-700
            text-white
            px-6
            py-3
            rounded-xl
          "
        >
          Record Payment
        </Link>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500">
            Total Payments
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {payments.length}
          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500">
            Amount Received
          </p>

          <h2 className="text-4xl font-bold mt-3 text-green-600">
            ₹{totalReceived.toLocaleString()}
          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500">
            Average Payment
          </p>

          <h2 className="text-4xl font-bold mt-3">

            ₹
            {payments.length
              ? (
                  totalReceived /
                  payments.length
                ).toFixed(2)
              : "0.00"}

          </h2>

        </div>

      </div>

      <div className="bg-white border rounded-3xl overflow-hidden">

        {payments.length === 0 ? (

          <div className="py-20 text-center">

            <p className="text-slate-500">
              No payments recorded.
            </p>

            <Link
              href="/payments/create"
              className="
                inline-block
                mt-6
                bg-emerald-600
                text-white
                px-6
                py-3
                rounded-xl
              "
            >
              Record First Payment
            </Link>

          </div>

        ) : (

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr className="text-left">

                <th className="p-5">
                  Customer
                </th>

                <th className="p-5">
                  Invoice
                </th>

                <th className="p-5">
                  Amount
                </th>

                <th className="p-5">
                  Method
                </th>

                <th className="p-5">
                  Date
                </th>

                <th className="p-5 text-right">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {payments.map(payment => (

                <tr
                  key={payment.id}
                  className="border-t"
                >

                  <td className="p-5">

                    {payment.customer.companyName ??
                      `${payment.customer.firstName} ${payment.customer.lastName ?? ""}`}

                  </td>

                  <td className="p-5">
                    {payment.invoice.invoiceNumber}
                  </td>

                  <td className="p-5 font-semibold text-green-700">
                    ₹{Number(payment.amount).toFixed(2)}
                  </td>

                  <td className="p-5 capitalize">
                    {payment.method}
                  </td>

                  <td className="p-5">

                    {payment.createdAt.toLocaleDateString()}

                  </td>

                  <td className="p-5">

                    <div className="flex justify-end gap-5">

                      <Link
                        href={`/payments/${payment.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>

                      <Link
                        href={`/payments/${payment.id}/edit`}
                        className="text-orange-600 hover:underline"
                      >
                        Edit
                      </Link>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  )
}