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

export default async function DeleteInventoryItemPage({
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
          warehouseStock: true,
          inventoryAdjustments: true,
          inventoryCounts: true,
          transactions: true,
        },
      },
    },

  });

if (!item) {
  notFound();
}

const currentItemId = item.id;


  async function deleteInventoryItem() {
    "use server";

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
      id: currentItemId,
      orgId,
    },

    include: {
      _count: {
        select: {
          purchaseItems: true,
          warehouseStock: true,
          inventoryAdjustments: true,
          inventoryCounts: true,
          transactions: true,
        },
      },
    },

  });

if (!item) {
  notFound();
}


        const hasDependencies =

      item._count.purchaseItems > 0 ||

      item._count.warehouseStock > 0 ||

      item._count.inventoryAdjustments > 0 ||

      item._count.inventoryCounts > 0 ||

      item._count.transactions > 0;

    if (hasDependencies) {

      throw new Error(
        "This inventory item cannot be deleted because it is being used by other records."
      );

    }

    await prisma.inventoryItem.delete({

      where: {
        id: currentItemId,
      },

    });

    redirect("/inventory");

  }

  return (

    <div className="mx-auto max-w-3xl space-y-8">

      <div>

        <Link
          href={`/inventory/${currentItemId}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Inventory Item
        </Link>

        <h1 className="mt-3 text-4xl font-bold text-red-600">
          Delete Inventory Item
        </h1>

        <p className="mt-2 text-slate-600">
          This action cannot be undone.
        </p>

      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

        <h2 className="text-xl font-semibold text-red-700">
          Confirm Deletion
        </h2>

        <div className="mt-6 space-y-4">

          <div>

            <p className="text-sm text-slate-500">
              Item Name
            </p>

            <p className="font-semibold">
              {item.name}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              SKU
            </p>

            <p>
              {item.sku ?? "-"}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Quantity
            </p>

            <p>
              {item.qty}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Unit
            </p>

            <p>
              {item.unit ?? "-"}
            </p>

          </div>

        </div>

      </div>
            <div className="rounded-3xl border bg-white p-8">

        <h2 className="text-xl font-semibold">
          Related Records
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">

          <div className="rounded-xl border p-4">
            <p className="text-sm text-slate-500">
              Purchase Order Items
            </p>
            <p className="mt-2 text-2xl font-bold">
              {item._count.purchaseItems}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-slate-500">
              Warehouse Stock
            </p>
            <p className="mt-2 text-2xl font-bold">
              {item._count.warehouseStock}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-slate-500">
              Stock Adjustments
            </p>
            <p className="mt-2 text-2xl font-bold">
              {item._count.inventoryAdjustments}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-slate-500">
              Inventory Counts
            </p>
            <p className="mt-2 text-2xl font-bold">
              {item._count.inventoryCounts}
            </p>
          </div>

          <div className="rounded-xl border p-4 sm:col-span-2">
            <p className="text-sm text-slate-500">
              Warehouse Transactions
            </p>
            <p className="mt-2 text-2xl font-bold">
              {item._count.transactions}
            </p>
          </div>

        </div>

      </div>

      <form
        action={deleteInventoryItem}
        className="flex justify-end gap-4"
      >

        <Link
          href={`/inventory/${currentItemId}`}
          className="rounded-xl border px-6 py-3 hover:bg-slate-100"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={
            item._count.purchaseItems > 0 ||
            item._count.warehouseStock > 0 ||
            item._count.inventoryAdjustments > 0 ||
            item._count.inventoryCounts > 0 ||
            item._count.transactions > 0
          }
          className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Delete Inventory Item
        </button>

      </form>

    </div>

  );

}