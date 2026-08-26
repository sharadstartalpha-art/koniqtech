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
    purchaseOrderId: string
  }>
}

export default async function DeletePurchaseOrderPage({
  params,
}: PageProps) {

  const {
    id,
    purchaseOrderId,
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

  const purchaseOrder =
    await prisma.purchaseOrder.findFirst({

      where: {
        id: purchaseOrderId,
        orgId,
        jobId: job.id,
      },

      include: {

        vendor: {

          select: {
            companyName: true,
            contactPerson: true,
            email: true,
            phone: true,
          },

        },

        items: {

          select: {
            id: true,
          },

        },

      },

    })

  if (!purchaseOrder) {
    notFound()
  }

  async function deletePurchaseOrder() {

    "use server"

    const session =
      await auth()

    if (!session?.user) {
      redirect("/login")
    }

    const orgId =
      (session.user as any).orgId

    const purchaseOrder =
      await prisma.purchaseOrder.findFirst({

        where: {
          id: purchaseOrderId,
          orgId,
          jobId: id,
        },

        select: {
          id: true,
        },

      })

    if (!purchaseOrder) {
      notFound()
    }

    await prisma.purchaseOrder.delete({

      where: {
        id: purchaseOrder.id,
      },

    })

    redirect(
      `/jobs/${id}/purchase-orders`
    )

  }

  return (

    <div className="mx-auto max-w-4xl space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/purchase-orders/${purchaseOrder.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Purchase Order
        </Link>

        <h1 className="mt-3 text-4xl font-bold text-red-600">
          Delete Purchase Order
        </h1>

        <p className="mt-2 text-slate-500">
          This action cannot be undone.
        </p>

      </div>

      <form
        action={deletePurchaseOrder}
        className="space-y-8"
      >
                <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

          <h2 className="text-2xl font-semibold text-red-700">
            Confirm Deletion
          </h2>

          <p className="mt-4 leading-7 text-red-700">

            You are about to permanently delete this
            purchase order. This action cannot be
            undone.

          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Purchase Order
            </h2>

            <dl className="mt-6 space-y-4">

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Order Number
                </dt>

                <dd className="font-medium">
                  {purchaseOrder.orderNumber}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Vendor
                </dt>

                <dd className="font-medium">
                  {purchaseOrder.vendor.companyName}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Status
                </dt>

                <dd className="capitalize">
                  {purchaseOrder.status}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Line Items
                </dt>

                <dd>
                  {purchaseOrder.items.length}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Created
                </dt>

                <dd>
                  {purchaseOrder.createdAt.toLocaleDateString()}
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
                  {purchaseOrder.subtotal.toLocaleString(
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
                  {purchaseOrder.tax.toLocaleString(
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
                  Discount
                </dt>

                <dd>
                  ₹
                  {purchaseOrder.discount.toLocaleString(
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
                  Shipping
                </dt>

                <dd>
                  ₹
                  {purchaseOrder.shipping.toLocaleString(
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
                  {purchaseOrder.total.toLocaleString(
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

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-xl font-semibold">
            Vendor Details
          </h2>

          <dl className="mt-6 grid gap-6 md:grid-cols-2">

            <div>

              <dt className="text-sm text-slate-500">
                Company
              </dt>

              <dd className="mt-1 font-medium">
                {purchaseOrder.vendor.companyName}
              </dd>

            </div>

            <div>

              <dt className="text-sm text-slate-500">
                Contact Person
              </dt>

              <dd className="mt-1">
                {purchaseOrder.vendor.contactPerson ??
                  "—"}
              </dd>

            </div>

            <div>

              <dt className="text-sm text-slate-500">
                Email
              </dt>

              <dd className="mt-1">
                {purchaseOrder.vendor.email ?? "—"}
              </dd>

            </div>

            <div>

              <dt className="text-sm text-slate-500">
                Phone
              </dt>

              <dd className="mt-1">
                {purchaseOrder.vendor.phone ?? "—"}
              </dd>

            </div>

          </dl>

        </div>

        <div className="flex justify-end gap-4 border-t pt-8">

          <Link
            href={`/jobs/${job.id}/purchase-orders/${purchaseOrder.id}`}
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
            Delete Purchase Order
          </button>

        </div>

      </form>

    </div>

  )

}