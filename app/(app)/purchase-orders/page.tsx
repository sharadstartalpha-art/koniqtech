import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import {
  redirect,
} from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    vendor?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 20;

function badgeColor(status: string) {
  switch (status.toLowerCase()) {
    case "draft":
      return "bg-slate-100 text-slate-700";

    case "ordered":
      return "bg-blue-100 text-blue-700";

    case "received":
      return "bg-green-100 text-green-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default async function PurchaseOrdersPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId = (session.user as any).orgId;

  const search = params.search?.trim() ?? "";

  const status = params.status ?? "";

  const vendor = params.vendor ?? "";

  const currentPage = Math.max(
    Number(params.page ?? "1"),
    1
  );

  const where = {
    orgId,

    ...(search && {
      OR: [
        {
          orderNumber: {
            contains: search,
            mode: "insensitive" as const,
          },
        },

        {
          vendor: {
            companyName: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        },

        {
          job: {
            title: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        },
      ],
    }),

    ...(status && {
      status,
    }),

    ...(vendor && {
      vendorId: vendor,
    }),
  };

  const [
    purchaseOrders,
    totalPurchaseOrders,
    vendors,

    totalValue,

    draftCount,

    orderedCount,

    receivedCount,

    cancelledCount,
  ] = await Promise.all([
    prisma.purchaseOrder.findMany({
      where,

      include: {
        vendor: {
          select: {
            id: true,
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

      orderBy: {
        createdAt: "desc",
      },

      skip:
        (currentPage - 1) *
        PAGE_SIZE,

      take: PAGE_SIZE,
    }),

    prisma.purchaseOrder.count({
      where,
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

    prisma.purchaseOrder.aggregate({
      where: {
        orgId,
      },

      _sum: {
        total: true,
      },
    }),

    prisma.purchaseOrder.count({
      where: {
        orgId,
        status: "draft",
      },
    }),

    prisma.purchaseOrder.count({
      where: {
        orgId,
        status: "ordered",
      },
    }),

    prisma.purchaseOrder.count({
      where: {
        orgId,
        status: "received",
      },
    }),

    prisma.purchaseOrder.count({
      where: {
        orgId,
        status: "cancelled",
      },
    }),
  ]);

  const totalPages = Math.max(
    Math.ceil(
      totalPurchaseOrders /
        PAGE_SIZE
    ),
    1
  );
    return (

    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Purchase Orders
          </h1>

          <p className="mt-2 text-slate-600">
            Manage vendor purchase orders across your organization.
          </p>

        </div>

        <Link
          href="/purchase-orders/create"
          className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          + New Purchase Order
        </Link>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

        <div className="rounded-3xl border bg-white p-6">

          <div className="text-sm text-slate-500">
            Total Purchase Orders
          </div>

          <div className="mt-2 text-3xl font-bold">
            {totalPurchaseOrders}
          </div>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <div className="text-sm text-slate-500">
            Draft
          </div>

          <div className="mt-2 text-3xl font-bold text-slate-700">
            {draftCount}
          </div>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <div className="text-sm text-slate-500">
            Ordered
          </div>

          <div className="mt-2 text-3xl font-bold text-blue-600">
            {orderedCount}
          </div>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <div className="text-sm text-slate-500">
            Received
          </div>

          <div className="mt-2 text-3xl font-bold text-green-600">
            {receivedCount}
          </div>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <div className="text-sm text-slate-500">
            Total Value
          </div>

          <div className="mt-2 text-3xl font-bold">

            $
            {(totalValue._sum.total ?? 0).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}

          </div>

        </div>

      </div>

      <form
        className="rounded-3xl border bg-white p-6"
        method="GET"
      >

        <div className="grid gap-4 lg:grid-cols-4">

          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search purchase orders..."
            className="rounded-xl border px-4 py-3"
          />

          <select
            name="status"
            defaultValue={status}
            className="rounded-xl border px-4 py-3"
          >

            <option value="">
              All Statuses
            </option>

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

          <select
            name="vendor"
            defaultValue={vendor}
            className="rounded-xl border px-4 py-3"
          >

            <option value="">
              All Vendors
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

          <button
            className="rounded-xl bg-slate-900 px-6 py-3 text-white hover:bg-black"
          >
            Apply Filters
          </button>

        </div>

      </form>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="border-b bg-slate-50">

              <tr>

                <th className="px-6 py-4 text-left">
                  Order #
                </th>

                <th className="px-6 py-4 text-left">
                  Vendor
                </th>

                <th className="px-6 py-4 text-left">
                  Job
                </th>

                <th className="px-6 py-4 text-left">
                  Status
                </th>

                <th className="px-6 py-4 text-right">
                  Items
                </th>

                <th className="px-6 py-4 text-right">
                  Total
                </th>

                <th className="px-6 py-4 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>
                              {purchaseOrders.length === 0 ? (

                <tr>

                  <td
                    colSpan={7}
                    className="px-8 py-16 text-center text-slate-500"
                  >

                    No purchase orders found.

                  </td>

                </tr>

              ) : (

                purchaseOrders.map(
                  (purchaseOrder) => (

                    <tr
                      key={purchaseOrder.id}
                      className="border-b hover:bg-slate-50"
                    >

                      <td className="px-6 py-5 font-semibold">

                        <Link
                          href={`/purchase-orders/${purchaseOrder.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {purchaseOrder.orderNumber}
                        </Link>

                      </td>

                      <td className="px-6 py-5">

                        {purchaseOrder.vendor.companyName}

                      </td>

                      <td className="px-6 py-5">

                        {purchaseOrder.job ? (

                          <Link
                            href={`/jobs/${purchaseOrder.job.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {purchaseOrder.job.title}
                          </Link>

                        ) : (

                          <span className="text-slate-400">
                            —
                          </span>

                        )}

                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-3
                            py-1
                            text-sm
                            font-medium
                            ${badgeColor(
                              purchaseOrder.status
                            )}
                          `}
                        >
                          {purchaseOrder.status}
                        </span>

                      </td>

                      <td className="px-6 py-5 text-right">

                        {purchaseOrder._count.items}

                      </td>

                      <td className="px-6 py-5 text-right font-semibold">

                        $
                        {purchaseOrder.total.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}

                      </td>

                      <td className="px-6 py-5">

                        <div className="flex justify-center gap-2">

                          <Link
                            href={`/purchase-orders/${purchaseOrder.id}`}
                            className="rounded-lg border px-3 py-2 hover:bg-slate-100"
                          >
                            View
                          </Link>

                          <Link
                            href={`/purchase-orders/${purchaseOrder.id}/edit`}
                            className="rounded-lg border px-3 py-2 hover:bg-slate-100"
                          >
                            Edit
                          </Link>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {totalPages > 1 && (

        <div className="flex items-center justify-between rounded-3xl border bg-white p-6">

          <div className="text-sm text-slate-600">

            Showing page{" "}
            <strong>
              {currentPage}
            </strong>{" "}
            of{" "}
            <strong>
              {totalPages}
            </strong>

          </div>

          <div className="flex gap-3">

            <Link
              href={`?search=${encodeURIComponent(
                search
              )}&status=${status}&vendor=${vendor}&page=${Math.max(
                currentPage - 1,
                1
              )}`}
              className={`rounded-xl border px-5 py-2 ${
                currentPage === 1
                  ? "pointer-events-none opacity-40"
                  : "hover:bg-slate-100"
              }`}
            >
              Previous
            </Link>

            <Link
              href={`?search=${encodeURIComponent(
                search
              )}&status=${status}&vendor=${vendor}&page=${Math.min(
                currentPage + 1,
                totalPages
              )}`}
              className={`rounded-xl border px-5 py-2 ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-40"
                  : "hover:bg-slate-100"
              }`}
            >
              Next
            </Link>

          </div>

        </div>

      )}

    </div>

  );

}