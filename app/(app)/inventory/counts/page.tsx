import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function InventoryCountsPage({
  searchParams,
}: PageProps) {

  const {
    search = "",
  } = await searchParams;

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

  const counts =
    await prisma.inventoryCount.findMany({

      where: {

        orgId,

        ...(search
          ? {

              inventoryItem: {

                name: {

                  contains: search,

                  mode: "insensitive",

                },

              },

            }
          : {}),

      },

      include: {

        inventoryItem: {

          select: {

            id: true,

            name: true,

            sku: true,

          },

        },

        warehouse: {

          select: {

            id: true,

            name: true,

          },

        },

        countedBy: {

          select: {

            id: true,

            name: true,

          },

        },

      },

      orderBy: {

        countedAt: "desc",

      },

    });

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Inventory Counts
          </h1>

          <p className="mt-2 text-slate-600">
            View and manage physical inventory counts.
          </p>

        </div>

        <Link
          href="/inventory/counts/create"
          className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          + New Count
        </Link>

      </div>

      <form>

        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Search inventory item..."
          className="w-full rounded-xl border px-4 py-3"
        />

      </form>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-6 py-4 text-left">
                Item
              </th>

              <th className="px-6 py-4 text-left">
                Warehouse
              </th>

              <th className="px-6 py-4 text-left">
                Counted Qty
              </th>

              <th className="px-6 py-4 text-left">
                Counted By
              </th>

              <th className="px-6 py-4 text-left">
                Date
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>
                      {counts.length === 0 ? (

            <tr>

              <td
                colSpan={6}
                className="px-6 py-12 text-center text-slate-500"
              >
                No inventory counts found.
              </td>

            </tr>

          ) : (

            counts.map((count) => (

              <tr
                key={count.id}
                className="border-t"
              >

                <td className="px-6 py-4">

                  <Link
                    href={`/inventory/${count.inventoryItem.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {count.inventoryItem.name}
                  </Link>

                  <div className="text-sm text-slate-500">
                    {count.inventoryItem.sku ?? "-"}
                  </div>

                </td>

                <td className="px-6 py-4">
                  {count.warehouse.name}
                </td>

                <td className="px-6 py-4">

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">

                    {count.countedQty}

                  </span>

                </td>

                <td className="px-6 py-4">

                  {count.countedBy.name}

                </td>

                <td className="px-6 py-4">

                  {count.countedAt.toLocaleDateString()}

                </td>

                <td className="px-6 py-4 text-right">

                  <div className="flex justify-end gap-3">

                    <Link
                      href={`/inventory/counts/${count.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>

                    <Link
                      href={`/inventory/counts/${count.id}/edit`}
                      className="text-amber-600 hover:underline"
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/inventory/counts/${count.id}/delete`}
                      className="text-red-600 hover:underline"
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

      <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

        <h2 className="text-xl font-semibold text-blue-900">
          Inventory Count Summary
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-4">

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Counts
            </p>

            <p className="mt-2 text-3xl font-bold">
              {counts.length}
            </p>

          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Unique Items
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {
                new Set(
                  counts.map(
                    (c) => c.inventoryItem.id
                  )
                ).size
              }
            </p>

          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Warehouses
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {
                new Set(
                  counts.map(
                    (c) => c.warehouse.id
                  )
                ).size
              }
            </p>

          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Counters
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {
                new Set(
                  counts.map(
                    (c) => c.countedBy.id
                  )
                ).size
              }
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}