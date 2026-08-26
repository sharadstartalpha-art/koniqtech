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
    paymentId: string
  }>
}

export default async function EditPaymentPage({
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

        invoice: {

          select: {
            invoiceNumber: true,
          },

        },

        customer: {

          select: {
            companyName: true,
          },

        },

      },

    })

  if (!payment) {
    notFound()
  }

  async function updatePayment(
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

    const existing =
      await prisma.payment.findFirst({

        where: {

          id: paymentId,

          orgId,

          invoice: {
            jobId: id,
          },

        },

      })

    if (!existing) {
      notFound()
    }

    await prisma.payment.update({

      where: {
        id: existing.id,
      },

      data: {

        amount:
          new Prisma.Decimal(
            String(
              formData.get("amount")
            )
          ),

        method:
          formData.get(
            "method"
          ) as PaymentMethod,

        reference:
          String(
            formData.get("reference") ??
              ""
          ).trim() || null,

        notes:
          String(
            formData.get("notes") ??
              ""
          ).trim() || null,

        paidAt: new Date(
          String(
            formData.get("paidAt")
          )
        ),

      },

    })

    redirect(
      `/jobs/${id}/payments/${paymentId}`
    )

  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <Link
          href={`/jobs/${id}/payments/${paymentId}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Payment
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Edit Payment
        </h1>

        <p className="mt-2 text-slate-500">
          Update payment information.
        </p>

      </div>

      <form
        action={updatePayment}
        className="space-y-8 rounded-3xl border bg-white p-8"
      >
                <div className="grid gap-8 lg:grid-cols-2">

          <div className="space-y-6">

            <div>

              <label className="mb-2 block font-medium">
                Invoice
              </label>

              <input
                type="text"
                value={payment.invoice.invoiceNumber}
                readOnly
                className="
                w-full
                rounded-xl
                border
                bg-slate-100
                px-4
                py-3
                text-slate-600
                "
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Customer
              </label>

             <input
  type="text"
  value={payment.customer.companyName ?? ""}
  readOnly
  className="
    w-full
    rounded-xl
    border
    bg-slate-100
    px-4
    py-3
    text-slate-600
  "
/>

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
                defaultValue={payment.amount.toString()}
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
                defaultValue={payment.method}
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
                defaultValue={
                  payment.reference ?? ""
                }
                placeholder="Transaction reference"
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
                rows={6}
                defaultValue={
                  payment.notes ?? ""
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

            <div>

              <label className="mb-2 block font-medium">
                Paid Date
              </label>

              <input
                type="date"
                name="paidAt"
                defaultValue={payment.paidAt
                  .toISOString()
                  .slice(0, 10)}
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
                  Invoice
                </dt>

                <dd className="font-medium">
                  {payment.invoice.invoiceNumber}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Customer
                </dt>

                <dd className="font-medium">
                  {payment.customer.companyName}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Current Amount
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

                <dd className="font-medium">

                  {payment.method
                    .replaceAll("_", " ")
                    .replace(
                      /\b\w/g,
                      (c) => c.toUpperCase()
                    )}

                </dd>

              </div>

            </dl>

          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

            <h2 className="text-xl font-semibold text-blue-900">
              Editing Guidelines
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

              <p>

                Update the payment amount only
                when correcting an incorrect
                transaction.

              </p>

              <p>

                Ensure the payment method and
                reference match the actual
                transaction record.

              </p>

              <p>

                Modify the paid date only if
                the original payment date was
                entered incorrectly.

              </p>

              <p>

                Changes made here affect
                financial reporting and audit
                history, so verify all values
                before saving.

              </p>

            </div>

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
            bg-blue-600
            px-6
            py-3
            font-medium
            text-white
            transition
            hover:bg-blue-700
            "
          >
            Save Changes
          </button>

        </div>

      </form>

    </div>

  )

}