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
    adjustmentId: string;
  }>;
}

export default async function DeleteInventoryAdjustmentPage({
  params,
}: PageProps) {

  const {
    adjustmentId,
  } = await params;

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

  const adjustment =
    await prisma.inventoryAdjustment.findFirst({

      where: {
        id: adjustmentId,
        orgId,
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

        adjustedBy: {

          select: {
            id: true,
            name: true,
          },

        },

      },

    });

  if (!adjustment) {
    notFound();
  }

  const currentAdjustmentId =
    adjustment.id;

  async function deleteAdjustment() {
    "use server";

    const session =
      await auth();

    if (!session?.user) {
      redirect("/login");
    }

    const orgId =
      (session.user as any).orgId;

    const adjustment =
      await prisma.inventoryAdjustment.findFirst({

        where: {
          id: currentAdjustmentId,
          orgId,
        },

      });

    if (!adjustment) {
      notFound();
    }
        await prisma.$transaction(async (tx) => {

      await tx.inventoryItem.update({

        where: {
          id: adjustment.inventoryItemId,
        },

        data: {

          qty: {

            decrement:
              adjustment.quantity,

          },

        },

      });

      await tx.inventoryAdjustment.delete({

        where: {
          id: currentAdjustmentId,
        },

      });

    });

    redirect(
      "/inventory/adjustments"
    );

  }

  return (

    <div className="mx-auto max-w-3xl space-y-8">

      <div>

        <Link
          href={`/inventory/adjustments/${currentAdjustmentId}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Adjustment
        </Link>

        <h1 className="mt-3 text-4xl font-bold text-red-600">
          Delete Inventory Adjustment
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
              {adjustment.inventoryItem.name}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Warehouse
            </p>

            <p>
              {adjustment.warehouse.name}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Adjustment Type
            </p>

            <p>
              {adjustment.adjustmentType}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Quantity
            </p>

            <p
              className={
                adjustment.quantity >= 0
                  ? "font-semibold text-green-600"
                  : "font-semibold text-red-600"
              }
            >
              {adjustment.quantity >= 0 ? "+" : ""}
              {adjustment.quantity}
            </p>

          </div>
                    <div>

            <p className="text-sm text-slate-500">
              Reason
            </p>

            <p>
              {adjustment.reason ?? "-"}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Notes
            </p>

            <p className="whitespace-pre-wrap">
              {adjustment.notes ?? "-"}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Adjusted By
            </p>

            <p>
              {adjustment.adjustedBy.name}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Created At
            </p>

            <p>
              {adjustment.createdAt.toLocaleString()}
            </p>

          </div>

        </div>

      </div>

      <form
        action={deleteAdjustment}
        className="flex justify-end gap-4"
      >

        <Link
          href={`/inventory/adjustments/${currentAdjustmentId}`}
          className="rounded-xl border px-6 py-3 hover:bg-slate-100"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
        >
          Delete Adjustment
        </button>

      </form>

    </div>

  );

}