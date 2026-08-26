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

export default async function InventoryCountDetailsPage({
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
            email: true,
          },

        },

      },

    });

  if (!count) {
    notFound();
  }

  const currentCountId =
    count.id;

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <Link
            href="/inventory/counts"
            className="text-blue-600 hover:underline"
          >
            ← Back to Inventory Counts
          </Link>

          <h1 className="mt-3 text-4xl font-bold">
            Inventory Count
          </h1>

          <p className="mt-2 text-slate-600">
            Review the details of this inventory count.
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/inventory/counts/${currentCountId}/edit`}
            className="rounded-xl bg-amber-500 px-5 py-3 font-medium text-white hover:bg-amber-600"
          >
            Edit
          </Link>

          <Link
            href={`/inventory/counts/${currentCountId}/delete`}
            className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
          >
            Delete
          </Link>

        </div>

      </div>

      <div className="grid gap-8 lg:grid-cols-2">
                <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Count Details
          </h2>

          <div className="mt-8 space-y-6">

            <div>

              <p className="text-sm text-slate-500">
                Inventory Item
              </p>

              <Link
                href={`/inventory/${count.inventoryItem.id}`}
                className="font-semibold text-blue-600 hover:underline"
              >
                {count.inventoryItem.name}
              </Link>

              <p className="text-sm text-slate-500">
                SKU: {count.inventoryItem.sku ?? "-"}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Warehouse
              </p>

              <p className="font-medium">
                {count.warehouse.name}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Expected Quantity
              </p>

              <p className="text-lg font-semibold">
                {count.expectedQty}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Counted Quantity
              </p>

              <p className="text-lg font-semibold text-blue-600">
                {count.countedQty}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Variance
              </p>

              <p
                className={`text-xl font-bold ${
                  count.variance === 0
                    ? "text-slate-700"
                    : count.variance > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {count.variance > 0 ? "+" : ""}
                {count.variance}
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Audit Information
          </h2>

          <div className="mt-8 space-y-6">
                        <div>

              <p className="text-sm text-slate-500">
                Counted By
              </p>

              <p className="font-medium">
                {count.countedBy.name}
              </p>

              <p className="text-sm text-slate-500">
                {count.countedBy.email}
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

              <p className="text-lg font-semibold">
                {count.inventoryItem.qty}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Inventory Status
              </p>

              <span
                className={
                  count.variance === 0
                    ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                    : count.variance > 0
                    ? "rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
                    : "rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700"
                }
              >
                {count.variance === 0
                  ? "Balanced"
                  : count.variance > 0
                  ? "Over Count"
                  : "Under Count"}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}