import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import Link from "next/link"

import {
  notFound,
  redirect,
} from "next/navigation"

import {
  Prisma,
  PaymentMethod,
} from "@prisma/client"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CreatePaymentPage({
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
          },

        },

      },

      orderBy: {
        createdAt: "desc",
      },

    })

  async function createPayment(
    formData: FormData
  ) {

    "use server"

    const session =
      await auth()

    if (!session?.user) {
      redirect("/login")
    }

    const orgId =
      (session.user as any).orgId

    const invoiceId =
      String(
        formData.get("invoiceId")
      )

    const invoice =
      await prisma.invoice.findFirst({

        where: {
          id: invoiceId,
          orgId,
          jobId: id,
        },

      })

    if (!invoice) {
      notFound()
    }

    const amount =
      new Prisma.Decimal(
        String(
          formData.get("amount") ?? "0"
        )
      )

    const method =
      formData.get(
        "method"
      ) as PaymentMethod

    const reference =
      String(
        formData.get("reference") ?? ""
      ).trim() || null

    const notes =
      String(
        formData.get("notes") ?? ""
      ).trim() || null

    const paidAtValue =
      String(
        formData.get("paidAt") ?? ""
      )

    await prisma.payment.create({

      data: {

        orgId,

        customerId:
          invoice.customerId,

        invoiceId:
          invoice.id,

        amount,

        method,

        reference,

        notes,

        paidAt:
          paidAtValue
            ? new Date(
                paidAtValue
              )
            : new Date(),

      },

    })

    redirect(`/jobs/${id}/payments`)

  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/payments`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Payments
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Record Payment
        </h1>

        <p className="mt-2 text-slate-500">
          Record a payment received for an invoice.
        </p>

      </div>

      <form
        action={createPayment}
        className="space-y-8 rounded-3xl border bg-white p-8"
      >
                <div className="grid gap-8 lg:grid-cols-2">

          <div className="space-y-6">

            <div>

              <label className="mb-2 block font-medium">
                Invoice
              </label>

              <select
                name="invoiceId"
                required
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                "
              >

                <option value="">
                  Select Invoice
                </option>

                {invoices.map((invoice) => (

                  <option
                    key={invoice.id}
                    value={invoice.id}
                  >
                    {invoice.invoiceNumber}
                    {" — "}
                    {invoice.customer.companyName}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Amount
              </label>

              <input
                type="number"
                name="amount"
                step="0.01"
                min="0"
                required
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                "
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Payment Method
              </label>

              <select
                name="method"
                defaultValue={PaymentMethod.cash}
                required
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                "
              >

                {Object.values(
                  PaymentMethod
                ).map((method) => (

                  <option
                    key={method}
                    value={method}
                  >
                    {method
                      .replaceAll("_", " ")
                      .replace(
                        /\b\w/g,
                        (c) =>
                          c.toUpperCase()
                      )}
                  </option>

                ))}

              </select>

            </div>

          </div>

          <div className="space-y-6">

            <div>

              <label className="mb-2 block font-medium">
                Reference
              </label>

              <input
                type="text"
                name="reference"
                placeholder="Transaction ID, cheque number, etc."
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                "
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Notes
              </label>

              <textarea
                name="notes"
                rows={5}
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                "
                placeholder="Optional notes..."
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Paid Date
              </label>

              <input
                type="date"
                name="paidAt"
                defaultValue={
                  new Date()
                    .toISOString()
                    .slice(0, 10)
                }
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                "
              />

            </div>

          </div>

        </div>
                <div className="grid gap-8 lg:grid-cols-2">

          <div className="rounded-3xl border bg-white p-6">

            <h2 className="text-xl font-semibold">
              Payment Summary
            </h2>

            <dl className="mt-6 space-y-4">

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
                  Available Invoices
                </dt>

                <dd className="font-medium">
                  {invoices.length}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Supported Methods
                </dt>

                <dd className="font-medium">
                  {Object.values(
                    PaymentMethod
                  ).length}
                </dd>

              </div>

            </dl>

          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

            <h2 className="text-xl font-semibold text-blue-900">
              Payment Guidelines
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

              <p>

                Select the invoice that
                received the payment.
                The customer will be
                linked automatically
                from the invoice.

              </p>

              <p>

                Record the exact payment
                amount received and choose
                the correct payment method.

              </p>

              <p>

                Add a transaction reference,
                cheque number or payment ID
                whenever available for future
                reconciliation.

              </p>

              <p>

                Notes are optional but can
                be used to record additional
                payment information.

              </p>

            </div>

          </div>

        </div>

        <div className="flex justify-end gap-4 border-t pt-8">

          <Link
            href={`/jobs/${job.id}/payments`}
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
          </button>

        </div>

      </form>

    </div>

  )

}