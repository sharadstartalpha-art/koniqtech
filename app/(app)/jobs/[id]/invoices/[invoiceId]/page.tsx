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
    invoiceId: string
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

export default async function InvoiceDetailsPage({
  params,
}: PageProps) {

  const {
    id,
    invoiceId,
  } = await params

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

  const invoice =
    await prisma.invoice.findFirst({

      where: {
        id: invoiceId,
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

        payments: {

          orderBy: {
            createdAt: "desc",
          },

        },

      },

    })

  if (!invoice) {
    notFound()
  }

  return (

    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

        <div>

          <Link
            href={`/jobs/${job.id}/invoices`}
            className="text-blue-600 hover:underline"
          >
            ← Back to Invoices
          </Link>

          <h1 className="mt-3 text-4xl font-bold">
            {invoice.invoiceNumber}
          </h1>

          <p className="mt-2 text-slate-500">
            Invoice details and payment history.
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/jobs/${job.id}/invoices/${invoice.id}/edit`}
            className="rounded-xl border px-5 py-3 hover:bg-slate-100"
          >
            Edit
          </Link>

          <Link
            href={`/jobs/${job.id}/invoices/${invoice.id}/delete`}
            className="rounded-xl border border-red-300 px-5 py-3 text-red-600 hover:bg-red-50"
          >
            Delete
          </Link>

        </div>

      </div>

      <div className="grid gap-8 lg:grid-cols-2">
                <div className="rounded-3xl border bg-white p-8">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Invoice Information
            </h2>

            <span
              className={`
                inline-flex
                rounded-full
                px-3
                py-1
                text-sm
                font-semibold
                ${badgeColor(invoice.status)}
              `}
            >
              {invoice.status}
            </span>

          </div>

          <dl className="mt-8 space-y-5">

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Invoice Number
              </dt>

              <dd className="font-medium">
                {invoice.invoiceNumber}
              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Job
              </dt>

              <dd className="font-medium">
                {job.title}
              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Due Date
              </dt>

              <dd>

                {invoice.dueDate
                  ? invoice.dueDate.toLocaleDateString()
                  : "-"}

              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Sent
              </dt>

              <dd>

                {invoice.sentAt
                  ? invoice.sentAt.toLocaleDateString()
                  : "-"}

              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Paid
              </dt>

              <dd>

                {invoice.paidAt
                  ? invoice.paidAt.toLocaleDateString()
                  : "-"}

              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Created
              </dt>

              <dd>
                {invoice.createdAt.toLocaleDateString()}
              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Last Updated
              </dt>

              <dd>
                {invoice.updatedAt.toLocaleDateString()}
              </dd>

            </div>

          </dl>

        </div>

        <div className="space-y-8">

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Customer
            </h2>

            <dl className="mt-6 space-y-4">

              <div>

                <dt className="text-sm text-slate-500">
                  Company
                </dt>

                <dd className="mt-1 font-medium">
                  {invoice.customer.companyName}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Contact Person
                </dt>

                
                <dd>
  {[
    invoice.customer?.firstName,
    invoice.customer?.lastName,
  ]
    .filter(Boolean)
    .join(" ") || "-"}
</dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Email
                </dt>

                <dd className="mt-1">
                  {invoice.customer.email ?? "-"}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Phone
                </dt>

                <dd className="mt-1">
                  {invoice.customer.phone ?? "-"}
                </dd>

              </div>

            </dl>

          </div>

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Financial Summary
            </h2>

            <dl className="mt-6 space-y-4">

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Subtotal
                </dt>

                <dd>

                  ₹
                  {Number(
                    invoice.subtotal
                  ).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}

                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Tax
                </dt>

                <dd>

                  ₹
                  {Number(
                    invoice.tax
                  ).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}

                </dd>

              </div>

              <hr />

              <div className="flex justify-between text-lg font-bold">

                <dt>Total</dt>

                <dd>

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

                </dd>

              </div>

            </dl>

          </div>

        </div>

      </div>
            <div className="grid gap-8 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-8">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Payment History
            </h2>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">

              {invoice.payments.length} Payment
              {invoice.payments.length === 1
                ? ""
                : "s"}

            </span>

          </div>

          {invoice.payments.length === 0 ? (

            <div className="py-12 text-center text-slate-500">

              No payments have been recorded for
              this invoice.

            </div>

          ) : (

            <div className="mt-6 overflow-x-auto">

              <table className="min-w-full">

                <thead className="border-b bg-slate-50">

                  <tr>

                    <th className="px-4 py-3 text-left">
                      Date
                    </th>

                    <th className="px-4 py-3 text-left">
                      Method
                    </th>

                    <th className="px-4 py-3 text-left">
                      Reference
                    </th>

                    <th className="px-4 py-3 text-right">
                      Amount
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {invoice.payments.map(
                    (payment) => (

                      <tr
                        key={payment.id}
                        className="border-b"
                      >

                        <td className="px-4 py-4">

                         {payment.paidAt.toLocaleDateString()}

                        </td>

                        <td className="px-4 py-4">

                          {payment.method ?? "-"}

                        </td>

                        <td className="px-4 py-4">

                          {payment.reference ??
                            "-"}

                        </td>

                        <td className="px-4 py-4 text-right font-semibold">

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

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

          <h2 className="text-xl font-semibold text-blue-900">
            Invoice Overview
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

            <p>

              This invoice is associated with
              <strong> {job.title}</strong>.

            </p>

            <p>

              Customer:
              <strong>
                {" "}
                {invoice.customer.companyName}
              </strong>

            </p>

            <p>

              Current status:
              <strong>
                {" "}
                {invoice.status}
              </strong>

            </p>

            <p>

              Total invoice amount:

              <strong>

                {" "}
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

              </strong>

            </p>

            <p>

              Payments recorded:
              <strong>
                {" "}
                {invoice.payments.length}
              </strong>

            </p>

          </div>

        </div>

      </div>

    </div>

  )

}