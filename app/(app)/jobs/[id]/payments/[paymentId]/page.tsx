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
    paymentId: string
  }>
}

function formatMethod(method: string) {

  return method
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())

}

export default async function PaymentDetailsPage({
  params,
}: PageProps) {

  const {
    id,
    paymentId,
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

  const payment =
    await prisma.payment.findFirst({

      where: {

        id: paymentId,

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
    email: true,
    phone: true,
          },

        },

        invoice: {

          select: {
            id: true,
            invoiceNumber: true,
            status: true,
            total: true,
            dueDate: true,
          },

        },

      },

    })

  if (!payment) {
    notFound()
  }

  return (

    <div className="mx-auto max-w-6xl space-y-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

        <div>

          <Link
            href={`/jobs/${job.id}/payments`}
            className="text-blue-600 hover:underline"
          >
            ← Back to Payments
          </Link>

          <h1 className="mt-3 text-4xl font-bold">
            Payment Details
          </h1>

          <p className="mt-2 text-slate-500">
            View payment information for this job.
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/jobs/${job.id}/payments/${payment.id}/edit`}
            className="rounded-xl border px-5 py-3 hover:bg-slate-100"
          >
            Edit
          </Link>

          <Link
            href={`/jobs/${job.id}/payments/${payment.id}/delete`}
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
              Payment Information
            </h2>

            <span
              className="
              rounded-full
              bg-green-100
              px-3
              py-1
              text-sm
              font-medium
              text-green-700
              "
            >
              {formatMethod(payment.method)}
            </span>

          </div>

          <dl className="mt-8 space-y-5">

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Amount
              </dt>

              <dd className="font-semibold">

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

              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Payment Method
              </dt>

              <dd>
                {formatMethod(payment.method)}
              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Reference
              </dt>

              <dd>

                {payment.reference ??
                  "-"}

              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Paid Date
              </dt>

              <dd>

                {payment.paidAt.toLocaleDateString()}

              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Recorded
              </dt>

              <dd>

                {payment.createdAt.toLocaleDateString()}

              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Last Updated
              </dt>

              <dd>

                {payment.updatedAt.toLocaleDateString()}

              </dd>

            </div>

          </dl>

          <div className="mt-8">

            <h3 className="font-semibold">
              Notes
            </h3>

            <div className="mt-3 rounded-xl border bg-slate-50 p-4">

              {payment.notes?.trim()
                ? payment.notes
                : "No notes available."}

            </div>

          </div>

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
                  {payment.customer.companyName}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Contact Person
                </dt>

                <dd className="mt-1">
                  
                     {[
    payment.customer?.firstName,
    payment.customer?.lastName,
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
                  {payment.customer.email ??
                    "-"}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Phone
                </dt>

                <dd className="mt-1">
                  {payment.customer.phone ??
                    "-"}
                </dd>

              </div>

            </dl>

          </div>

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Invoice
            </h2>

            <dl className="mt-6 space-y-4">

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Invoice Number
                </dt>

                <dd className="font-medium">
                  {payment.invoice.invoiceNumber}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Status
                </dt>

                <dd>
                  {payment.invoice.status}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Invoice Total
                </dt>

                <dd className="font-semibold">

                  ₹

                  {Number(
                    payment.invoice.total
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
                  Due Date
                </dt>

                <dd>

                  {payment.invoice.dueDate
                    ? payment.invoice.dueDate.toLocaleDateString()
                    : "-"}

                </dd>

              </div>

            </dl>

          </div>

        </div>

      </div>
            <div className="grid gap-8 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-xl font-semibold">
            Payment Overview
          </h2>

          <div className="mt-6 space-y-5">

            <div className="flex items-center justify-between">

              <span className="text-slate-500">
                Payment Amount
              </span>

              <span className="text-xl font-bold">

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

              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-slate-500">
                Invoice Total
              </span>

              <span className="font-medium">

                ₹

                {Number(
                  payment.invoice.total
                ).toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}

              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-slate-500">
                Remaining Balance
              </span>

              <span className="font-semibold">

                ₹

                {Math.max(
                  Number(
                    payment.invoice.total
                  ) -
                    Number(
                      payment.amount
                    ),
                  0
                ).toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}

              </span>

            </div>

          </div>

        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

          <h2 className="text-xl font-semibold text-blue-900">
            Audit Information
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

            <p>

              This payment is permanently
              linked to the selected invoice
              and customer.

            </p>

            <p>

              The payment reference and
              payment method provide an
              audit trail for reconciliation
              and financial reporting.

            </p>

            <p>

              Any future edits should only
              be made to correct payment
              information and should follow
              your organization's accounting
              policies.

            </p>

          </div>

        </div>

      </div>

    </div>

  )

}