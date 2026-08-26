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

export default async function InventoryTransfersPage({
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

  const transfers =
    await prisma.warehouseTransaction.findMany({

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

      },

      orderBy: {

        createdAt: "desc",

      },

    });

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Inventory Transfers
          </h1>

          <p className="mt-2 text-slate-600">
            View warehouse inventory movements and transfers.
          </p>

        </div>

        <Link
          href="/inventory/transfers/create"
          className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          + New Transfer
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
                Quantity
              </th>

              <th className="px-6 py-4 text-left">
                Type
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
                      {transfers.length === 0 ? (

            <tr>

              <td
                colSpan={6}
                className="px-6 py-12 text-center text-slate-500"
              >
                No inventory transfers found.
              </td>

            </tr>

          ) : (

            transfers.map((transfer) => (

              <tr
                key={transfer.id}
                className="border-t"
              >

                <td className="px-6 py-4">

                  <Link
                    href={`/inventory/${transfer.inventoryItem.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {transfer.inventoryItem.name}
                  </Link>

                  <div className="text-sm text-slate-500">
                    {transfer.inventoryItem.sku ?? "-"}
                  </div>

                </td>

                <td className="px-6 py-4">
                  {transfer.warehouse.name}
                </td>

                <td className="px-6 py-4">

                  <span
                    className={
                      transfer.quantity >= 0
                        ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                        : "rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700"
                    }
                  >
                    {transfer.quantity >= 0 ? "+" : ""}
                    {transfer.quantity}
                  </span>

                </td>

                <td className="px-6 py-4">
                  {transfer.transactionType}
                </td>

                <td className="px-6 py-4">
                  {transfer.createdAt.toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-right">

                  <div className="flex justify-end gap-3">

                    <Link
                      href={`/inventory/transfers/${transfer.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>

                    <Link
                      href={`/inventory/transfers/${transfer.id}/edit`}
                      className="text-amber-600 hover:underline"
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/inventory/transfers/${transfer.id}/delete`}
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
          Transfer Summary
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-4">

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Transfers
            </p>

            <p className="mt-2 text-3xl font-bold">
              {transfers.length}
            </p>

          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Inbound
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {
                transfers.filter(
                  (t) => t.quantity > 0
                ).length
              }
            </p>

          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Outbound
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {
                transfers.filter(
                  (t) => t.quantity < 0
                ).length
              }
            </p>

          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Warehouses
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {
                new Set(
                  transfers.map(
                    (t) => t.warehouse.id
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