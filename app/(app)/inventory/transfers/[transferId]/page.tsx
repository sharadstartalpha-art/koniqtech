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

export default async function InventoryTransferPage({
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
            unit: true,
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

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <Link
            href="/inventory/transfers"
            className="text-blue-600 hover:underline"
          >
            ← Back to Transfers
          </Link>

          <h1 className="mt-3 text-4xl font-bold">
            Inventory Transaction
          </h1>

          <p className="mt-2 text-slate-600">
            Transaction details and audit history.
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/inventory/transfers/${transfer.id}/edit`}
            className="rounded-xl border px-5 py-3 hover:bg-slate-100"
          >
            Edit
          </Link>

          <Link
            href={`/inventory/transfers/${transfer.id}/delete`}
            className="rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700"
          >
            Delete
          </Link>

        </div>

      </div>

      <div className="rounded-3xl border bg-white p-8">

        <h2 className="text-2xl font-semibold">
          Transaction Information
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
                      <div>

            <p className="text-sm text-slate-500">
              Inventory Item
            </p>

            <Link
              href={`/inventory/${transfer.inventoryItem.id}`}
              className="font-semibold text-blue-600 hover:underline"
            >
              {transfer.inventoryItem.name}
            </Link>

            <p className="text-sm text-slate-500">
              SKU: {transfer.inventoryItem.sku ?? "-"}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Warehouse
            </p>

            <p className="font-medium">
              {transfer.warehouse.name}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Transaction Type
            </p>

            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              {transfer.transactionType.replaceAll("_", " ")}
            </span>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Quantity
            </p>

            <p
              className={
                transfer.quantity >= 0
                  ? "text-lg font-semibold text-green-600"
                  : "text-lg font-semibold text-red-600"
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

            <p className="font-medium">
              {transfer.previousQty}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Resulting Quantity
            </p>

            <p className="font-semibold text-blue-700">
              {transfer.resultingQty}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Reference Type
            </p>

            <p>
              {transfer.referenceType
                ? transfer.referenceType.replaceAll("_", " ")
                : "-"}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Reference ID
            </p>

            <p>
              {transfer.referenceId ?? "-"}
            </p>

          </div>
                    <div>

            <p className="text-sm text-slate-500">
              Performed By
            </p>

            <p className="font-medium">
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

            <div className="mt-2 rounded-xl border bg-slate-50 p-4">
              {transfer.notes || "No notes provided."}
            </div>

          </div>

        </div>

      </div>

      <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

        <h2 className="text-xl font-semibold text-blue-900">
          Audit Summary
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-4">

          <div className="rounded-xl bg-white p-5">

            <p className="text-sm text-slate-500">
              Previous Qty
            </p>

            <p className="mt-2 text-3xl font-bold">
              {transfer.previousQty}
            </p>

          </div>

          <div className="rounded-xl bg-white p-5">

            <p className="text-sm text-slate-500">
              Transaction Qty
            </p>

            <p
              className={`mt-2 text-3xl font-bold ${
                transfer.quantity >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {transfer.quantity > 0 ? "+" : ""}
              {transfer.quantity}
            </p>

          </div>

          <div className="rounded-xl bg-white p-5">

            <p className="text-sm text-slate-500">
              Resulting Qty
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {transfer.resultingQty}
            </p>

          </div>

          <div className="rounded-xl bg-white p-5">

            <p className="text-sm text-slate-500">
              Transaction Type
            </p>

            <p className="mt-2 text-lg font-semibold">
              {transfer.transactionType.replaceAll("_", " ")}
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}