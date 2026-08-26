import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CreateInventoryAdjustmentPage() {

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

  const inventoryItems =
    await prisma.inventoryItem.findMany({

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

    });

  async function createAdjustment(
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
      formData
        .get("inventoryItemId")
        ?.toString() ?? "";

        const notes =
  formData
    .get("notes")
    ?.toString()
    .trim() || null;

    const warehouseId =
  formData.get("warehouseId")?.toString() ?? "";

const adjustmentType =
  formData.get("adjustmentType")?.toString() ?? "";

const adjustedById =
  session.user.id;

    const quantity =
      Number(
        formData.get("quantity")
      );

    const reason =
      formData
        .get("reason")
        ?.toString()
        .trim() ?? "";

    if (
      !inventoryItemId ||
      quantity === 0 ||
      !reason
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

    await prisma.$transaction([

      prisma.inventoryAdjustment.create({

        data: {

         orgId,

    inventoryItemId,

    warehouseId,

    quantity,

    adjustmentType,

    reason,

    notes,

    adjustedById,

        },

      }),

      prisma.inventoryItem.update({

        where: {
          id: inventoryItemId,
        },

        data: {
          qty: {
            increment: quantity,
          },
        },

      }),

    ]);

    redirect(
      "/inventory/adjustments"
    );

  }

  return (

    <div className="mx-auto max-w-4xl space-y-8">

      <div>

        <Link
          href="/inventory/adjustments"
          className="text-blue-600 hover:underline"
        >
          ← Back to Adjustments
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          New Inventory Adjustment
        </h1>

        <p className="mt-2 text-slate-600">
          Increase or decrease inventory stock.
        </p>

      </div>

      <form
        action={createAdjustment}
        className="space-y-8"
      >

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Adjustment Details
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

                {inventoryItems.map(
                  (item) => (

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

                  )
                )}

              </select>

            </div>

            <div>

              <label className="block text-sm font-medium">
                Adjustment Quantity *
              </label>

              <input
                type="number"
                name="quantity"
                required
                placeholder="Use positive (+) or negative (-) values"
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

              <p className="mt-2 text-sm text-slate-500">
                Positive values increase stock.
                Negative values decrease stock.
              </p>

            </div>

            <div>

              <label className="block text-sm font-medium">
                Reason *
              </label>

              <select
                name="reason"
                required
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >

                <option value="">
                  Select Reason
                </option>

                <option value="Stock Received">
                  Stock Received
                </option>

                <option value="Damaged Goods">
                  Damaged Goods
                </option>

                <option value="Inventory Correction">
                  Inventory Correction
                </option>

                <option value="Warehouse Transfer">
                  Warehouse Transfer
                </option>

                <option value="Return">
                  Return
                </option>

                <option value="Lost">
                  Lost
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            <div>

              <label className="block text-sm font-medium">
                Notes
              </label>

              <textarea
                name="notes"
                rows={5}
                placeholder="Optional notes..."
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

          </div>

        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

          <h2 className="text-xl font-semibold text-blue-900">
            Adjustment Guidelines
          </h2>

          <div className="mt-6 space-y-3 text-sm leading-7 text-blue-800">

            <p>
              Use positive numbers to add stock.
            </p>

            <p>
              Use negative numbers to reduce stock.
            </p>

            <p>
              Every adjustment updates the inventory
              quantity immediately and creates an
              audit record.
            </p>

          </div>

        </div>
                <div className="flex justify-end gap-4">

          <Link
            href="/inventory/adjustments"
            className="rounded-xl border px-6 py-3 hover:bg-slate-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Create Adjustment
          </button>

        </div>

      </form>

    </div>

  );

}