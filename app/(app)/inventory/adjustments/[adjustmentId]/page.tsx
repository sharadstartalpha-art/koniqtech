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

export default async function InventoryAdjustmentDetailsPage({
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

            qty: true,

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

            email: true,

          },

        },

      },

    });

  if (!adjustment) {
    notFound();
  }

  const currentAdjustmentId =
    adjustment.id;

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <Link
            href="/inventory/adjustments"
            className="text-blue-600 hover:underline"
          >
            ← Back to Inventory Adjustments
          </Link>

          <h1 className="mt-3 text-4xl font-bold">
            Inventory Adjustment
          </h1>

          <p className="mt-2 text-slate-600">
            Review adjustment details and audit information.
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/inventory/adjustments/${currentAdjustmentId}/edit`}
            className="rounded-xl bg-amber-500 px-5 py-3 font-medium text-white hover:bg-amber-600"
          >
            Edit
          </Link>

          <Link
            href={`/inventory/adjustments/${currentAdjustmentId}/delete`}
            className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
          >
            Delete
          </Link>

        </div>

      </div>

      <div className="grid gap-8 lg:grid-cols-2">
                <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Adjustment Details
          </h2>

          <div className="mt-8 space-y-6">

            <div>

              <p className="text-sm text-slate-500">
                Inventory Item
              </p>

              <Link
                href={`/inventory/${adjustment.inventoryItem.id}`}
                className="font-semibold text-blue-600 hover:underline"
              >
                {adjustment.inventoryItem.name}
              </Link>

              <p className="text-sm text-slate-500">
                SKU: {adjustment.inventoryItem.sku ?? "-"}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Current Stock
              </p>

              <p className="text-lg font-semibold">
                {adjustment.inventoryItem.qty}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Warehouse
              </p>

              <p className="font-medium">
                {adjustment.warehouse.name}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Adjustment Type
              </p>

              <span
                className={
                  adjustment.adjustmentType === "Increase"
                    ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                    : adjustment.adjustmentType === "Decrease"
                    ? "rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700"
                    : "rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
                }
              >
                {adjustment.adjustmentType}
              </span>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Quantity Changed
              </p>

              <p
                className={`text-2xl font-bold ${
                  adjustment.quantity >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {adjustment.quantity >= 0 ? "+" : ""}
                {adjustment.quantity}
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

              <p className="font-medium">
                {adjustment.adjustedBy.name}
              </p>

              <p className="text-sm text-slate-500">
                {adjustment.adjustedBy.email}
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

      </div>

    </div>

  );

}