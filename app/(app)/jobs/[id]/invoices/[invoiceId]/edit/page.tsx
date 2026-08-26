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
    invoiceId: string
  }>
}

export default async function EditInvoicePage({
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

  const invoice =
    await prisma.invoice.findFirst({

      where: {
        id: invoiceId,
        orgId,
        jobId: job.id,
      },

    })

  if (!invoice) {
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

  async function updateInvoice(
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

    const invoice =
      await prisma.invoice.findFirst({

        where: {
          id: invoiceId,
          orgId,
          jobId: job.id,
        },

      })

    if (!invoice) {
      notFound()
    }

    const customerId =
      String(
        formData.get("customerId")
      )

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

    const sentAtValue =
      String(
        formData.get("sentAt") ?? ""
      )

    const paidAtValue =
      String(
        formData.get("paidAt") ?? ""
      )

    await prisma.invoice.update({

      where: {
        id: invoice.id,
      },

      data: {

        customerId,

        status,

        subtotal,

        tax,

        total,

        dueDate:
          dueDateValue
            ? new Date(dueDateValue)
            : null,

        sentAt:
          sentAtValue
            ? new Date(sentAtValue)
            : null,

        paidAt:
          paidAtValue
            ? new Date(paidAtValue)
            : null,

      },

    })

    redirect(
      `/jobs/${job.id}/invoices/${invoice.id}`
    )

  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/invoices/${invoice.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Invoice
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Edit Invoice
        </h1>

        <p className="mt-2 text-slate-500">
          Update invoice information.
        </p>

      </div>

      <form
        action={updateInvoice}
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
                defaultValue={invoice.customerId}
                required
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                "
              >

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
                Status
              </label>

              <select
                name="status"
                defaultValue={invoice.status}
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

            <div className="grid gap-6 md:grid-cols-3">

              <div>

                <label className="mb-2 block font-medium">
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  defaultValue={
                    invoice.dueDate
                      ? invoice.dueDate
                          .toISOString()
                          .slice(0, 10)
                      : ""
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
                  Sent Date
                </label>

                <input
                  type="date"
                  name="sentAt"
                  defaultValue={
                    invoice.sentAt
                      ? invoice.sentAt
                          .toISOString()
                          .slice(0, 10)
                      : ""
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
                  defaultValue={
                    invoice.paidAt
                      ? invoice.paidAt
                          .toISOString()
                          .slice(0, 10)
                      : ""
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

          <div className="space-y-6">

            <div>

              <label className="mb-2 block font-medium">
                Subtotal
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                name="subtotal"
                defaultValue={invoice.subtotal.toString()}
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
                step="0.01"
                min="0"
                name="tax"
                defaultValue={invoice.tax.toString()}
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
                step="0.01"
                min="0"
                name="total"
                defaultValue={invoice.total.toString()}
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
                  Customer
                </dt>

                <dd className="font-medium">

                  {
                    customers.find(
                      (customer) =>
                        customer.id ===
                        invoice.customerId
                    )?.companyName ?? "-"

                  }

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

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

            <h2 className="text-xl font-semibold text-blue-900">
              Editing Guidelines
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

              <p>

                Verify the selected customer
                before saving changes.

              </p>

              <p>

                Ensure the subtotal, tax and
                total values accurately reflect
                the invoice.

              </p>

              <p>

                Update the invoice status as it
                progresses from Draft to Sent
                and finally Paid.

              </p>

              <p>

                Sent and Paid dates should match
                the actual billing activity for
                accurate reporting.

              </p>

            </div>

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