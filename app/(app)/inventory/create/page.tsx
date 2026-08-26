import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import {
  notFound,
  redirect,
} from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CreateInventoryItemPage() {

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

  async function createInventoryItem(
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

    const unitPrice =
      Number(
        formData.get("unitPrice")
      );

    if (!name) {

      throw new Error(
        "Item name is required."
      );

    }

    await prisma.inventoryItem.create({

      data: {

        orgId,

        name,

        sku,

        qty,

        unitPrice,

      },

    });

    redirect(
      "/inventory"
    );

  }

  return (

    <div className="mx-auto max-w-4xl space-y-8">

      <div>

        <Link
          href="/inventory"
          className="text-blue-600 hover:underline"
        >
          ← Back to Inventory
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Create Inventory Item
        </h1>

        <p className="mt-2 text-slate-600">
          Add a new inventory item to your
          warehouse.
        </p>

      </div>

      <form
        action={createInventoryItem}
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
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                SKU
              </label>

              <input
                name="sku"
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Opening Quantity
              </label>

              <input
                type="number"
                name="qty"
                min="0"
                defaultValue={0}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Unit Price
              </label>

              <input
                type="number"
                name="unitPrice"
                min="0"
                step="0.01"
                defaultValue={0}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>
                        <div>

              <label className="block text-sm font-medium">
                Reorder Level
              </label>

              <input
                type="number"
                name="reorderLevel"
                min="0"
                defaultValue={0}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Unit
              </label>

              <select
                name="unit"
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >
                <option value="Each">Each</option>
                <option value="Box">Box</option>
                <option value="Pack">Pack</option>
                <option value="Case">Case</option>
                <option value="Roll">Roll</option>
                <option value="Foot">Foot</option>
                <option value="Meter">Meter</option>
                <option value="Kg">Kg</option>
                <option value="Lb">Lb</option>
                <option value="Liter">Liter</option>
                <option value="Gallon">Gallon</option>
              </select>

            </div>

            <div className="md:col-span-2">

              <label className="block text-sm font-medium">
                Description
              </label>

              <textarea
                name="description"
                rows={5}
                placeholder="Optional description..."
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

          </div>

        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

          <h2 className="text-xl font-semibold text-blue-900">
            Inventory Guidelines
          </h2>

          <div className="mt-6 space-y-3 text-sm leading-7 text-blue-800">

            <p>

              Opening Quantity sets the initial
              stock available in inventory.

            </p>

            <p>

              Unit Price represents the standard
              purchase cost of the item.

            </p>

            <p>

              SKU should be unique whenever
              possible to simplify barcode scanning
              and warehouse operations.

            </p>

          </div>

        </div>
                <div className="flex justify-end gap-4">

          <Link
            href="/inventory"
            className="rounded-xl border px-6 py-3 hover:bg-slate-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Create Inventory Item
          </button>

        </div>

      </form>

    </div>

  );

}