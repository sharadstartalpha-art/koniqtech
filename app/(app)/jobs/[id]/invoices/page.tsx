import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import Link from "next/link"

import {
  notFound,
  redirect,
} from "next/navigation"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

function badgeColor(status: string) {

  switch (status.toLowerCase()) {

    case "draft":
      return "bg-slate-100 text-slate-700"

    case "sent":
      return "bg-blue-100 text-blue-700"

    case "paid":
      return "bg-green-100 text-green-700"

    case "overdue":
      return "bg-red-100 text-red-700"

    case "cancelled":
      return "bg-gray-200 text-gray-700"

    default:
      return "bg-amber-100 text-amber-700"

  }

}

export default async function JobInvoicesPage({
  params,
}: PageProps) {

  const { id } =
    await params

  const session =
    await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId =
    (session.user as any).orgId

  const job =
    await prisma.job.findFirst({

      where: {
        id,
        orgId,
      },

      select: {
        id: true,
        title: true,
      },

    })

  if (!job) {
    notFound()
  }

  const invoices =
    await prisma.invoice.findMany({

      where: {
        orgId,
        jobId: job.id,
      },

      include: {

        customer: {

          select: {
            id: true,
            companyName: true,
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
          },

        },

      },

      orderBy: {
        createdAt: "desc",
      },

    })

  return (

    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <Link
            href={`/jobs/${job.id}`}
            className="text-blue-600 hover:underline"
          >
            ← Back to Job
          </Link>

          <h1 className="mt-3 text-4xl font-bold">
            Invoices
          </h1>

          <p className="mt-2 text-slate-500">
            Manage invoices for this job.
          </p>

        </div>

        <Link
          href={`/jobs/${job.id}/invoices/create`}
          className="
          rounded-xl
          bg-blue-600
          px-6
          py-3
          font-medium
          text-white
          transition
          hover:bg-blue-700
          "
        >
          New Invoice
        </Link>

      </div>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <table className="min-w-full">

          <thead className="border-b bg-slate-50">

            <tr className="text-left text-sm font-semibold text-slate-600">

              <th className="px-6 py-4">
                Invoice #
              </th>

              <th className="px-6 py-4">
                Customer
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4">
                Due Date
              </th>

              <th className="px-6 py-4">
                Total
              </th>

              <th className="px-6 py-4">
                Sent
              </th>

              <th className="px-6 py-4">
                Paid
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y">
                      {invoices.length === 0 ? (

            <tr>

              <td
                colSpan={8}
                className="px-6 py-16 text-center text-slate-500"
              >

                <p className="text-lg font-medium">
                  No invoices found.
                </p>

                <p className="mt-2">
                  Create your first invoice for
                  this job.
                </p>

              </td>

            </tr>

          ) : (

            invoices.map((invoice) => (

              <tr
                key={invoice.id}
                className="hover:bg-slate-50"
              >

                <td className="px-6 py-5">

                  <div className="font-semibold">
                    {invoice.invoiceNumber}
                  </div>

                  <div className="mt-1 text-sm text-slate-500">

                    Created{" "}

                    {invoice.createdAt.toLocaleDateString()}

                  </div>

                </td>

                <td className="px-6 py-5">

                  <div className="font-medium">

                    {invoice.customer.companyName}

                  </div>

                  <div className="mt-1 text-sm text-slate-500">

                    
                {[
    invoice.customer?.firstName,
    invoice.customer?.lastName,
  ]
    .filter(Boolean)
    .join(" ") || "-"}

                  </div>

                  <div className="text-sm text-slate-500">

                    {invoice.customer.email ?? "-"}

                  </div>

                </td>

                <td className="px-6 py-5">

                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      ${badgeColor(
                        invoice.status
                      )}
                    `}
                  >

                    {invoice.status}

                  </span>

                </td>

                <td className="px-6 py-5">

                  {invoice.dueDate
                    ? invoice.dueDate.toLocaleDateString()
                    : "-"}

                </td>

                <td className="px-6 py-5 font-semibold">

                  ₹
                  {Number(
                    invoice.total
                  ).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}

                </td>

                <td className="px-6 py-5">

                  {invoice.sentAt
                    ? invoice.sentAt.toLocaleDateString()
                    : "-"}

                </td>

                <td className="px-6 py-5">

                  {invoice.paidAt
                    ? invoice.paidAt.toLocaleDateString()
                    : "-"}

                </td>

                <td className="px-6 py-5">

                  <div className="flex justify-end gap-2">

                    <Link
                      href={`/jobs/${job.id}/invoices/${invoice.id}`}
                      className="
                      rounded-lg
                      border
                      px-3
                      py-2
                      text-sm
                      hover:bg-slate-100
                      "
                    >
                      View
                    </Link>

                    <Link
                      href={`/jobs/${job.id}/invoices/${invoice.id}/edit`}
                      className="
                      rounded-lg
                      border
                      px-3
                      py-2
                      text-sm
                      hover:bg-slate-100
                      "
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/jobs/${job.id}/invoices/${invoice.id}/delete`}
                      className="
                      rounded-lg
                      border
                      border-red-300
                      px-3
                      py-2
                      text-sm
                      text-red-600
                      hover:bg-red-50
                      "
                    >
                      Delete
                    </Link>

                  </div>

                </td>

              </tr>

            ))

          )}

          </tbody>

        </table>

      </div>
            <div className="grid gap-6 lg:grid-cols-4">

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Total Invoices
          </p>

          <p className="mt-2 text-3xl font-bold">
            {invoices.length}
          </p>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Total Invoice Value
          </p>

          <p className="mt-2 text-3xl font-bold">

            ₹

            {invoices
              .reduce(
                (
                  total,
                  invoice,
                ) =>
                  total +
                  Number(invoice.total),
                0
              )
              .toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}

          </p>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Draft
          </p>

          <p className="mt-2 text-3xl font-bold">

            {
              invoices.filter(
                (
                  invoice
                ) =>
                  invoice.status.toLowerCase() ===
                  "draft"
              ).length
            }

          </p>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Paid
          </p>

          <p className="mt-2 text-3xl font-bold">

            {
              invoices.filter(
                (
                  invoice
                ) =>
                  invoice.status.toLowerCase() ===
                  "paid"
              ).length
            }

          </p>

        </div>

      </div>

      <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

        <h2 className="text-xl font-semibold text-blue-900">
          Invoice Overview
        </h2>

        <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

          <p>

            Invoices issued for this job are
            tracked here along with their billing
            status and payment progress.

          </p>

          <p>

            Each invoice records the customer,
            invoice number, subtotal, tax,
            total amount and important billing
            dates including due, sent and paid
            dates.

          </p>

          <p>

            Payments associated with an invoice
            can be viewed from the invoice details
            page, providing a complete financial
            history for the job.

          </p>

        </div>

      </div>

    </div>

  )

}