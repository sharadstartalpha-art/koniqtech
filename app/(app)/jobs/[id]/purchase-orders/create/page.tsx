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

export default async function CreatePurchaseOrderPage({
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

  const vendors =
    await prisma.vendor.findMany({

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

  const orderNumber =
    `PO-${Date.now()}`

  async function createPurchaseOrder(
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

    const vendorId =
      String(
        formData.get("vendorId")
      )

    const orderNumber =
      String(
        formData.get("orderNumber")
      ).trim()

    const status =
      String(
        formData.get("status")
      )

    const subtotal =
      Number(
        formData.get("subtotal") ?? 0
      )

    const tax =
      Number(
        formData.get("tax") ?? 0
      )

    const discount =
      Number(
        formData.get("discount") ?? 0
      )

    const shipping =
      Number(
        formData.get("shipping") ?? 0
      )

    const total =
      Number(
        formData.get("total") ?? 0
      )

    const orderedAt =
      String(
        formData.get("orderedAt") ?? ""
      )

    const expectedDate =
      String(
        formData.get("expectedDate") ?? ""
      )

    const notes =
      String(
        formData.get("notes") ?? ""
      ).trim()

    await prisma.purchaseOrder.create({

      data: {

        orgId,

        vendorId,

        jobId: job.id,

        orderNumber,

        status,

        subtotal,

        tax,

        discount,

        shipping,

        total,

        orderedAt:
          orderedAt
            ? new Date(orderedAt)
            : null,

        expectedDate:
          expectedDate
            ? new Date(expectedDate)
            : null,

        notes:
          notes || null,

      },

    })

    redirect(
      `/jobs/${job.id}/purchase-orders`
    )

  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/purchase-orders`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Purchase Orders
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Create Purchase Order
        </h1>

        <p className="mt-2 text-slate-500">
          Create a new purchase order for this job.
        </p>

      </div>

      <form
        action={createPurchaseOrder}
        className="space-y-8 rounded-3xl border bg-white p-8"
      >
                <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              Vendor
            </label>

            <select
              name="vendorId"
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
                Select Vendor
              </option>

              {vendors.map((vendor) => (

                <option
                  key={vendor.id}
                  value={vendor.id}
                >
                  {vendor.companyName}
                </option>

              ))}

            </select>

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Order Number
            </label>

            <input
              name="orderNumber"
              defaultValue={orderNumber}
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

        <div className="grid gap-6 md:grid-cols-3">

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

              <option value="ordered">
                Ordered
              </option>

              <option value="received">
                Received
              </option>

              <option value="cancelled">
                Cancelled
              </option>

            </select>

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Ordered Date
            </label>

            <input
              type="date"
              name="orderedAt"
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
              Expected Date
            </label>

            <input
              type="date"
              name="expectedDate"
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
            placeholder="Internal notes..."
          />

        </div>

        <div className="grid gap-6 md:grid-cols-5">

          <div>

            <label className="mb-2 block font-medium">
              Subtotal
            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              name="subtotal"
              defaultValue="0"
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
              defaultValue="0"
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
              Discount
            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              name="discount"
              defaultValue="0"
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
              Shipping
            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              name="shipping"
              defaultValue="0"
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
              defaultValue="0"
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
                <div className="grid gap-8 lg:grid-cols-2">

          <div className="rounded-3xl border bg-white p-6">

            <h2 className="text-xl font-semibold">
              Purchase Order Guidelines
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">

              <p>

                Select the correct vendor before
                creating the purchase order.

              </p>

              <p>

                Order numbers should remain unique
                across your organization.

              </p>

              <p>

                Ensure the financial totals are
                reviewed before saving the purchase
                order.

              </p>

              <p>

                Purchase order items can be added
                after the purchase order has been
                created.

              </p>

            </div>

          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

            <h2 className="text-xl font-semibold text-blue-900">
              Financial Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

              <p>

                The <strong>Total</strong> should
                include subtotal, taxes, shipping
                and any discounts applied.

              </p>

              <p>

                Taxes and shipping can be updated
                later if vendor invoices change.

              </p>

              <p>

                After creation you'll be able to
                add purchase order line items and
                attach supporting documents.

              </p>

            </div>

          </div>

        </div>

        <div className="flex justify-end gap-4 border-t pt-8">

          <Link
            href={`/jobs/${job.id}/purchase-orders`}
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
            Create Purchase Order
          </button>

        </div>

      </form>

    </div>

  )

}