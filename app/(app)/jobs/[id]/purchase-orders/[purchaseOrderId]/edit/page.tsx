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

export default async function EditPurchaseOrderPage({
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

    })

  if (!purchaseOrder) {
    notFound()
  }

  const vendors =
    await prisma.vendor.findMany({

      where: {
        orgId,
        active: true,
      },

      orderBy: {
        companyName: "asc",
      },

      select: {
        id: true,
        companyName: true,
      },

    })

  async function updatePurchaseOrder(
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

    const purchaseOrder =
      await prisma.purchaseOrder.findFirst({

        where: {
          id: purchaseOrderId,
          orgId,
          jobId: job.id,
        },

      })

    if (!purchaseOrder) {
      notFound()
    }

    const vendorId =
      String(
        formData.get("vendorId")
      )

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

    const receivedAt =
      String(
        formData.get("receivedAt") ?? ""
      )

    const notes =
      String(
        formData.get("notes") ?? ""
      ).trim()

    await prisma.purchaseOrder.update({

      where: {
        id: purchaseOrder.id,
      },

      data: {

        vendorId,

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

        receivedAt:
          receivedAt
            ? new Date(receivedAt)
            : null,

        notes:
          notes || null,

      },

    })

    redirect(
      `/jobs/${job.id}/purchase-orders/${purchaseOrder.id}`
    )

  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/purchase-orders/${purchaseOrder.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Purchase Order
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Edit Purchase Order
        </h1>

        <p className="mt-2 text-slate-500">
          Update purchase order information.
        </p>

      </div>

      <form
        action={updatePurchaseOrder}
        className="space-y-8 rounded-3xl border bg-white p-8"
      >
                <div className="grid gap-8 lg:grid-cols-2">

          <div className="space-y-6">

            <div>

              <label className="mb-2 block font-medium">
                Vendor
              </label>

              <select
                name="vendorId"
                defaultValue={purchaseOrder.vendorId}
                required
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                "
              >

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
                Status
              </label>

              <select
                name="status"
                defaultValue={purchaseOrder.status}
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

            <div className="grid gap-6 md:grid-cols-3">

              <div>

                <label className="mb-2 block font-medium">
                  Ordered
                </label>

                <input
                  type="date"
                  name="orderedAt"
                  defaultValue={
                    purchaseOrder.orderedAt
                      ? purchaseOrder.orderedAt
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
                  Expected
                </label>

                <input
                  type="date"
                  name="expectedDate"
                  defaultValue={
                    purchaseOrder.expectedDate
                      ? purchaseOrder.expectedDate
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
                  Received
                </label>

                <input
                  type="date"
                  name="receivedAt"
                  defaultValue={
                    purchaseOrder.receivedAt
                      ? purchaseOrder.receivedAt
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

            <div>

              <label className="mb-2 block font-medium">
                Notes
              </label>

              <textarea
                name="notes"
                rows={6}
                defaultValue={purchaseOrder.notes ?? ""}
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

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium">
                  Subtotal
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="subtotal"
                  defaultValue={purchaseOrder.subtotal}
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
                  defaultValue={purchaseOrder.tax}
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
                  defaultValue={purchaseOrder.discount}
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
                  defaultValue={purchaseOrder.shipping}
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
                Total
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                name="total"
                defaultValue={purchaseOrder.total}
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
              Purchase Order Summary
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
                  {
                    vendors.find(
                      (vendor) =>
                        vendor.id ===
                        purchaseOrder.vendorId
                    )?.companyName ?? "-"
                  }
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

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Last Updated
                </dt>

                <dd>

                  {purchaseOrder.updatedAt.toLocaleDateString()}

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

                Verify vendor information before
                saving any changes.

              </p>

              <p>

                Ensure financial values accurately
                reflect the latest supplier quote.

              </p>

              <p>

                Update expected and received dates
                as the order progresses.

              </p>

              <p>

                Purchase order line items remain
                associated with this purchase order
                after updates.

              </p>

            </div>

          </div>

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