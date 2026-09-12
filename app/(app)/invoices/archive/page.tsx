import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function ArchivedInvoicesPage() {

  const session =
    await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId =
    session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const invoices =
    await prisma.invoice.findMany({

      where: {
        orgId,
        archivedAt: {
          not: null,
        },
      },

      include: {
        customer: true,
        job: true,
      },

      orderBy: {
        archivedAt: "desc",
      },

    })

  return (

    <div className="space-y-8">

      {/* --------------------------------
          HEADER
      -------------------------------- */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Archived Invoices
          </h1>

          <p className="text-slate-500 mt-2">
            View and restore invoices that have been archived.
          </p>

        </div>

        <Link
          href="/invoices"
          className="
            border
            px-5
            py-3
            rounded-xl
            hover:bg-slate-100
          "
        >
          Back to Invoices
        </Link>

      </div>

      {/* --------------------------------
          ARCHIVED COUNT
      -------------------------------- */}

      <div className="bg-white border rounded-3xl p-6">
        

        <div className="text-slate-500 text-sm">
          Archived Invoices
        </div>

        <div className="text-4xl font-bold mt-2">
          {invoices.length}
        </div>

      </div>

      {/* --------------------------------
          TABLE
      -------------------------------- */}

      <div className="bg-white border rounded-3xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="text-left p-4">
                Invoice
              </th>

              <th className="text-left p-4">
                Customer
              </th>

              <th className="text-left p-4">
                Job
              </th>

              <th className="text-right p-4">
                Total
              </th>

              <th className="text-center p-4">
                Status
              </th>

              <th className="text-left p-4">
                Archived
              </th>

              <th className="text-right p-4">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {invoices.length === 0 && (

              <tr>

                <td
                  colSpan={7}
                  className="
                    text-center
                    py-16
                    text-slate-400
                  "
                >
                  No archived invoices.
                </td>

              </tr>

            )}

            {invoices.map((invoice) => (

              <tr
                key={invoice.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="p-4 font-semibold">
                  {invoice.invoiceNumber}
                </td>

                <td className="p-4">

                  {invoice.customer.companyName ??
                    `${invoice.customer.firstName ?? ""} ${invoice.customer.lastName ?? ""}`.trim()
                  }

                </td>

                <td className="p-4">
                  {invoice.job.title}
                </td>

                <td className="text-right p-4 font-semibold">

                  ₹
                  {Number(
                    invoice.total
                  ).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                    }
                  )}

                </td>

                <td className="text-center p-4">

                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      font-medium
                      bg-slate-100
                      text-slate-700
                    "
                  >
                    {invoice.status}
                  </span>

                </td>

                <td className="p-4">

                  {invoice.archivedAt
                    ? invoice.archivedAt.toLocaleDateString()
                    : "-"
                  }

                </td>

                <td className="p-4">

                  <div className="flex justify-end gap-2">

                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="
                        border
                        px-3
                        py-2
                        rounded-lg
                        hover:bg-slate-100
                      "
                    >
                      View
                    </Link>

                    <Link
                      href={`/invoices/${invoice.id}/restore`}
                      className="
                        border
                        px-3
                        py-2
                        rounded-lg
                        text-green-600
                        hover:bg-green-50
                      "
                    >
                      Restore
                    </Link>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )
}