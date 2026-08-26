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

export default async function DeletePaymentPage({
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
            companyName: true,
           firstName: true,
           lastName: true,
            email: true,
          },

        },

        invoice: {

          select: {
            id: true,
            invoiceNumber: true,
            status: true,
            total: true,
          },

        },

      },

    })

  if (!payment) {
    notFound()
  }

  async function deletePayment() {

    "use server"

    const session =
      await auth()

    if (!session?.user) {
      redirect("/login")
    }

    const orgId =
      (session.user as any).orgId

    const existing =
      await prisma.payment.findFirst({

        where: {

          id: paymentId,

          orgId,

          invoice: {
            jobId: id,
          },

        },

        select: {
          id: true,
        },

      })

    if (!existing) {
      notFound()
    }

    await prisma.payment.delete({

      where: {
        id: existing.id,
      },

    })

    redirect(
      `/jobs/${id}/payments`
    )

  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <Link
          href={`/jobs/${id}/payments/${payment.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Payment
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Delete Payment
        </h1>

        <p className="mt-2 text-slate-500">
          Permanently remove this payment record.
        </p>

      </div>

      <form
        action={deletePayment}
        className="space-y-8"
      >
                <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

          <h2 className="text-2xl font-semibold text-red-700">
            Permanent Deletion Warning
          </h2>

          <p className="mt-4 leading-7 text-red-700">

            This payment record will be
            permanently deleted.

          </p>

          <p className="mt-2 leading-7 text-red-700">

            Deleting this payment may affect
            invoice balances, outstanding
            amounts and financial reports.

          </p>

          <p className="mt-2 leading-7 text-red-700">

            This action cannot be undone.

          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Payment Summary
            </h2>

            <dl className="mt-6 space-y-4">

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
                  Method
                </dt>

                <dd>

                  {formatMethod(
                    payment.method
                  )}

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

            </dl>

          </div>

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Invoice & Customer
            </h2>

            <dl className="mt-6 space-y-4">

              <div>

                <dt className="text-sm text-slate-500">
                  Invoice
                </dt>

                <dd className="mt-1 font-medium">
                  {payment.invoice.invoiceNumber}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Invoice Status
                </dt>

                <dd className="mt-1">
                  {payment.invoice.status}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Invoice Total
                </dt>

                <dd className="mt-1 font-semibold">

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

              <div>

                <dt className="text-sm text-slate-500">
                  Customer
                </dt>

                <dd className="mt-1 font-medium">

                  {payment.customer.companyName ??
                    "-"}

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

            </dl>

          </div>

        </div>
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">

          <h2 className="text-xl font-semibold text-amber-900">
            Final Confirmation
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-7 text-amber-800">

            <p>

              Please verify that this payment
              should be removed before
              continuing.

            </p>

            <p>

              Removing this payment will
              reduce the recorded payments
              associated with the invoice and
              may change outstanding balances.

            </p>

            <p>

              Consider editing the payment
              instead of deleting it if only
              the payment details are
              incorrect.

            </p>

          </div>

        </div>

        <div className="flex justify-end gap-4 border-t pt-8">

          <Link
            href={`/jobs/${id}/payments/${payment.id}`}
            className="
            rounded-xl
            border
            px-6
            py-3
            font-medium
            transition
            hover:bg-slate-100
            "
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="
            rounded-xl
            bg-red-600
            px-6
            py-3
            font-medium
            text-white
            transition
            hover:bg-red-700
            "
          >
            Delete Payment
          </button>

        </div>

      </form>

    </div>

  )

}