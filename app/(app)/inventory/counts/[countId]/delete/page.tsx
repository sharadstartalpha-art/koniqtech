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
    countId: string;
  }>;
}

export default async function DeleteInventoryCountPage({
  params,
}: PageProps) {

  const {
    countId,
  } = await params;

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

  const count =
    await prisma.inventoryCount.findFirst({

      where: {
        id: countId,
        orgId,
      },

      include: {

        inventoryItem: {

          select: {
            id: true,
            name: true,
            sku: true,
            qty: true,
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

    });

  if (!count) {
    notFound();
  }

  const currentCountId =
    count.id;

  async function deleteInventoryCount() {
    "use server";

    const session =
      await auth();

    if (!session?.user) {
      redirect("/login");
    }

    const orgId =
      (session.user as any).orgId;

    const count =
      await prisma.inventoryCount.findFirst({

        where: {
          id: currentCountId,
          orgId,
        },

      });

    if (!count) {
      notFound();
    }
        await prisma.$transaction(async (tx) => {

      await tx.inventoryItem.update({

        where: {
          id: count.inventoryItemId,
        },

        data: {

          qty: count.expectedQty,

        },

      });

      await tx.inventoryCount.delete({

        where: {
          id: currentCountId,
        },

      });

    });

    redirect(
      "/inventory/counts"
    );

  }

  return (

    <div className="mx-auto max-w-3xl space-y-8">

      <div>

        <Link
          href={`/inventory/counts/${currentCountId}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Inventory Count
        </Link>

        <h1 className="mt-3 text-4xl font-bold text-red-600">
          Delete Inventory Count
        </h1>

        <p className="mt-2 text-slate-600">
          This action cannot be undone.
        </p>

      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

        <h2 className="text-xl font-semibold text-red-700">
          Confirm Deletion
        </h2>

        <div className="mt-6 space-y-5">

          <div>

            <p className="text-sm text-slate-500">
              Inventory Item
            </p>

            <p className="font-semibold">
              {count.inventoryItem.name}
            </p>

            <p className="text-sm text-slate-500">
              {count.inventoryItem.sku ?? "-"}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Warehouse
            </p>

            <p>
              {count.warehouse.name}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Expected Quantity
            </p>

            <p>
              {count.expectedQty}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Counted Quantity
            </p>

            <p className="font-semibold text-blue-600">
              {count.countedQty}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Variance
            </p>

            <p
              className={
                count.variance >= 0
                  ? "font-semibold text-green-600"
                  : "font-semibold text-red-600"
              }
            >
              {count.variance > 0 ? "+" : ""}
              {count.variance}
            </p>

          </div>
                    <div>

            <p className="text-sm text-slate-500">
              Counted By
            </p>

            <p>
              {count.countedBy.name}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Count Date
            </p>

            <p>
              {count.countedAt.toLocaleString()}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Current Inventory Quantity
            </p>

            <p className="font-semibold">
              {count.inventoryItem.qty}
            </p>

          </div>

          <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-4">

            <p className="font-medium text-yellow-800">
              Warning
            </p>

            <p className="mt-2 text-sm text-yellow-700">
              Deleting this inventory count will restore the inventory item's
              quantity to its expected quantity recorded before this count.
              This action cannot be undone.
            </p>

          </div>

        </div>

      </div>

      <form
        action={deleteInventoryCount}
        className="flex justify-end gap-4"
      >

        <Link
          href={`/inventory/counts/${currentCountId}`}
          className="rounded-xl border px-6 py-3 hover:bg-slate-100"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
        >
          Delete Inventory Count
        </button>

      </form>

    </div>

  );

}