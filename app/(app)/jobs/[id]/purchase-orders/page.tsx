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

export default async function JobPurchaseOrdersPage({
  params,
}: PageProps) {

  const {
    id,
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

  const purchaseOrders =
    await prisma.purchaseOrder.findMany({

      where: {
        orgId,
        jobId: job.id,
      },

      include: {

        vendor: {
          select: {
            id: true,
            companyName: true,
            phone: true,
            email: true,
          },
        },

        items: {
          select: {
            id: true,
          },
        },

      },

      orderBy: {
        createdAt: "desc",
      },

    })

  function badgeColor(
    status: string
  ) {

    switch (
      status.toLowerCase()
    ) {

      case "draft":
        return "bg-slate-100 text-slate-700"

      case "ordered":
        return "bg-blue-100 text-blue-700"

      case "received":
        return "bg-green-100 text-green-700"

      case "cancelled":
        return "bg-red-100 text-red-700"

      default:
        return "bg-amber-100 text-amber-700"

    }

  }

  return (

    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <Link
            href={`/jobs/${job.id}`}
            className="text-blue-600 hover:underline"
          >
            ← Back to Job
          </Link>

          <h1 className="mt-3 text-4xl font-bold">
            Purchase Orders
          </h1>

          <p className="mt-2 text-slate-500">

            Manage purchase orders for
            this job.

          </p>

        </div>

        <Link
          href={`/jobs/${job.id}/purchase-orders/create`}
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
          New Purchase Order
        </Link>

      </div>

      <div className="rounded-3xl border bg-white overflow-hidden">

        <table className="min-w-full">

          <thead className="border-b bg-slate-50">

            <tr className="text-left text-sm font-semibold text-slate-600">

              <th className="px-6 py-4">
                Order #
              </th>

              <th className="px-6 py-4">
                Vendor
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4">
                Items
              </th>

              <th className="px-6 py-4">
                Total
              </th>

              <th className="px-6 py-4">
                Expected
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y">
                      {purchaseOrders.length === 0 ? (

            <tr>

              <td
                colSpan={7}
                className="px-6 py-16 text-center text-slate-500"
              >

                <p className="text-lg font-medium">
                  No purchase orders found.
                </p>

                <p className="mt-2">
                  Create your first purchase order
                  for this job.
                </p>

              </td>

            </tr>

          ) : (

            purchaseOrders.map((purchaseOrder) => (

              <tr
                key={purchaseOrder.id}
                className="hover:bg-slate-50"
              >

                <td className="px-6 py-5">

                  <div className="font-semibold">
                    {purchaseOrder.orderNumber}
                  </div>

                  <div className="mt-1 text-sm text-slate-500">

                    Created{" "}

                    {new Date(
                      purchaseOrder.createdAt
                    ).toLocaleDateString()}

                  </div>

                </td>

                <td className="px-6 py-5">

                  <div className="font-medium">
                    {purchaseOrder.vendor.companyName}
                  </div>

                  <div className="mt-1 text-sm text-slate-500">

                    {purchaseOrder.vendor.email ?? "-"}

                  </div>

                  <div className="text-sm text-slate-500">

                    {purchaseOrder.vendor.phone ?? "-"}

                  </div>

                </td>

                <td className="px-6 py-5">

                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      ${badgeColor(
                        purchaseOrder.status
                      )}
                    `}
                  >

                    {purchaseOrder.status}

                  </span>

                </td>

                <td className="px-6 py-5">

                  {purchaseOrder.items.length}

                </td>

                <td className="px-6 py-5 font-semibold">

                  ₹
                  {purchaseOrder.total.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}

                </td>

                <td className="px-6 py-5">

                  {purchaseOrder.expectedDate
                    ? new Date(
                        purchaseOrder.expectedDate
                      ).toLocaleDateString()
                    : "-"}

                </td>

                <td className="px-6 py-5">

                  <div className="flex justify-end gap-2">

                    <Link
                      href={`/jobs/${job.id}/purchase-orders/${purchaseOrder.id}`}
                      className="
                      rounded-lg
                      border
                      px-3
                      py-2
                      text-sm
                      hover:bg-slate-100
                      "
                    >
                      View
                    </Link>

                    <Link
                      href={`/jobs/${job.id}/purchase-orders/${purchaseOrder.id}/edit`}
                      className="
                      rounded-lg
                      border
                      px-3
                      py-2
                      text-sm
                      hover:bg-slate-100
                      "
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/jobs/${job.id}/purchase-orders/${purchaseOrder.id}/delete`}
                      className="
                      rounded-lg
                      border
                      border-red-300
                      px-3
                      py-2
                      text-sm
                      text-red-600
                      hover:bg-red-50
                      "
                    >
                      Delete
                    </Link>

                  </div>

                </td>

              </tr>

            ))

          )}

          </tbody>

        </table>

      </div>
            <div className="grid gap-6 lg:grid-cols-4">

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Purchase Orders
          </p>

          <p className="mt-2 text-3xl font-bold">
            {purchaseOrders.length}
          </p>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Total Value
          </p>

          <p className="mt-2 text-3xl font-bold">

            ₹

            {purchaseOrders
              .reduce(
                (sum, po) => sum + po.total,
                0
              )
              .toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}

          </p>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Ordered
          </p>

          <p className="mt-2 text-3xl font-bold">

            {
              purchaseOrders.filter(
                (po) =>
                  po.status.toLowerCase() ===
                  "ordered"
              ).length
            }

          </p>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Received
          </p>

          <p className="mt-2 text-3xl font-bold">

            {
              purchaseOrders.filter(
                (po) =>
                  po.status.toLowerCase() ===
                  "received"
              ).length
            }

          </p>

        </div>

      </div>

      <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

        <h2 className="text-xl font-semibold text-blue-900">
          Purchase Order Overview
        </h2>

        <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

          <p>

            Purchase orders track materials,
            equipment and services ordered from
            vendors specifically for this job.

          </p>

          <p>

            Each purchase order contains one or
            more line items along with pricing,
            taxes, shipping costs and expected
            delivery dates.

          </p>

          <p>

            Keeping purchase orders up to date
            helps monitor procurement progress,
            project costs and vendor performance.

          </p>

        </div>

      </div>

    </div>

  )

}