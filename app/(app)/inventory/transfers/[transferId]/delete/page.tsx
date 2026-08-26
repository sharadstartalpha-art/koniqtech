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
    transferId: string;
  }>;
}

export default async function DeleteInventoryTransferPage({
  params,
}: PageProps) {

  const {
    transferId,
  } = await params;

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

  const transfer =
    await prisma.warehouseTransaction.findFirst({

      where: {
        id: transferId,
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

        performedBy: {

          select: {
            id: true,
            name: true,
            email: true,
          },

        },

      },

    });

  if (!transfer) {
    notFound();
  }

  const currentTransferId =
    transfer.id;

  async function deleteTransfer() {
    "use server";

    const session =
      await auth();

    if (!session?.user) {
      redirect("/login");
    }

    const orgId =
      (session.user as any).orgId;

    const existingTransfer =
      await prisma.warehouseTransaction.findFirst({

        where: {
          id: currentTransferId,
          orgId,
        },

      });

    if (!existingTransfer) {
      notFound();
    }

    const restoredQty =
      existingTransfer.previousQty;
          await prisma.$transaction(async (tx) => {

      await tx.inventoryItem.update({

        where: {
          id: existingTransfer.inventoryItemId,
        },

        data: {

          qty: restoredQty,

        },

      });

      await tx.warehouseTransaction.delete({

        where: {
          id: currentTransferId,
        },

      });

    });

    redirect(
      "/inventory/transfers"
    );

  }

  return (

    <div className="mx-auto max-w-3xl space-y-8">

      <div>

        <Link
          href={`/inventory/transfers/${currentTransferId}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Transaction
        </Link>

        <h1 className="mt-3 text-4xl font-bold text-red-600">
          Delete Inventory Transaction
        </h1>

        <p className="mt-2 text-slate-600">
          This action cannot be undone.
        </p>

      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

        <h2 className="text-xl font-semibold text-red-700">
          Confirm Deletion
        </h2>

        <div className="mt-6 grid gap-6">

          <div>

            <p className="text-sm text-slate-500">
              Inventory Item
            </p>

            <p className="font-semibold">
              {transfer.inventoryItem.name}
            </p>

            <p className="text-sm text-slate-500">
              SKU: {transfer.inventoryItem.sku ?? "-"}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Warehouse
            </p>

            <p>
              {transfer.warehouse.name}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Transaction Type
            </p>

            <p>
              {transfer.transactionType
                .replaceAll("_", " ")}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Quantity
            </p>

            <p
              className={
                transfer.quantity >= 0
                  ? "font-semibold text-green-600"
                  : "font-semibold text-red-600"
              }
            >
              {transfer.quantity > 0 ? "+" : ""}
              {transfer.quantity}
            </p>

          </div>
                    <div>

            <p className="text-sm text-slate-500">
              Previous Quantity
            </p>

            <p>
              {transfer.previousQty}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Resulting Quantity
            </p>

            <p>
              {transfer.resultingQty}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Performed By
            </p>

            <p>
              {transfer.performedBy.name}
            </p>

            <p className="text-sm text-slate-500">
              {transfer.performedBy.email}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Transaction Date
            </p>

            <p>
              {transfer.createdAt.toLocaleString()}
            </p>

          </div>

          <div className="md:col-span-2">

            <p className="text-sm text-slate-500">
              Notes
            </p>

            <div className="mt-2 rounded-xl border bg-white p-4">
              {transfer.notes ?? "No notes provided."}
            </div>

          </div>

          <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-4">

            <p className="font-semibold text-yellow-800">
              Warning
            </p>

            <p className="mt-2 text-sm text-yellow-700">
              Deleting this transaction will permanently remove it from the
              inventory ledger and restore the inventory quantity back to
              <strong> {transfer.previousQty}</strong>.
              This action cannot be undone.
            </p>

          </div>

        </div>

      </div>

      <form
        action={deleteTransfer}
        className="flex justify-end gap-4"
      >

        <Link
          href={`/inventory/transfers/${currentTransferId}`}
          className="rounded-xl border px-6 py-3 hover:bg-slate-100"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
        >
          Delete Transaction
        </button>

      </form>

    </div>

  );

}