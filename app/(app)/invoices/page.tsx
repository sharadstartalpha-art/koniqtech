import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    search?: string
    status?: string
  }>
}

export default async function InvoicesPage({
  searchParams,
}: PageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

const {
  search = "",
  status = "",
} = await searchParams

const where: Prisma.InvoiceWhereInput = {
  orgId,

  ...(search
    ? {
        OR: [
          {
            invoiceNumber: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            customer: {
              OR: [
                {
                  firstName: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                {
                  lastName: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                {
                  companyName: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              ],
            },
          },
          {
            job: {
              title: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        ],
      }
    : {}),

  ...(status
    ? {
        status,
      }
    : {}),
}
  
  const invoices = await prisma.invoice.findMany({
  where,
  include: {
    customer: true,
    job: true,
  },
  orderBy: {
    createdAt: "desc",
  },
})

  const draft = invoices.filter(
    (i) => i.status === "draft"
  ).length

  const sent = invoices.filter(
    (i) => i.status === "sent"
  ).length

  const paid = invoices.filter(
    (i) => i.status === "paid"
  ).length

  const overdue = invoices.filter(
    (i) => i.status === "overdue"
  ).length

  const totalRevenue = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.total),
    0
  )


  

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Invoices
          </h1>

          <p className="text-slate-500 mt-2">
            Create, manage and track customer invoices.
          </p>

        </div>

        <Link
          href="/invoices/create"
          className="
            bg-orange-600
            hover:bg-orange-700
            text-white
            px-6
            py-3
            rounded-xl
            font-medium
          "
        >
          + New Invoice
        </Link>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

        <div className="bg-white border rounded-3xl p-6">
          <div className="text-slate-500 text-sm">
            Draft
          </div>

          <div className="text-4xl font-bold mt-2">
            {draft}
          </div>
        </div>

        <div className="bg-white border rounded-3xl p-6">
          <div className="text-slate-500 text-sm">
            Sent
          </div>

          <div className="text-4xl font-bold mt-2 text-blue-600">
            {sent}
          </div>
        </div>

        <div className="bg-white border rounded-3xl p-6">
          <div className="text-slate-500 text-sm">
            Paid
          </div>

          <div className="text-4xl font-bold mt-2 text-green-600">
            {paid}
          </div>
        </div>

        <div className="bg-white border rounded-3xl p-6">
          <div className="text-slate-500 text-sm">
            Overdue
          </div>

          <div className="text-4xl font-bold mt-2 text-red-600">
            {overdue}
          </div>
        </div>

        <div className="bg-white border rounded-3xl p-6">
          <div className="text-slate-500 text-sm">
            Total Value
          </div>

          <div className="text-3xl font-bold mt-2">
            $
            {totalRevenue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>

      </div>

      <div className="bg-white border rounded-3xl overflow-hidden">

<form className="flex flex-col gap-4 lg:flex-row">

  <input
    type="text"
    name="search"
    defaultValue={search}
    placeholder="Search invoice..."
    className="flex-1 rounded-xl border px-5 py-3"
  />

  <select
    name="status"
    defaultValue={status}
    className="rounded-xl border px-5 py-3"
  >
    <option value="">
      All Statuses
    </option>

    <option value="draft">
      Draft
    </option>

    <option value="sent">
      Sent
    </option>

    <option value="paid">
      Paid
    </option>

    <option value="overdue">
      Overdue
    </option>

    <option value="cancelled">
      Cancelled
    </option>

  </select>

  <button
    type="submit"
    className="rounded-xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
  >
    Search
  </button>

</form>


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

              <th className="text-left p-4">
                Due Date
              </th>

              <th className="text-right p-4">
                Total
              </th>

              <th className="text-center p-4">
                Status
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
                  className="text-center py-16 text-slate-400"
                >
                  No invoices found.
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
                  {invoice.customer.firstName}{" "}
                  {invoice.customer.lastName}
                </td>

                <td className="p-4">
                  {invoice.job.title}
                </td>

                <td className="p-4">
                  {invoice.dueDate
                    ? invoice.dueDate.toLocaleDateString()
                    : "-"}
                </td>

                <td className="text-right p-4 font-semibold">
                  $
                  {Number(invoice.total).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </td>

                <td className="text-center p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      invoice.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : invoice.status === "sent"
                        ? "bg-blue-100 text-blue-700"
                        : invoice.status === "overdue"
                        ? "bg-red-100 text-red-700"
                        : invoice.status === "cancelled"
                        ? "bg-gray-200 text-gray-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {invoice.status}
                  </span>

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
                      href={`/invoices/${invoice.id}/edit`}
                      className="
                        border
                        px-3
                        py-2
                        rounded-lg
                        hover:bg-slate-100
                      "
                    >
                      Edit
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