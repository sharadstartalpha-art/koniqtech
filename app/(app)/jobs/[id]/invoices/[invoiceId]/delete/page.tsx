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

export default async function DeleteInvoicePage({
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
           companyName: true,
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
          },

        },

        payments: {

          select: {
            id: true,
            amount: true,
            method: true,
            paidAt: true,
          },

          orderBy: {
            paidAt: "desc",
          },

        },

      },

    })

  if (!invoice) {
    notFound()
  }

  async function deleteInvoice() {

    "use server"

    const session =
      await auth()

    if (!session?.user) {
      redirect("/login")
    }

    const orgId =
      (session.user as any).orgId

    const invoice =
      await prisma.invoice.findFirst({

        where: {
          id: invoiceId,
          orgId,
          jobId: id,
        },

        select: {
          id: true,
        },

      })

    if (!invoice) {
      notFound()
    }

    await prisma.invoice.delete({

      where: {
        id: invoice.id,
      },

    })

    redirect(
      `/jobs/${id}/invoices`
    )

  }

  return (

    <div className="mx-auto max-w-4xl space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/invoices/${invoice.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Invoice
        </Link>

        <h1 className="mt-3 text-4xl font-bold text-red-600">
          Delete Invoice
        </h1>

        <p className="mt-2 text-slate-500">
          This action permanently removes the
          invoice and its related payment
          records.
        </p>

      </div>

      <form
        action={deleteInvoice}
        className="space-y-8"
      >
                <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

          <h2 className="text-2xl font-semibold text-red-700">
            Permanent Deletion Warning
          </h2>

          <p className="mt-4 leading-7 text-red-700">

            You are about to permanently delete
            this invoice.

          </p>

          <p className="mt-2 leading-7 text-red-700">

            Any payments linked to this invoice
            will also be removed because of the
            cascade relationship configured in
            the database.

          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Invoice Summary
            </h2>

            <dl className="mt-6 space-y-4">

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
                  Status
                </dt>

                <dd>
                  {invoice.status}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Total
                </dt>

                <dd className="font-semibold">

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

            </dl>

          </div>

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Customer & Payments
            </h2>

            <dl className="mt-6 space-y-4">

              <div>

                <dt className="text-sm text-slate-500">
                  Customer
                </dt>

                <dd className="mt-1 font-medium">
                  {invoice.customer.companyName}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Contact
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
                  Payments
                </dt>

                <dd className="mt-1 font-semibold">
                  {invoice.payments.length}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Amount Received
                </dt>

                <dd className="mt-1 font-semibold">

                  ₹

                  {invoice.payments
                    .reduce(
                      (
                        total,
                        payment
                      ) =>
                        total +
                        Number(
                          payment.amount
                        ),
                      0
                    )
                    .toLocaleString(
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

        <div className="flex justify-end gap-4 border-t pt-8">

          <Link
            href={`/jobs/${job.id}/invoices/${invoice.id}`}
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
            Delete Invoice
          </button>

        </div>

      </form>

    </div>

  )

}