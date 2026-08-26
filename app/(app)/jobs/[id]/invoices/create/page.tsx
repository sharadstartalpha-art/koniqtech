import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import Link from "next/link"

import {
  notFound,
  redirect,
} from "next/navigation"

import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CreateInvoicePage({
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

      include: {

        customer: {

          select: {
            id: true,
            companyName: true,
          },

        },

      },

    })

  if (!job) {
    notFound()
  }

  const customers =
    await prisma.customer.findMany({

      where: {
        orgId,
      },

      orderBy: {
        companyName: "asc",
      },

      select: {
        id: true,
        companyName: true,
      },

    })

  const invoiceNumber =
    `INV-${Date.now()}`

  async function createInvoice(
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

    const job =
      await prisma.job.findFirst({

        where: {
          id,
          orgId,
        },

      })

    if (!job) {
      notFound()
    }

    const customerId =
      String(
        formData.get("customerId")
      )

    const invoiceNumber =
      String(
        formData.get("invoiceNumber")
      ).trim()

    const status =
      String(
        formData.get("status")
      )

    const subtotal =
      new Prisma.Decimal(
        String(
          formData.get("subtotal") ?? "0"
        )
      )

    const tax =
      new Prisma.Decimal(
        String(
          formData.get("tax") ?? "0"
        )
      )

    const total =
      new Prisma.Decimal(
        String(
          formData.get("total") ?? "0"
        )
      )

    const dueDateValue =
      String(
        formData.get("dueDate") ?? ""
      )

    const dueDate =
      dueDateValue
        ? new Date(dueDateValue)
        : null

    await prisma.invoice.create({

      data: {

        orgId,

        customerId,

        jobId: job.id,

        invoiceNumber,

        subtotal,

        tax,

        total,

        dueDate,

        status,

      },

    })

    redirect(
      `/jobs/${job.id}/invoices`
    )

  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/invoices`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Invoices
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Create Invoice
        </h1>

        <p className="mt-2 text-slate-500">
          Create a new invoice for this job.
        </p>

      </div>

      <form
        action={createInvoice}
        className="space-y-8 rounded-3xl border bg-white p-8"
      >
                <div className="grid gap-8 lg:grid-cols-2">

          <div className="space-y-6">

            <div>

              <label className="mb-2 block font-medium">
                Customer
              </label>

              <select
                name="customerId"
                defaultValue={job.customer?.id ?? ""}
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
                  Select Customer
                </option>

                {customers.map((customer) => (

                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.companyName}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Invoice Number
              </label>

              <input
                name="invoiceNumber"
                defaultValue={invoiceNumber}
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
                Status
              </label>

              <select
                name="status"
                defaultValue="draft"
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                "
              >

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

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
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

          <div className="space-y-6">

            <div>

              <label className="mb-2 block font-medium">
                Subtotal
              </label>

              <input
                type="number"
                name="subtotal"
                step="0.01"
                min="0"
                defaultValue="0.00"
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
                Tax
              </label>

              <input
                type="number"
                name="tax"
                step="0.01"
                min="0"
                defaultValue="0.00"
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
                Total
              </label>

              <input
                type="number"
                name="total"
                step="0.01"
                min="0"
                defaultValue="0.00"
                required
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                text-lg
                font-semibold
                "
              />

            </div>

          </div>

        </div>
                <div className="grid gap-8 lg:grid-cols-2">

          <div className="rounded-3xl border bg-white p-6">

            <h2 className="text-xl font-semibold">
              Invoice Summary
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
                  Default Customer
                </dt>

                <dd className="font-medium">
                  {job.customer?.companyName ?? "-"}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Invoice Number
                </dt>

                <dd className="font-medium">
                  {invoiceNumber}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Initial Status
                </dt>

                <dd>
                  Draft
                </dd>

              </div>

            </dl>

          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

            <h2 className="text-xl font-semibold text-blue-900">
              Invoice Guidelines
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

              <p>

                Verify the selected customer before
                creating the invoice.

              </p>

              <p>

                Ensure subtotal, tax and total are
                correct before saving.

              </p>

              <p>

                Leave the invoice in
                <strong> Draft </strong>
                until it is ready to be sent.

              </p>

              <p>

                Payment records can be added after
                the invoice has been created.

              </p>

            </div>

          </div>

        </div>

        <div className="flex justify-end gap-4 border-t pt-8">

          <Link
            href={`/jobs/${job.id}/invoices`}
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
            Create Invoice
          </button>

        </div>

      </form>

    </div>

  )

}