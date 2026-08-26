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

export default async function EditInventoryCountPage({
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

  const [
    count,
    inventoryItems,
    warehouses,
  ] = await Promise.all([

    prisma.inventoryCount.findFirst({

      where: {
        id: countId,
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

  if (!count) {
    notFound();
  }

  const currentCountId =
    count.id;

  async function updateInventoryCount(
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

    const existingCount =
      await prisma.inventoryCount.findFirst({

        where: {
          id: currentCountId,
          orgId,
        },

      });

    if (!existingCount) {
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

    const countedQty =
      Number(
        formData.get("countedQty")
      );

    if (
      !inventoryItemId ||
      !warehouseId ||
      Number.isNaN(countedQty)
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

    const expectedQty =
      item.qty;

    const variance =
      countedQty - expectedQty;
          await prisma.$transaction(async (tx) => {

      if (
        existingCount.inventoryItemId === inventoryItemId
      ) {

        await tx.inventoryItem.update({

          where: {
            id: inventoryItemId,
          },

          data: {

            qty: countedQty,

          },

        });

      } else {

        await tx.inventoryItem.update({

          where: {
            id: existingCount.inventoryItemId,
          },

          data: {

            qty: existingCount.expectedQty,

          },

        });

        await tx.inventoryItem.update({

          where: {
            id: inventoryItemId,
          },

          data: {

            qty: countedQty,

          },

        });

      }

      await tx.inventoryCount.update({

        where: {
          id: currentCountId,
        },

        data: {

          inventoryItemId,

          warehouseId,

          expectedQty,

          countedQty,

          variance,

          countedById: session.user.id,

          countedAt: new Date(),

        },

      });

    });

    redirect(
      `/inventory/counts/${currentCountId}`
    );

  }

  return (

    <div className="mx-auto max-w-4xl space-y-8">

      <div>

        <Link
          href={`/inventory/counts/${currentCountId}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Inventory Count
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Edit Inventory Count
        </h1>

        <p className="mt-2 text-slate-600">
          Update the physical inventory count.
        </p>

      </div>

      <form
        action={updateInventoryCount}
        className="space-y-8"
      >

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Count Details
          </h2>

          <div className="mt-8 grid gap-6">
                        <div>

              <label className="block text-sm font-medium">
                Inventory Item *
              </label>

              <select
                name="inventoryItemId"
                required
                defaultValue={count.inventoryItemId}
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
                defaultValue={count.warehouseId}
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
                Counted Quantity *
              </label>

              <input
                type="number"
                name="countedQty"
                step="0.01"
                required
                defaultValue={count.countedQty}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

          </div>

        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

          <h2 className="text-xl font-semibold text-blue-900">
            Inventory Count Information
          </h2>

          <div className="mt-4 space-y-3 text-sm text-blue-800">

            <p>
              Expected quantity will be recalculated from the selected inventory item.
            </p>

            <p>
              Variance will be automatically calculated as:
              <strong> Counted Qty − Expected Qty</strong>.
            </p>

            <p>
              Saving changes updates both the inventory count record and the current inventory quantity.
            </p>

            <p>
              The current user becomes the latest user who performed the count.
            </p>

          </div>

        </div>

        <div className="flex justify-end gap-4">

          <Link
            href={`/inventory/counts/${currentCountId}`}
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