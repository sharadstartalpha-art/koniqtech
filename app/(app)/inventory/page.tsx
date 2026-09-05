import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";
import {
  canView,
  canCreate,
  canEdit,
  canDelete,
} from "@/shared/lib/permissions";

import Link from "next/link";

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {

  const session = await auth();

if (!session?.user) {
  redirect("/login");
}

const dbUser = await prisma.user.findUnique({
  where: {
    email: session.user.email!,
  },
  include: {
    organizationRole: {
      include: {
        permissions: true,
      },
    },
  },
});

if (!dbUser) {
  redirect("/login");
}

const permissions =
  dbUser.organizationRole?.permissions ?? [];

const isOwner =
  dbUser.organizationRole?.name === "Owner";

if (!canView(permissions, "Inventory", isOwner)) {
  redirect("/unauthorized");
}

const orgId = dbUser.orgId;

if (!orgId) {
  redirect("/welcome");
}

  const [
    inventoryItems,
    totalItems,
    totalStock,
    recentAdjustments,
    recentCounts,
  ] = await Promise.all([

    prisma.inventoryItem.findMany({

      where: {
        orgId,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {

        _count: {

          select: {
            purchaseItems: true,
            transactions: true,
          },

        },

      },

    }),

    prisma.inventoryItem.count({

      where: {
        orgId,
      },

    }),

    prisma.inventoryItem.aggregate({

      where: {
        orgId,
      },

      _sum: {
        qty: true,
      },

    }),

    prisma.inventoryAdjustment.count({

      where: {
        orgId,
      },

    }),

    prisma.inventoryCount.count({

      where: {
        orgId,
      },

    }),

  ]);

  return (

    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex items-start justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Inventory
          </h1>

          <p className="mt-2 text-slate-600">
            Manage inventory items, stock levels,
            warehouse transactions and purchasing.
          </p>

        </div>

        {canCreate(permissions, "Inventory", isOwner) && (
  <Link
    href="/inventory/create"
    className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
  >
    + New Inventory Item
  </Link>
)}

      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-3xl border bg-white p-6">

          <div className="text-sm text-slate-500">
            Inventory Items
          </div>

          <div className="mt-3 text-3xl font-bold">
            {totalItems}
          </div>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <div className="text-sm text-slate-500">
            Total Quantity
          </div>

          <div className="mt-3 text-3xl font-bold text-blue-600">
            {totalStock._sum.qty ?? 0}
          </div>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <div className="text-sm text-slate-500">
            Stock Adjustments
          </div>

          <div className="mt-3 text-3xl font-bold text-orange-600">
            {recentAdjustments}
          </div>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <div className="text-sm text-slate-500">
            Inventory Counts
          </div>

          <div className="mt-3 text-3xl font-bold text-green-600">
            {recentCounts}
          </div>

        </div>

      </div>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-2xl font-semibold">
            Inventory Items
          </h2>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">

            {inventoryItems.length}
            {" "}
            Item
            {inventoryItems.length === 1 ? "" : "s"}

          </span>

        </div>
                {inventoryItems.length === 0 ? (

          <div className="p-16 text-center">

            <h3 className="text-2xl font-semibold">
              No Inventory Items
            </h3>

            <p className="mt-3 text-slate-500">
              Create your first inventory item to
              start tracking stock.
            </p>

           {canCreate(permissions, "Inventory", isOwner) && (
  <Link
    href="/inventory/create"
    className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
  >
    Create Inventory Item
  </Link>
)}

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-50">

                <tr className="border-b">

                  <th className="px-6 py-4 text-left">
                    Item
                  </th>

                  <th className="px-6 py-4 text-left">
                    SKU
                  </th>

                  <th className="px-6 py-4 text-left">
                    Quantity
                  </th>

                  <th className="px-6 py-4 text-left">
                    Unit Price
                  </th>

                  <th className="px-6 py-4 text-left">
                    Purchases
                  </th>

                  <th className="px-6 py-4 text-left">
                    Transactions
                  </th>

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {inventoryItems.map(
                  (item) => (

                    <tr
                      key={item.id}
                      className="border-b hover:bg-slate-50"
                    >

                      <td className="px-6 py-5">

                        <div className="font-semibold">
                          {item.name}
                        </div>

                      </td>

                      <td className="px-6 py-5">
                        {item.sku ?? "-"}
                      </td>

                      <td className="px-6 py-5">

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

                      </td>

                      <td className="px-6 py-5">

                        $
                        {Number(
                          item.unitPrice ?? 0
                        ).toFixed(2)}

                      </td>

                      <td className="px-6 py-5">

                        {item._count.purchaseItems}

                      </td>

                      <td className="px-6 py-5">

                        {item._count.transactions}

                      </td>

                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          <Link
                            href={`/inventory/${item.id}`}
                            className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-100"
                          >
                            View
                          </Link>

                          {canEdit(permissions, "Inventory", isOwner) && (
  <Link
    href={`/inventory/${item.id}/edit`}
    className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-100"
  >
    Edit
  </Link>
)}

                          {canDelete(permissions, "Inventory", isOwner) && (
  <Link
    href={`/inventory/${item.id}/delete`}
    className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
  >
    Delete
  </Link>
)}

                        </div>

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
          Inventory Summary
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">

          <div>

            <div className="text-sm text-blue-700">
              Total Inventory Items
            </div>

            <div className="mt-1 text-2xl font-bold">
              {totalItems}
            </div>

          </div>

          <div>

            <div className="text-sm text-blue-700">
              Total Stock Quantity
            </div>

            <div className="mt-1 text-2xl font-bold">
              {totalStock._sum.qty ?? 0}
            </div>

          </div>

          <div>

            <div className="text-sm text-blue-700">
              Inventory Adjustments
            </div>

            <div className="mt-1 text-2xl font-bold">
              {recentAdjustments}
            </div>

          </div>

          <div>

            <div className="text-sm text-blue-700">
              Inventory Counts
            </div>

            <div className="mt-1 text-2xl font-bold">
              {recentCounts}
            </div>

          </div>

        </div>

        <div className="mt-8 flex flex-wrap gap-4">

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
            href="/inventory/transfers"
            className="rounded-xl border bg-white px-5 py-3 hover:bg-slate-50"
          >
            Warehouse Transfers
          </Link>

          <Link
            href="/inventory/history"
            className="rounded-xl border bg-white px-5 py-3 hover:bg-slate-50"
          >
            Transaction History
          </Link>

        </div>

      </div>

    </div>

  );

}