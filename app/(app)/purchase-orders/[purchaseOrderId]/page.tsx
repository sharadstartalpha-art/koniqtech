import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import {
  notFound,
  redirect,
} from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    purchaseOrderId: string;
  }>;
}

function badgeColor(status: string) {
  switch (status.toLowerCase()) {
    case "draft":
      return "bg-slate-100 text-slate-700";

    case "ordered":
      return "bg-blue-100 text-blue-700";

    case "received":
      return "bg-green-100 text-green-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default async function PurchaseOrderPage({
  params,
}: PageProps) {
  const {
    purchaseOrderId,
  } = await params;

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

  const purchaseOrder =
    await prisma.purchaseOrder.findFirst({

      where: {
        id: purchaseOrderId,
        orgId,
      },

      include: {

        vendor: {

          select: {
            id: true,
            companyName: true,
            contactPerson: true,
            email: true,
            phone: true,
            paymentTerms: true,
          },

        },

        job: {

          select: {
            id: true,
            title: true,
          },

        },

        items: {

          include: {

            inventoryItem: {

              select: {
                id: true,
                name: true,
                sku: true,
              },

            },

          },

          orderBy: {
            description: "asc",
          },

        },

      },

    });

  if (!purchaseOrder) {
    notFound();
  }

  return (

    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex items-start justify-between">

        <div>

          <Link
            href="/purchase-orders"
            className="text-blue-600 hover:underline"
          >
            ← Back to Purchase Orders
          </Link>

          <h1 className="mt-3 text-4xl font-bold">

            {purchaseOrder.orderNumber}

          </h1>

          <div className="mt-3 flex items-center gap-3">

            <span
              className={`
                inline-flex
                rounded-full
                px-3
                py-1
                text-sm
                font-semibold
                ${badgeColor(
                  purchaseOrder.status
                )}
              `}
            >
              {purchaseOrder.status}
            </span>

            {purchaseOrder.job && (

              <Link
                href={`/jobs/${purchaseOrder.job.id}`}
                className="text-blue-600 hover:underline"
              >
                {purchaseOrder.job.title}
              </Link>

            )}

          </div>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/purchase-orders/${purchaseOrder.id}/edit`}
            className="rounded-xl border px-5 py-3 hover:bg-slate-100"
          >
            Edit
          </Link>

          <Link
            href={`/purchase-orders/${purchaseOrder.id}/delete`}
            className="rounded-xl border border-red-300 px-5 py-3 text-red-600 hover:bg-red-50"
          >
            Delete
          </Link>

        </div>

      </div>

      <div className="grid gap-8 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-2xl font-semibold">
              Purchase Order Details
            </h2>

            <dl className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <dt className="text-sm text-slate-500">
                  Order Number
                </dt>

                <dd className="mt-1 font-semibold">
                  {purchaseOrder.orderNumber}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Status
                </dt>

                <dd className="mt-1 capitalize">
                  {purchaseOrder.status}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Ordered Date
                </dt>

                <dd className="mt-1">

                  {purchaseOrder.orderedAt
                    ? purchaseOrder.orderedAt.toLocaleDateString()
                    : "Not Set"}

                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Expected Delivery
                </dt>

                <dd className="mt-1">

                  {purchaseOrder.expectedDate
                    ? purchaseOrder.expectedDate.toLocaleDateString()
                    : "Not Set"}

                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Received Date
                </dt>

                <dd className="mt-1">

                  {purchaseOrder.receivedAt
                    ? purchaseOrder.receivedAt.toLocaleDateString()
                    : "Not Received"}

                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Created
                </dt>

                <dd className="mt-1">
                  {purchaseOrder.createdAt.toLocaleDateString()}
                </dd>

              </div>

            </dl>

          </div>

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-2xl font-semibold">
              Vendor Information
            </h2>

            <dl className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <dt className="text-sm text-slate-500">
                  Company
                </dt>

                <dd className="mt-1 font-semibold">
                  {purchaseOrder.vendor.companyName}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Contact Person
                </dt>

                <dd className="mt-1">
                  {purchaseOrder.vendor.contactPerson ?? "—"}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Email
                </dt>

                <dd className="mt-1 break-all">
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

              <div>

                <dt className="text-sm text-slate-500">
                  Payment Terms
                </dt>

                <dd className="mt-1">
                  {purchaseOrder.vendor.paymentTerms ?? "—"}
                </dd>

              </div>

              {purchaseOrder.job && (

                <div>

                  <dt className="text-sm text-slate-500">
                    Related Job
                  </dt>

                  <dd className="mt-1">

                    <Link
                      href={`/jobs/${purchaseOrder.job.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {purchaseOrder.job.title}
                    </Link>

                  </dd>

                </div>

              )}

            </dl>

          </div>

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-2xl font-semibold">
              Notes
            </h2>

            <div className="mt-6 whitespace-pre-wrap leading-7 text-slate-700">

              {purchaseOrder.notes ||
                "No notes available."}

            </div>

          </div>

        </div>

        <div className="space-y-8">
                      <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Financial Summary
            </h2>

            <div className="mt-8 space-y-5">

              <div className="flex justify-between">

                <span>Subtotal</span>

                <strong>

                  $
                  {purchaseOrder.subtotal.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}

                </strong>

              </div>

              <div className="flex justify-between">

                <span>Tax</span>

                <strong>

                  $
                  {purchaseOrder.tax.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}

                </strong>

              </div>

              <div className="flex justify-between">

                <span>Discount</span>

                <strong>

                  $
                  {purchaseOrder.discount.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}

                </strong>

              </div>

              <div className="flex justify-between">

                <span>Shipping</span>

                <strong>

                  $
                  {purchaseOrder.shipping.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}

                </strong>

              </div>

              <hr />

              <div className="flex justify-between text-lg font-bold">

                <span>Total</span>

                <span>

                  $
                  {purchaseOrder.total.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}

                </span>

              </div>

            </div>

          </div>

          <div className="rounded-3xl border bg-white p-8">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-semibold">
                Purchase Order Items
              </h2>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">

                {purchaseOrder.items.length} Item
                {purchaseOrder.items.length === 1
                  ? ""
                  : "s"}

              </span>

            </div>

            {purchaseOrder.items.length === 0 ? (

              <div className="py-12 text-center text-slate-500">

                No purchase order items found.

              </div>

            ) : (

              <div className="mt-6 overflow-x-auto">

                <table className="min-w-full">

                  <thead className="border-b bg-slate-50">

                    <tr>

                      <th className="px-4 py-3 text-left">
                        Description
                      </th>

                      <th className="px-4 py-3 text-left">
                        Inventory Item
                      </th>

                      <th className="px-4 py-3 text-right">
                        Qty
                      </th>

                      <th className="px-4 py-3 text-right">
                        Unit Price
                      </th>

                      <th className="px-4 py-3 text-right">
                        Tax
                      </th>

                      <th className="px-4 py-3 text-right">
                        Total
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {purchaseOrder.items.map(
                      (item) => (

                        <tr
                          key={item.id}
                          className="border-b"
                        >

                          <td className="px-4 py-4">

                            {item.description}

                          </td>

                          <td className="px-4 py-4">

                            {item.inventoryItem
                              ? `${item.inventoryItem.name}${
                                  item.inventoryItem.sku
                                    ? ` (${item.inventoryItem.sku})`
                                    : ""
                                }`
                              : "—"}

                          </td>

                          <td className="px-4 py-4 text-right">

                            {item.quantity}

                          </td>

                          <td className="px-4 py-4 text-right">

                            $
                            {item.unitPrice.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}

                          </td>

                          <td className="px-4 py-4 text-right">

                            $
                            {item.tax.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}

                          </td>

                          <td className="px-4 py-4 text-right font-semibold">

                            $
                            {item.total.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

            <h2 className="text-xl font-semibold text-blue-900">
              Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

              <p>

                Vendor:
                <strong>
                  {" "}
                  {purchaseOrder.vendor.companyName}
                </strong>

              </p>

              {purchaseOrder.job && (

                <p>

                  Related Job:
                  <strong>
                    {" "}
                    {purchaseOrder.job.title}
                  </strong>

                </p>

              )}

              <p>

                Total Line Items:
                <strong>
                  {" "}
                  {purchaseOrder.items.length}
                </strong>

              </p>

              <p>

                Purchase Order Value:
                <strong>

                  {" "}
                  $
                  {purchaseOrder.total.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}

                </strong>

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}