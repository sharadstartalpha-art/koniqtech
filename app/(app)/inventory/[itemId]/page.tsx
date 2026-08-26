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
    itemId: string;
  }>;
}

export default async function InventoryItemPage({
  params,
}: PageProps) {

  const {
    itemId,
  } = await params;

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

  const item =
    await prisma.inventoryItem.findFirst({

      where: {
        id: itemId,
        orgId,
      },

      include: {

        _count: {

          select: {

            purchaseItems: true,

            transactions: true,

            inventoryAdjustments: true,

            inventoryCounts: true,

            warehouseStock: true,

          },

        },

      },

    });

  if (!item) {
    notFound();
  }

  return (

    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex items-start justify-between">

        <div>

          <Link
            href="/inventory"
            className="text-blue-600 hover:underline"
          >
            ← Back to Inventory
          </Link>

          <h1 className="mt-3 text-4xl font-bold">

            {item.name}

          </h1>

          <p className="mt-2 text-slate-600">

            Inventory Item Details

          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/inventory/${item.id}/edit`}
            className="rounded-xl border px-5 py-3 hover:bg-slate-100"
          >
            Edit
          </Link>

          <Link
            href={`/inventory/${item.id}/delete`}
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
              Item Information
            </h2>

            <dl className="mt-8 grid gap-6 md:grid-cols-2">
                              <div>

                <dt className="text-sm text-slate-500">
                  Item Name
                </dt>

                <dd className="mt-1 font-semibold">
                  {item.name}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  SKU
                </dt>

                <dd className="mt-1">
                  {item.sku ?? "-"}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Quantity On Hand
                </dt>

                <dd className="mt-1">

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      item.qty <= 0
                        ? "bg-red-100 text-red-700"
                        : item.qty < 10
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.qty}
                  </span>

                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Unit
                </dt>

                <dd className="mt-1">
                  {item.unit ?? "-"}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Unit Price
                </dt>

                <dd className="mt-1 font-semibold">

                  $
                  {Number(
                    item.unitPrice ?? 0
                  ).toFixed(2)}

                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Reorder Level
                </dt>

                <dd className="mt-1">
                  {item.reorderLevel ?? "-"}
                </dd>

              </div>

              <div className="md:col-span-2">

                <dt className="text-sm text-slate-500">
                  Description
                </dt>

                <dd className="mt-1 whitespace-pre-wrap">

                  {item.description ??
                    "No description available."}

                </dd>

              </div>

            </dl>

          </div>

        </div>

        <div className="space-y-8">

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Inventory Statistics
            </h2>

            <dl className="mt-6 space-y-5">

              <div>

                <dt className="text-sm text-slate-500">
                  Purchase Orders
                </dt>

                <dd className="mt-1 font-semibold">
                  {item._count.purchaseItems}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Transactions
                </dt>

                <dd className="mt-1 font-semibold">
                  {item._count.transactions}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Stock Adjustments
                </dt>

                <dd className="mt-1 font-semibold">
                  {item._count.inventoryAdjustments}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Inventory Counts
                </dt>

                <dd className="mt-1 font-semibold">
                  {item._count.inventoryCounts}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Warehouse Locations
                </dt>

                <dd className="mt-1 font-semibold">
                  {item._count.warehouseStock}
                </dd>

              </div>

            </dl>

          </div>
                    <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

            <h2 className="text-xl font-semibold text-blue-900">
              Inventory Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

              <p>

                This inventory item is currently
                tracking
                <strong>
                  {" "}
                  {item.qty}
                  {" "}
                  {item.unit ?? "Units"}
                </strong>
                {" "}
                in stock.

              </p>

              <p>

                Unit Price:
                <strong>

                  {" "}
                  $
                  {Number(
                    item.unitPrice ?? 0
                  ).toFixed(2)}

                </strong>

              </p>

              <p>

                Estimated Inventory Value:
                <strong>

                  {" "}
                  $
                  {(
                    item.qty *
                    Number(item.unitPrice ?? 0)
                  ).toFixed(2)}

                </strong>

              </p>

              <p>

                Reorder Level:
                <strong>

                  {" "}
                  {item.reorderLevel ?? "Not Set"}

                </strong>

              </p>

              <p>

                Created On:
                <strong>

                  {" "}
                  {item.createdAt.toLocaleDateString()}

                </strong>

              </p>

            </div>

            <div className="mt-8 grid gap-3">

              <Link
                href="/inventory/history"
                className="rounded-xl border bg-white px-5 py-3 hover:bg-slate-50"
              >
                View Transaction History
              </Link>

              <Link
                href="/inventory/adjustments"
                className="rounded-xl border bg-white px-5 py-3 hover:bg-slate-50"
              >
                Stock Adjustments
              </Link>

              <Link
                href="/inventory/counts"
                className="rounded-xl border bg-white px-5 py-3 hover:bg-slate-50"
              >
                Inventory Counts
              </Link>

              <Link
                href="/purchase-orders"
                className="rounded-xl border bg-white px-5 py-3 hover:bg-slate-50"
              >
                Purchase Orders
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}