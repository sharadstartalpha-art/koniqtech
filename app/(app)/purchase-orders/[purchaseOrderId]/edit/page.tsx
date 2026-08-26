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

export default async function EditPurchaseOrderPage({
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

  const [
    purchaseOrder,
    vendors,
    jobs,
    inventoryItems,
  ] = await Promise.all([

    prisma.purchaseOrder.findFirst({

      where: {
        id: purchaseOrderId,
        orgId,
      },

      include: {

        items: {

          include: {

            inventoryItem: {

              select: {
                id: true,
                name: true,
                sku: true,
              },

            },

          },

          orderBy: {
            createdAt: "asc",
          },

        },

      },

    }),

    prisma.vendor.findMany({

      where: {
        orgId,
      },

      orderBy: {
        companyName: "asc",
      },

      select: {
        id: true,
        companyName: true,
      },

    }),

    prisma.job.findMany({

      where: {
        orgId,
      },

      orderBy: {
        title: "asc",
      },

      select: {
        id: true,
        title: true,
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

  ]);

  if (!purchaseOrder) {
    notFound();
  }
    
  const firstItem =
    purchaseOrder.items[0];

  async function updatePurchaseOrder(
    formData: FormData
  ) {
    "use server";

    const session =
      await auth();

    if (!session?.user) {
      redirect("/login");
    }

    const orgId =
      (session.user as any).orgId;

    const vendorId =
      String(
        formData.get("vendorId")
      );

    const jobId =
      String(
        formData.get("jobId") ?? ""
      );

    const orderNumber =
      String(
        formData.get("orderNumber")
      ).trim();

    const status =
      String(
        formData.get("status")
      );

    const orderedAt =
      String(
        formData.get("orderedAt") ?? ""
      );

    const expectedDate =
      String(
        formData.get("expectedDate") ?? ""
      );

    const receivedAt =
      String(
        formData.get("receivedAt") ?? ""
      );

    const notes =
      String(
        formData.get("notes") ?? ""
      ).trim();

    const quantity =
      Number(
        formData.get("quantity")
      );

    const unitPrice =
      Number(
        formData.get("unitPrice")
      );

    const tax =
      Number(
        formData.get("tax")
      );

    const discount =
      Number(
        formData.get("discount")
      );

    const shipping =
      Number(
        formData.get("shipping")
      );

    const subtotal =
      quantity * unitPrice;

    const total =
      subtotal +
      tax +
      shipping -
      discount;

    const description =
      String(
        formData.get("description")
      );

    const inventoryItemId =
      String(
        formData.get("inventoryItemId") ??
          ""
      );

    await prisma.purchaseOrder.update({

      where: {
        id: purchaseOrderId,
        orgId,
      },

      data: {

        vendorId,

        jobId:
          jobId || null,

        orderNumber,

        status,

        subtotal,

        tax,

        discount,

        shipping,

        total,

        orderedAt:
          orderedAt
            ? new Date(
                orderedAt
              )
            : null,

        expectedDate:
          expectedDate
            ? new Date(
                expectedDate
              )
            : null,

        receivedAt:
          receivedAt
            ? new Date(
                receivedAt
              )
            : null,

        notes,

      },

    });

    if (firstItem) {

      await prisma.purchaseOrderItem.update({

        where: {
          id: firstItem.id,
        },

        data: {

          description,

          quantity,

          unitPrice,

          tax,

          total,

          inventoryItemId:
            inventoryItemId ||
            null,

        },

      });

    }

    redirect(`/purchase-orders/${purchaseOrderId}`);
  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <Link
          href={`/purchase-orders/${purchaseOrder.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Purchase Order
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Edit Purchase Order
        </h1>

        <p className="mt-2 text-slate-600">
          Update purchase order details.
        </p>

      </div>

      <form
        action={updatePurchaseOrder}
        className="space-y-8"
      >
                <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Purchase Order Information
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Order Number
              </label>

              <input
                name="orderNumber"
                defaultValue={purchaseOrder.orderNumber}
                required
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Status
              </label>

              <select
                name="status"
                defaultValue={purchaseOrder.status}
                className="w-full rounded-xl border px-4 py-3"
              >

                <option value="draft">
                  Draft
                </option>

                <option value="ordered">
                  Ordered
                </option>

                <option value="received">
                  Received
                </option>

                <option value="cancelled">
                  Cancelled
                </option>

              </select>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Vendor
              </label>

              <select
                name="vendorId"
                defaultValue={purchaseOrder.vendorId}
                required
                className="w-full rounded-xl border px-4 py-3"
              >

                {vendors.map((vendor) => (

                  <option
                    key={vendor.id}
                    value={vendor.id}
                  >
                    {vendor.companyName}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Job
              </label>

              <select
                name="jobId"
                defaultValue={purchaseOrder.jobId ?? ""}
                className="w-full rounded-xl border px-4 py-3"
              >

                <option value="">
                  No Job
                </option>

                {jobs.map((job) => (

                  <option
                    key={job.id}
                    value={job.id}
                  >
                    {job.title}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Ordered Date
              </label>

              <input
                type="date"
                name="orderedAt"
                defaultValue={
                  purchaseOrder.orderedAt
                    ?.toISOString()
                    .split("T")[0]
                }
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Expected Delivery
              </label>

              <input
                type="date"
                name="expectedDate"
                defaultValue={
                  purchaseOrder.expectedDate
                    ?.toISOString()
                    .split("T")[0]
                }
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div className="md:col-span-2">

              <label className="mb-2 block font-medium">
                Received Date
              </label>

              <input
                type="date"
                name="receivedAt"
                defaultValue={
                  purchaseOrder.receivedAt
                    ?.toISOString()
                    .split("T")[0]
                }
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            First Purchase Order Item
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div className="md:col-span-2">

              <label className="mb-2 block font-medium">
                Inventory Item
              </label>

              <select
                name="inventoryItemId"
                defaultValue={
                  firstItem?.inventoryItemId ?? ""
                }
                className="w-full rounded-xl border px-4 py-3"
              >

                <option value="">
                  Custom Item
                </option>

                {inventoryItems.map((item) => (

                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                    {item.sku
                      ? ` (${item.sku})`
                      : ""}
                  </option>

                ))}

              </select>

            </div>

            <div className="md:col-span-2">

              <label className="mb-2 block font-medium">
                Description
              </label>

              <input
                name="description"
                defaultValue={
                  firstItem?.description ?? ""
                }
                required
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                step="0.01"
                min="0"
                defaultValue={
                  firstItem?.quantity ?? 1
                }
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Unit Price
              </label>

              <input
                type="number"
                name="unitPrice"
                step="0.01"
                min="0"
                defaultValue={
                  firstItem?.unitPrice ?? 0
                }
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Tax
              </label>

              <input
                type="number"
                name="tax"
                step="0.01"
                min="0"
                defaultValue={
                  firstItem?.tax ?? 0
                }
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Discount
              </label>

              <input
                type="number"
                name="discount"
                step="0.01"
                min="0"
                defaultValue={
                  purchaseOrder.discount
                }
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div className="md:col-span-2">

              <label className="mb-2 block font-medium">
                Shipping
              </label>

              <input
                type="number"
                name="shipping"
                step="0.01"
                min="0"
                defaultValue={
                  purchaseOrder.shipping
                }
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

          </div>

        </div>
                <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Notes
          </h2>

          <div className="mt-6">

            <textarea
              name="notes"
              rows={6}
              defaultValue={purchaseOrder.notes ?? ""}
              placeholder="Internal notes, delivery instructions, vendor communication..."
              className="w-full rounded-xl border px-4 py-3"
            />

          </div>

        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

          <h2 className="text-xl font-semibold text-blue-900">
            Purchase Order Summary
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

            <p>

              Vendor:
              <strong>
                {" "}
                {vendors.find(
                  (v) =>
                    v.id ===
                    purchaseOrder.vendorId
                )?.companyName ??
                  "Vendor"}
              </strong>

            </p>

            <p>

              Current Status:
              <strong>
                {" "}
                {purchaseOrder.status}
              </strong>

            </p>

            <p>

              Updating this purchase order will
              automatically recalculate the
              financial totals using:

            </p>

            <ul className="list-disc space-y-1 pl-6">

              <li>
                Subtotal = Quantity × Unit Price
              </li>

              <li>
                Total = Subtotal + Tax + Shipping −
                Discount
              </li>

            </ul>

            <p>

              Additional purchase order items can
              be managed separately after saving.

            </p>

          </div>

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
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Save Changes
          </button>

        </div>

      </form>

    </div>

  );

}