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

export default async function JobPaymentsPage({
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

  const payments =
    await prisma.payment.findMany({

      where: {

        orgId,

        invoice: {
          jobId: job.id,
        },

      },

      include: {

        customer: {

          select: {
            id: true,
            companyName: true,
    firstName: true,
    lastName: true,
          },

        },

        invoice: {

          select: {
            id: true,
            invoiceNumber: true,
            status: true,
          },

        },

      },

      orderBy: {
        paidAt: "desc",
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
            Payments
          </h1>

          <p className="mt-2 text-slate-500">
            Manage payments received for this job.
          </p>

        </div>

        <Link
          href={`/jobs/${job.id}/payments/create`}
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
          Record Payment
        </Link>

      </div>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <table className="min-w-full">

          <thead className="border-b bg-slate-50">

            <tr className="text-left text-sm font-semibold text-slate-600">

              <th className="px-6 py-4">
                Invoice
              </th>

              <th className="px-6 py-4">
                Customer
              </th>

              <th className="px-6 py-4">
                Method
              </th>

              <th className="px-6 py-4">
                Reference
              </th>

              <th className="px-6 py-4">
                Amount
              </th>

              <th className="px-6 py-4">
                Paid Date
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y">
                      {payments.length === 0 ? (

            <tr>

              <td
                colSpan={7}
                className="px-6 py-16 text-center text-slate-500"
              >

                <p className="text-lg font-medium">
                  No payments found.
                </p>

                <p className="mt-2">
                  Record the first payment for this
                  job.
                </p>

              </td>

            </tr>

          ) : (

            payments.map((payment) => (

              <tr
                key={payment.id}
                className="hover:bg-slate-50"
              >

                <td className="px-6 py-5">

                  <div className="font-semibold">

                    {payment.invoice.invoiceNumber}

                  </div>

                  <div className="mt-1 text-sm text-slate-500">

                    {payment.invoice.status}

                  </div>

                </td>

                <td className="px-6 py-5">

                  <div className="font-medium">

                    {payment.customer.companyName}

                  </div>

                  <div className="mt-1 text-sm text-slate-500">

                   
                      {[
    payment.customer?.firstName,
    payment.customer?.lastName,
  ]
    .filter(Boolean)
    .join(" ") || "-"}

                  </div>

                </td>

                <td className="px-6 py-5">

                  <span
                    className="
                    inline-flex
                    rounded-full
                    bg-slate-100
                    px-3
                    py-1
                    text-sm
                    font-medium
                    capitalize
                    "
                  >

                    {payment.method
                      .replaceAll("_", " ")}

                  </span>

                </td>

                <td className="px-6 py-5">

                  {payment.reference ??
                    "-"}

                </td>

                <td className="px-6 py-5 font-semibold">

                  ₹

                  {Number(
                    payment.amount
                  ).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}

                </td>

                <td className="px-6 py-5">

                  {payment.paidAt.toLocaleDateString()}

                </td>

                <td className="px-6 py-5">

                  <div className="flex justify-end gap-2">

                    <Link
                      href={`/jobs/${job.id}/payments/${payment.id}`}
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
                      href={`/jobs/${job.id}/payments/${payment.id}/edit`}
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
                      href={`/jobs/${job.id}/payments/${payment.id}/delete`}
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
            Total Payments
          </p>

          <p className="mt-2 text-3xl font-bold">
            {payments.length}
          </p>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Amount Received
          </p>

          <p className="mt-2 text-3xl font-bold">

            ₹

            {payments
              .reduce(
                (
                  total,
                  payment
                ) =>
                  total +
                  Number(payment.amount),
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
            Cash Payments
          </p>

          <p className="mt-2 text-3xl font-bold">

            {
              payments.filter(
                (payment) =>
                  payment.method === "cash"
              ).length
            }

          </p>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Card Payments
          </p>

          <p className="mt-2 text-3xl font-bold">

            {
              payments.filter(
                (payment) =>
                  payment.method ===
                    "credit_card" ||
                  payment.method ===
                    "debit_card"
              ).length
            }

          </p>

        </div>

      </div>

      <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

        <h2 className="text-xl font-semibold text-blue-900">
          Payment Overview
        </h2>

        <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

          <p>

            This page displays all payments
            received for invoices associated
            with this job.

          </p>

          <p>

            Each payment is linked to both an
            invoice and a customer, making it
            easy to reconcile billing and
            received amounts.

          </p>

          <p>

            Payment methods, references and
            payment dates are recorded to
            maintain a complete financial audit
            trail.

          </p>

        </div>

      </div>

    </div>

  )

}