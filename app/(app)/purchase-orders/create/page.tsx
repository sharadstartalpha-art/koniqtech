import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import {
  redirect,
} from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CreatePurchaseOrderPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId = (session.user as any).orgId;

  const [
    vendors,
    jobs,
    inventoryItems,
    lastPurchaseOrder,
  ] = await Promise.all([
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
        createdAt: "desc",
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
        unitPrice: true,
      },
    }),

    prisma.purchaseOrder.findFirst({
      where: {
        orgId,
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        orderNumber: true,
      },
    }),
  ]);

  async function createPurchaseOrder(
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

    const notes =
      String(
        formData.get("notes") ?? ""
      ).trim();

    if (
      !vendorId ||
      !orderNumber
    ) {
      throw new Error(
        "Vendor and Order Number are required."
      );
    }

    const quantity =
      Number(
        formData.get("quantity") ?? 1
      );

    const unitPrice =
      Number(
        formData.get("unitPrice") ?? 0
      );

    const tax =
      Number(
        formData.get("tax") ?? 0
      );

    const discount =
      Number(
        formData.get("discount") ?? 0
      );

    const shipping =
      Number(
        formData.get("shipping") ?? 0
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
      ).trim();

    const inventoryItemId =
      String(
        formData.get(
          "inventoryItemId"
        ) ?? ""
      );

    const purchaseOrder =
      await prisma.purchaseOrder.create({

        data: {
          orgId,

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

          notes,

          items: {

            create: [

              {
                description,

                quantity,

                unitPrice,

                tax,

                total,

                inventoryItemId:
                  inventoryItemId ||
                  null,
              },

            ],

          },

        },

      });

      redirect(
        `/purchase-orders/${purchaseOrder.id}`
      );
  }

  const nextOrderNumber =
    lastPurchaseOrder
      ? `PO-${String(
          Number(
            lastPurchaseOrder.orderNumber.replace(
              /\D/g,
              ""
            ) + 1
          )
        ).padStart(6, "0")}`
      : "PO-000001";

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <Link
          href="/purchase-orders"
          className="text-blue-600 hover:underline"
        >
          ← Back to Purchase Orders
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Create Purchase Order
        </h1>

        <p className="mt-2 text-slate-600">
          Create a new purchase order
          for a vendor.
        </p>

      </div>

      <form
        action={
          createPurchaseOrder
        }
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
                defaultValue={nextOrderNumber}
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
                defaultValue="draft"
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
                required
                className="w-full rounded-xl border px-4 py-3"
              >

                <option value="">
                  Select Vendor
                </option>

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
                required
                placeholder="Description"
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Quantity
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                defaultValue={1}
                name="quantity"
                required
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Unit Price
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                defaultValue={0}
                name="unitPrice"
                required
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Tax
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                defaultValue={0}
                name="tax"
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Discount
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                defaultValue={0}
                name="discount"
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div className="md:col-span-2">

              <label className="mb-2 block font-medium">
                Shipping
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                defaultValue={0}
                name="shipping"
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
              placeholder="Internal notes, shipping instructions, vendor notes..."
              className="w-full rounded-xl border px-4 py-3"
            />

          </div>

        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

          <h2 className="text-xl font-semibold text-blue-900">
            Information
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

            <p>

              A purchase order will be created in
              <strong> Draft </strong>
              status unless another status is selected.

            </p>

            <p>

              The first line item entered here will
              automatically create the purchase order.
              Additional items can be added later.

            </p>

            <p>

              Financial totals are calculated
              automatically using:

            </p>

            <ul className="list-disc space-y-1 pl-6">

              <li>Subtotal = Quantity × Unit Price</li>

              <li>Total = Subtotal + Tax + Shipping − Discount</li>

            </ul>

          </div>

        </div>

        <div className="flex items-center justify-end gap-4">

          <Link
            href="/purchase-orders"
            className="rounded-xl border px-6 py-3 hover:bg-slate-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Create Purchase Order
          </button>

        </div>

      </form>

    </div>

  );

}