
import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export default async function InvoiceReportPage() {
  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId = session.user.orgId;

  const [
    totalInvoices,
    draftCount,
    sentCount,
    paidCount,
    overdueCount,
    cancelledCount,
    totalRevenueResult,
    paidRevenueResult,
    outstandingResult,
    recentInvoices,
  ] = await Promise.all([
    // All invoices, including drafts and cancelled
    prisma.invoice.count({
      where: { orgId },
    }),

    prisma.invoice.count({
      where: {
        orgId,
        status: "draft",
      },
    }),

    prisma.invoice.count({
      where: {
        orgId,
        status: "sent",
      },
    }),

    prisma.invoice.count({
      where: {
        orgId,
        status: "paid",
      },
    }),

    prisma.invoice.count({
      where: {
        orgId,
        status: "overdue",
      },
    }),

    prisma.invoice.count({
      where: {
        orgId,
        status: "cancelled",
      },
    }),

    // Valid invoice revenue excludes drafts and cancellations
    prisma.invoice.aggregate({
      where: {
        orgId,
        status: {
          in: ["paid", "sent", "overdue"],
        },
      },
      _sum: {
        total: true,
      },
    }),

    // Actually collected revenue
    prisma.invoice.aggregate({
      where: {
        orgId,
        status: "paid",
      },
      _sum: {
        total: true,
      },
    }),

    // Outstanding collectible balance
    prisma.invoice.aggregate({
      where: {
        orgId,
        status: {
          in: ["sent", "overdue"],
        },
      },
      _sum: {
        total: true,
      },
    }),

    // Latest 10 invoices only
    prisma.invoice.findMany({
      where: {
        orgId,
      },
      select: {
        id: true,
        invoiceNumber: true,
        total: true,
        status: true,
        createdAt: true,
        customer: {
          select: {
            companyName: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),
  ]);

  const totalRevenue = Number(
    totalRevenueResult._sum.total ?? 0
  );

  const paidRevenue = Number(
    paidRevenueResult._sum.total ?? 0
  );

  const outstandingBalance = Number(
    outstandingResult._sum.total ?? 0
  );

  const collectionRate =
    totalRevenue > 0
      ? (paidRevenue / totalRevenue) * 100
      : 0;

  const statusStyle: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    sent: "bg-blue-100 text-blue-700",
    draft: "bg-slate-100 text-slate-700",
    overdue: "bg-red-100 text-red-700",
    cancelled: "bg-orange-100 text-orange-700",
  };

  const statusLabel = (status: string) =>
    status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Invoice Report
          </h1>

          <p className="mt-2 text-slate-600">
            Revenue, payment status and invoice performance.
          </p>
        </div>

        <Link
          href="/reports"
          className="rounded-xl border px-6 py-3 hover:bg-slate-50"
        >
          Back
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-3xl border bg-white p-6">
          <p className="text-slate-500">
            Total Invoices
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {totalInvoices}
          </h2>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <p className="text-slate-500">
            Total Revenue
          </p>

          <h2 className="mt-3 text-3xl font-bold text-green-600">
            {formatCurrency(totalRevenue)}
          </h2>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <p className="text-slate-500">
            Paid Invoices
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-600">
            {paidCount}
          </h2>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <p className="text-slate-500">
            Outstanding
          </p>

          <h2 className="mt-3 text-3xl font-bold text-red-600">
            {formatCurrency(outstandingBalance)}
          </h2>
        </div>

      </div>

      {/* Summary */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Invoice Status */}
        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Invoice Status Summary
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">
              <dt>Draft</dt>
              <dd className="font-semibold text-slate-600">
                {draftCount}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt>Sent</dt>
              <dd className="font-semibold text-blue-600">
                {sentCount}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt>Paid</dt>
              <dd className="font-semibold text-green-600">
                {paidCount}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt>Overdue</dt>
              <dd className="font-semibold text-red-600">
                {overdueCount}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt>Cancelled</dt>
              <dd className="font-semibold text-orange-600">
                {cancelledCount}
              </dd>
            </div>

          </dl>
        </div>

        {/* Revenue Summary */}
        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Revenue Summary
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between gap-4">
              <dt>Total Revenue</dt>

              <dd className="font-semibold text-green-600">
                {formatCurrency(totalRevenue)}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4">
              <dt>Outstanding Balance</dt>

              <dd className="font-semibold text-red-600">
                {formatCurrency(outstandingBalance)}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4">
              <dt>Paid Revenue</dt>

              <dd className="font-semibold text-blue-600">
                {formatCurrency(paidRevenue)}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 border-t pt-5">
              <dt>Collection Rate</dt>

              <dd className="font-bold text-green-600">
                {collectionRate.toFixed(2)}%
              </dd>
            </div>

          </dl>
        </div>

      </div>

      {/* Recent Invoices */}
      <div className="overflow-hidden rounded-3xl border bg-white">

        <div className="border-b px-6 md:px-8 py-6">
          <h2 className="text-2xl font-bold">
            Recent Invoices
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest 10 invoices across your organization.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">

            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  Invoice
                </th>

                <th className="px-6 py-4 text-left">
                  Customer
                </th>

                <th className="px-6 py-4 text-left">
                  Status
                </th>

                <th className="px-6 py-4 text-right">
                  Total
                </th>

                <th className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {recentInvoices.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No invoices found.
                  </td>
                </tr>
              )}

              {recentInvoices.map((invoice) => {
                const customerName =
                  invoice.customer.companyName ||
                  `${invoice.customer.firstName} ${
                    invoice.customer.lastName ?? ""
                  }`.trim();

                return (
                  <tr
                    key={invoice.id}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/billing/${invoice.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {invoice.invoiceNumber}
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      {customerName || "Unknown Customer"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                          statusStyle[invoice.status] ??
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {statusLabel(invoice.status)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right font-semibold">
                      {formatCurrency(Number(invoice.total))}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/billing/${invoice.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
