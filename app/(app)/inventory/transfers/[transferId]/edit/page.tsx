import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import {
  notFound,
  redirect,
} from "next/navigation";

import {
  InventoryReferenceType,
  InventoryTransactionType,
} from "@prisma/client";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    transferId: string;
  }>;
}

export default async function EditInventoryTransferPage({
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

  const [
    transfer,
    inventoryItems,
    warehouses,
  ] = await Promise.all([

    prisma.warehouseTransaction.findFirst({

      where: {
        id: transferId,
        orgId,
      },

      include: {

        inventoryItem: true,

        warehouse: true,

      },

    }),

    prisma.inventoryItem.findMany({

      where: {
        orgId,
      },

      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
        sku: true,
        qty: true,
      },

    }),

    prisma.warehouse.findMany({

      where: {
        orgId,
      },

      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
      },

    }),

  ]);

  if (!transfer) {
    notFound();
  }

  const currentTransferId =
    transfer.id;

  async function updateTransfer(
    formData: FormData,
  ) {
    "use server";

    const session =
      await auth();

    if (!session?.user) {
      redirect("/login");
    }

    const orgId =
      (session.user as any).orgId;

    const inventoryItemId =
      formData.get("inventoryItemId")
        ?.toString() ?? "";

    const warehouseId =
      formData.get("warehouseId")
        ?.toString() ?? "";

    const transactionType =
      formData.get("transactionType")
        ?.toString() as InventoryTransactionType;

    const quantity =
      Number(
        formData.get("quantity")
      );

    const notes =
      formData.get("notes")
        ?.toString() || null;

    const referenceType =
      formData.get("referenceType")
        ?.toString() as InventoryReferenceType | "";

    const referenceId =
      formData.get("referenceId")
        ?.toString() || null;
            if (
      !inventoryItemId ||
      !warehouseId ||
      !transactionType ||
      Number.isNaN(quantity) ||
      quantity <= 0
    ) {

      throw new Error(
        "Please complete all required fields."
      );

    }

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

    const item =
      await prisma.inventoryItem.findFirst({

        where: {
          id: inventoryItemId,
          orgId,
        },

      });

    if (!item) {

      throw new Error(
        "Inventory item not found."
      );

    }

    const previousQty =
      item.qty;

    const inboundTypes:
      InventoryTransactionType[] = [

      InventoryTransactionType.PURCHASE,

      InventoryTransactionType.TRANSFER_IN,

      InventoryTransactionType.ADJUSTMENT_IN,

      InventoryTransactionType.RETURN_IN,

      InventoryTransactionType.PRODUCTION_IN,

      InventoryTransactionType.OPENING_STOCK,

    ];

    const isInbound =
      inboundTypes.includes(
        transactionType
      );

    const resultingQty =
      isInbound
        ? previousQty + quantity
        : previousQty - quantity;

    if (resultingQty < 0) {

      throw new Error(
        "Insufficient inventory."
      );

    }

    await prisma.$transaction(async (tx) => {

      await tx.inventoryItem.update({

        where: {
          id: inventoryItemId,
        },

        data: {

          qty: resultingQty,

        },

      });

      await tx.warehouseTransaction.update({

        where: {
          id: currentTransferId,
        },

        data: {

          inventoryItemId,

          warehouseId,

          transactionType,

          quantity,

          previousQty,

          resultingQty,

          referenceType:
            referenceType || null,

          referenceId,

          notes,

          performedById:
            session.user.id,

        },

      });

    });

    redirect(
      `/inventory/transfers/${currentTransferId}`
    );

  }

  return (

    <div className="mx-auto max-w-4xl space-y-8">

      <div>

        <Link
          href={`/inventory/transfers/${currentTransferId}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Transaction
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Edit Inventory Transaction
        </h1>

        <p className="mt-2 text-slate-600">
          Update the warehouse transaction details.
        </p>

      </div>

      <form
        action={updateTransfer}
        className="space-y-8"
      >

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Transaction Details
          </h2>

          <div className="mt-8 grid gap-6">
                        <div>

              <label className="block text-sm font-medium">
                Inventory Item *
              </label>

              <select
                name="inventoryItemId"
                required
                defaultValue={transfer.inventoryItemId}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >

                {inventoryItems.map((item) => (

                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                    {" "}
                    ({item.sku ?? "No SKU"})
                    {" "}
                    - Current Qty:
                    {" "}
                    {item.qty}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="block text-sm font-medium">
                Warehouse *
              </label>

              <select
                name="warehouseId"
                required
                defaultValue={transfer.warehouseId}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >

                {warehouses.map((warehouse) => (

                  <option
                    key={warehouse.id}
                    value={warehouse.id}
                  >
                    {warehouse.name}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="block text-sm font-medium">
                Transaction Type *
              </label>

              <select
                name="transactionType"
                required
                defaultValue={transfer.transactionType}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >

                {Object.values(
                  InventoryTransactionType
                ).map((type) => (

                  <option
                    key={type}
                    value={type}
                  >
                    {type.replaceAll("_", " ")}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="block text-sm font-medium">
                Quantity *
              </label>

              <input
                type="number"
                name="quantity"
                required
                min="1"
                step="0.01"
                defaultValue={transfer.quantity}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Reference Type
              </label>

              <select
                name="referenceType"
                defaultValue={transfer.referenceType ?? ""}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >

                <option value="">
                  None
                </option>

                {Object.values(
                  InventoryReferenceType
                ).map((type) => (

                  <option
                    key={type}
                    value={type}
                  >
                    {type.replaceAll("_", " ")}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="block text-sm font-medium">
                Reference ID
              </label>

              <input
                type="text"
                name="referenceId"
                defaultValue={transfer.referenceId ?? ""}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div className="md:col-span-2">

              <label className="block text-sm font-medium">
                Notes
              </label>

              <textarea
                name="notes"
                rows={4}
                defaultValue={transfer.notes ?? ""}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

          </div>

        </div>

        <div className="flex justify-end gap-4">

          <Link
            href={`/inventory/transfers/${currentTransferId}`}
            className="rounded-xl border px-6 py-3 hover:bg-slate-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Save Changes
          </button>

        </div>

      </form>

    </div>

  );

}