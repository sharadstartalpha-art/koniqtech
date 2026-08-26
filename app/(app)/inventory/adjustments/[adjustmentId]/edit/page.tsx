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

export default async function EditInventoryAdjustmentPage({
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

  const [
    adjustment,
    inventoryItems,
    warehouses,
  ] = await Promise.all([

    prisma.inventoryAdjustment.findFirst({

      where: {
        id: adjustmentId,
        orgId,
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

  if (!adjustment) {
    notFound();
  }

  const currentAdjustmentId =
    adjustment.id;

  async function updateAdjustment(
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

    const existingAdjustment =
      await prisma.inventoryAdjustment.findFirst({

        where: {
          id: currentAdjustmentId,
          orgId,
        },

      });

    if (!existingAdjustment) {
      notFound();
    }

    const inventoryItemId =
      formData
        .get("inventoryItemId")
        ?.toString() ?? "";

    const warehouseId =
      formData
        .get("warehouseId")
        ?.toString() ?? "";

    const adjustmentType =
      formData
        .get("adjustmentType")
        ?.toString() ?? "";

    const quantity =
      Number(
        formData.get("quantity")
      );

    const reason =
      formData
        .get("reason")
        ?.toString()
        .trim() || null;

    const notes =
      formData
        .get("notes")
        ?.toString()
        .trim() || null;
            if (
      !inventoryItemId ||
      !warehouseId ||
      !adjustmentType ||
      quantity === 0
    ) {

      throw new Error(
        "Please complete all required fields."
      );

    }

    await prisma.$transaction(async (tx) => {

      if (
        existingAdjustment.inventoryItemId === inventoryItemId
      ) {

        await tx.inventoryItem.update({

          where: {
            id: inventoryItemId,
          },

          data: {

            qty: {

              increment:
                quantity -
                existingAdjustment.quantity,

            },

          },

        });

      } else {

        await tx.inventoryItem.update({

          where: {
            id: existingAdjustment.inventoryItemId,
          },

          data: {

            qty: {

              decrement:
                existingAdjustment.quantity,

            },

          },

        });

        await tx.inventoryItem.update({

          where: {
            id: inventoryItemId,
          },

          data: {

            qty: {

              increment:
                quantity,

            },

          },

        });

      }

      await tx.inventoryAdjustment.update({

        where: {
          id: currentAdjustmentId,
        },

        data: {

          inventoryItemId,

          warehouseId,

          adjustmentType,

          quantity,

          reason,

          notes,

        },

      });

    });

    redirect(
      `/inventory/adjustments/${currentAdjustmentId}`
    );

  }

  return (

    <div className="mx-auto max-w-4xl space-y-8">

      <div>

        <Link
          href={`/inventory/adjustments/${currentAdjustmentId}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Adjustment
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Edit Inventory Adjustment
        </h1>

        <p className="mt-2 text-slate-600">
          Update the adjustment details below.
        </p>

      </div>

      <form
        action={updateAdjustment}
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
                defaultValue={adjustment.inventoryItemId}
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
                defaultValue={adjustment.warehouseId}
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
                Adjustment Type *
              </label>

              <select
                name="adjustmentType"
                required
                defaultValue={adjustment.adjustmentType}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >

                <option value="Increase">
                  Increase
                </option>

                <option value="Decrease">
                  Decrease
                </option>

                <option value="Correction">
                  Correction
                </option>

                <option value="Transfer">
                  Transfer
                </option>

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
                step="0.01"
                defaultValue={adjustment.quantity}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Reason
              </label>

              <input
                name="reason"
                defaultValue={adjustment.reason ?? ""}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Notes
              </label>

              <textarea
                name="notes"
                rows={5}
                defaultValue={adjustment.notes ?? ""}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

          </div>

        </div>

        <div className="flex justify-end gap-4">

          <Link
            href={`/inventory/adjustments/${currentAdjustmentId}`}
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