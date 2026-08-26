import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import { redirect } from "next/navigation";

import {
  InventoryReferenceType,
  InventoryTransactionType,
} from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function CreateInventoryTransferPage() {

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

  const userId =
    session.user.id;

  const [
    inventoryItems,
    warehouses,
  ] = await Promise.all([

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

  async function createTransfer(
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

    const performedById =
      session.user.id;

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

    const inboundTypes: InventoryTransactionType[] = [
  InventoryTransactionType.PURCHASE,
  InventoryTransactionType.TRANSFER_IN,
  InventoryTransactionType.ADJUSTMENT_IN,
  InventoryTransactionType.RETURN_IN,
  InventoryTransactionType.PRODUCTION_IN,
  InventoryTransactionType.OPENING_STOCK,
];

const isInbound = inboundTypes.includes(transactionType);

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

      await tx.warehouseTransaction.create({

        data: {

          orgId,

          inventoryItemId,

          warehouseId,

          transactionType,

          quantity,

          previousQty,

          resultingQty,

          referenceType:
            InventoryReferenceType.MANUAL,

          referenceId: null,

          notes,

          performedById,

        },

      });

      await tx.inventoryItem.update({

        where: {
          id: inventoryItemId,
        },

        data: {

          qty: resultingQty,

        },

      });

    });

    redirect(
      "/inventory/transfers"
    );

  }

  return (

    <div className="mx-auto max-w-4xl space-y-8">

      <div>

        <Link
          href="/inventory/transfers"
          className="text-blue-600 hover:underline"
        >
          ← Back to Transfers
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          New Inventory Transaction
        </h1>

        <p className="mt-2 text-slate-600">
          Record an inventory movement for a warehouse.
        </p>

      </div>

      <form
        action={createTransfer}
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
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >

                <option value="">
                  Select Inventory Item
                </option>

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
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >

                <option value="">
                  Select Warehouse
                </option>

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
                step="1"
                placeholder="Enter quantity"
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Notes
              </label>

              <textarea
                name="notes"
                rows={4}
                placeholder="Optional notes"
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

          </div>

        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

          <h2 className="text-xl font-semibold text-blue-900">
            Transaction Information
          </h2>

          <div className="mt-4 space-y-3 text-sm text-blue-800">

            <p>
              • A warehouse transaction will be added to the inventory ledger.
            </p>

            <p>
              • The item's current quantity will be updated automatically.
            </p>

            <p>
              • Previous quantity and resulting quantity are stored for auditing.
            </p>

            <p>
              • The logged-in user is recorded as the person performing the transaction.
            </p>

          </div>

        </div>

        <div className="flex justify-end gap-4">

          <Link
            href="/inventory/transfers"
            className="rounded-xl border px-6 py-3 hover:bg-slate-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Save Transaction
          </button>

        </div>

      </form>

    </div>

  );

}