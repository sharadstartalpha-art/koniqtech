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
    purchaseOrderId: string;
  }>;
}

export default async function DeletePurchaseOrderPage({
  params,
}: PageProps) {

  const {
    purchaseOrderId,
  } = await params;

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

  const purchaseOrder =
  await prisma.purchaseOrder.findFirst({
    where: {
      id: purchaseOrderId,
      orgId,
    },

    include: {
      vendor: {
        select: {
          companyName: true,
        },
      },

      job: {
        select: {
          id: true,
          title: true,
        },
      },

      _count: {
        select: {
          items: true,
        },
      },
    },
  });

if (!purchaseOrder) {
  notFound();
}
const poId = purchaseOrder.id;
  async function deletePurchaseOrder() {
    "use server";

    const session =
      await auth();

    if (!session?.user) {
      redirect("/login");
    }

    const orgId =
      (session.user as any).orgId;

    await prisma.purchaseOrder.delete({

      where: {
        id: poId,
        orgId,
      },

    });

    redirect("/purchase-orders");
  }

  return (

    <div className="mx-auto max-w-3xl space-y-8">

      <div>

        <Link
          href={`/purchase-orders/${purchaseOrder.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Purchase Order
        </Link>

        <h1 className="mt-3 text-4xl font-bold text-red-600">
          Delete Purchase Order
        </h1>

        <p className="mt-2 text-slate-600">

          This action cannot be undone.

        </p>

      </div>

      <form
        action={deletePurchaseOrder}
        className="space-y-8"
      >
                <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

          <div className="flex items-start gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">

              ⚠️

            </div>

            <div>

              <h2 className="text-2xl font-bold text-red-700">
                Confirm Purchase Order Deletion
              </h2>

              <p className="mt-3 leading-7 text-red-700">

                You are about to permanently delete this
                purchase order. This operation cannot be
                undone.

              </p>

            </div>

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Purchase Order Information
          </h2>

          <dl className="mt-8 grid gap-6 md:grid-cols-2">

            <div>

              <dt className="text-sm text-slate-500">
                Order Number
              </dt>

              <dd className="mt-1 font-semibold">
                {purchaseOrder.orderNumber}
              </dd>

            </div>

            <div>

              <dt className="text-sm text-slate-500">
                Status
              </dt>

              <dd className="mt-1 capitalize">
                {purchaseOrder.status}
              </dd>

            </div>

            <div>

              <dt className="text-sm text-slate-500">
                Vendor
              </dt>

              <dd className="mt-1">
                {purchaseOrder.vendor.companyName}
              </dd>

            </div>

            <div>

              <dt className="text-sm text-slate-500">
                Related Job
              </dt>

              <dd className="mt-1">

                {purchaseOrder.job ? (

                  <Link
                    href={`/jobs/${purchaseOrder.job.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {purchaseOrder.job.title}
                  </Link>

                ) : (

                  "No Job"

                )}

              </dd>

            </div>

            <div>

              <dt className="text-sm text-slate-500">
                Line Items
              </dt>

              <dd className="mt-1">
                {purchaseOrder._count.items}
              </dd>

            </div>

            <div>

              <dt className="text-sm text-slate-500">
                Total Amount
              </dt>

              <dd className="mt-1 font-semibold">

                $
                {purchaseOrder.total.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}

              </dd>

            </div>

            <div>

              <dt className="text-sm text-slate-500">
                Created
              </dt>

              <dd className="mt-1">
                {purchaseOrder.createdAt.toLocaleDateString()}
              </dd>

            </div>

            <div>

              <dt className="text-sm text-slate-500">
                Last Updated
              </dt>

              <dd className="mt-1">
                {purchaseOrder.updatedAt.toLocaleDateString()}
              </dd>

            </div>

          </dl>

        </div>

        <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-8">

          <h2 className="text-xl font-semibold text-yellow-900">
            Before You Delete
          </h2>

          <ul className="mt-6 list-disc space-y-3 pl-6 text-yellow-900">

            <li>
              This purchase order will be permanently
              removed.
            </li>

            <li>
              All associated purchase order items will
              also be deleted.
            </li>

            <li>
              This action cannot be undone.
            </li>

            <li>
              Historical reports referencing this
              purchase order may no longer display
              complete information.
            </li>

          </ul>

        </div>
                <div className="flex items-center justify-end gap-4">

          <Link
            href={`/purchase-orders/${purchaseOrder.id}`}
            className="rounded-xl border px-6 py-3 hover:bg-slate-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            Delete Purchase Order
          </button>

        </div>

      </form>

    </div>

  );

}