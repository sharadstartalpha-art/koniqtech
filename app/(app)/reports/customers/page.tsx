
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

export default async function CustomerReportPage() {
  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId = session.user.orgId;

  const [customers, revenueGroups] = await Promise.all([
    // Fetch only required customer fields
    prisma.customer.findMany({
      where: {
        orgId,
      },
      select: {
        id: true,
        companyName: true,
        firstName: true,
        lastName: true,
        _count: {
          select: {
            jobs: true,
          },
        },
      },
      orderBy: {
        companyName: "asc",
      },
    }),

    // Match Invoice Report revenue rules
    prisma.invoice.groupBy({
      by: ["customerId"],
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
  ]);

  // Revenue by customer
  const revenueByCustomer = new Map<string, number>();

  for (const group of revenueGroups) {
    revenueByCustomer.set(
      group.customerId,
      Number(group._sum.total ?? 0)
    );
  }

  const customerRows = customers
    .map((customer) => ({
      ...customer,
      revenue: revenueByCustomer.get(customer.id) ?? 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const totalCustomers = customers.length;

  // Customers with at least one job
  const activeCustomers = customers.filter(
    (customer) => customer._count.jobs > 0
  ).length;

  const totalRevenue = revenueGroups.reduce(
    (sum, group) =>
      sum + Number(group._sum.total ?? 0),
    0
  );

  const averageRevenue =
    totalCustomers === 0
      ? 0
      : totalRevenue / totalCustomers;

  const revenueProducingCustomers = customerRows.filter(
    (customer) => customer.revenue > 0
  ).length;

  const topCustomers = customerRows.slice(0, 10);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Customer Report
          </h1>

          <p className="mt-2 text-slate-600">
            Customer activity, revenue and engagement overview.
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
            Total Customers
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {totalCustomers}
          </h2>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <p className="text-slate-500">
            Customers With Jobs
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-600">
            {activeCustomers}
          </h2>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <p className="text-slate-500">
            Total Revenue
          </p>

          <h2 className="mt-3 text-3xl font-bold text-blue-600">
            {formatCurrency(totalRevenue)}
          </h2>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <p className="text-slate-500">
            Average Revenue
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {formatCurrency(averageRevenue)}
          </h2>
        </div>

      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Customer Summary */}
        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Customer Summary
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">
              <dt>Total Customers</dt>

              <dd className="font-semibold">
                {totalCustomers}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt>Customers With Jobs</dt>

              <dd className="font-semibold text-green-600">
                {activeCustomers}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt>Customers Without Jobs</dt>

              <dd className="font-semibold text-red-600">
                {totalCustomers - activeCustomers}
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

              <dd className="font-semibold text-blue-600">
                {formatCurrency(totalRevenue)}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4">
              <dt>Average Revenue / Customer</dt>

              <dd className="font-semibold">
                {formatCurrency(averageRevenue)}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4">
              <dt>Revenue-Producing Customers</dt>

              <dd className="font-semibold">
                {revenueProducingCustomers}
              </dd>
            </div>

          </dl>
        </div>

      </div>

      {/* Top Customers */}
      <div className="overflow-hidden rounded-3xl border bg-white">

        <div className="border-b px-6 md:px-8 py-6">
          <h2 className="text-2xl font-bold">
            Top Customers
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Top 10 customers ranked by invoice revenue.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">

            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  Customer
                </th>

                <th className="px-6 py-4 text-right">
                  Jobs
                </th>

                <th className="px-6 py-4 text-right">
                  Revenue
                </th>

                <th className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {topCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No customers found.
                  </td>
                </tr>
              )}

              {topCustomers.map((customer) => {
                const customerName =
                  customer.companyName ||
                  `${customer.firstName} ${
                    customer.lastName ?? ""
                  }`.trim();

                return (
                  <tr
                    key={customer.id}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/customers/${customer.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {customerName || "Unnamed Customer"}
                      </Link>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {customer._count.jobs}
                    </td>

                    <td className="px-6 py-4 text-right font-semibold text-green-600">
                      {formatCurrency(customer.revenue)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/customers/${customer.id}`}
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
