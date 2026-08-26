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

export default async function EditInventoryItemPage({
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

    });

  if (!item) {
    notFound();
  }

  const currentItemId =
    item.id;

  async function updateInventoryItem(
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

    const item =
      await prisma.inventoryItem.findFirst({

        where: {
          id: currentItemId,
          orgId,
        },

      });

    if (!item) {
      notFound();
    }

    const name =
      formData
        .get("name")
        ?.toString()
        .trim() ?? "";

    const sku =
      formData
        .get("sku")
        ?.toString()
        .trim() || null;

    const qty =
      Number(
        formData.get("qty")
      );

    const unit =
      formData
        .get("unit")
        ?.toString()
        .trim() || null;

    const unitPrice =
      Number(
        formData.get("unitPrice")
      );

    const reorderLevelValue =
  formData.get("reorderLevel")?.toString();

const reorderLevel =
  reorderLevelValue && reorderLevelValue !== ""
    ? Number(reorderLevelValue)
    : null;

    const description =
      formData
        .get("description")
        ?.toString()
        .trim() || null;

    if (!name) {

      throw new Error(
        "Item name is required."
      );

    }

    await prisma.inventoryItem.update({

      where: {
        id: currentItemId,
      },

      data: {

        name,

        sku,

        qty,

        unit,

        unitPrice,

        reorderLevel,

        description,

      },

    });

    redirect(
      `/inventory/${currentItemId}`
    );

  }

  return (

    <div className="mx-auto max-w-4xl space-y-8">

      <div>

        <Link
          href={`/inventory/${currentItemId}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Inventory Item
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Edit Inventory Item
        </h1>

        <p className="mt-2 text-slate-600">
          Update inventory item information.
        </p>

      </div>

      <form
        action={updateInventoryItem}
        className="space-y-8"
      >

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Item Information
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div>

              <label className="block text-sm font-medium">
                Item Name *
              </label>

              <input
                name="name"
                required
                defaultValue={item.name}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                SKU
              </label>

              <input
                name="sku"
                defaultValue={item.sku ?? ""}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>
                        <div>

              <label className="block text-sm font-medium">
                Quantity
              </label>

              <input
                type="number"
                name="qty"
                min="0"
                defaultValue={item.qty}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Unit
              </label>

              <select
                name="unit"
                defaultValue={item.unit ?? ""}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >

                <option value="">
                  Select Unit
                </option>

                <option value="Each">
                  Each
                </option>

                <option value="Box">
                  Box
                </option>

                <option value="Pack">
                  Pack
                </option>

                <option value="Case">
                  Case
                </option>

                <option value="Roll">
                  Roll
                </option>

                <option value="Kg">
                  Kg
                </option>

                <option value="Gram">
                  Gram
                </option>

                <option value="Liter">
                  Liter
                </option>

                <option value="Meter">
                  Meter
                </option>

                <option value="Foot">
                  Foot
                </option>

              </select>

            </div>

            <div>

              <label className="block text-sm font-medium">
                Unit Price
              </label>

              <input
                type="number"
                name="unitPrice"
                step="0.01"
                min="0"
                defaultValue={
                  Number(item.unitPrice ?? 0)
                }
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Reorder Level
              </label>

              <input
                name="reorderLevel"
                defaultValue={
                  item.reorderLevel ?? ""
                }
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div className="md:col-span-2">

              <label className="block text-sm font-medium">
                Description
              </label>

              <textarea
                name="description"
                rows={5}
                defaultValue={
                  item.description ?? ""
                }
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

          </div>

        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

          <h2 className="text-xl font-semibold text-blue-900">
            Inventory Notes
          </h2>

          <div className="mt-6 space-y-3 text-sm leading-7 text-blue-800">

            <p>

              Updating the quantity changes the
              current stock level for this item.

            </p>

            <p>

              Unit Price is used as the default
              purchase cost for new purchase
              orders.

            </p>

            <p>

              Set a Reorder Level to help identify
              items that need replenishment.

            </p>

          </div>

        </div>
                <div className="flex justify-end gap-4">

          <Link
            href={`/inventory/${currentItemId}`}
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