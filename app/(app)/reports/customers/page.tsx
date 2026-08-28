import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CustomerReportPage() {

  const session =
    await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId =
    session.user.orgId;

  const [

    totalCustomers,

    activeCustomers,

    invoices,

    customers,

  ] = await Promise.all([

    prisma.customer.count({

      where: {

        orgId,

      },

    }),

    prisma.customer.count({

      where: {

        orgId,

        jobs: {

          some: {},

        },

      },

    }),

    prisma.invoice.findMany({

      where: {

        orgId,

      },

      select: {

        customerId: true,

        total: true,

      },

    }),

    prisma.customer.findMany({

      where: {

        orgId,

      },

      include: {

        jobs: {

          select: {

            id: true,

            status: true,

          },

        },

      },

      orderBy: {

        companyName: "asc",

      },

    }),

  ]);

  const revenueByCustomer =
    new Map<
      string,
      number
    >();

  for (const invoice of invoices) {

    const current =

      revenueByCustomer.get(
        invoice.customerId,
      ) ?? 0;

    revenueByCustomer.set(

      invoice.customerId,

      current +
        Number(
          invoice.total,
        ),

    );

  }

  const customerRows =

    customers

      .map((customer) => ({

        ...customer,

        revenue:

          revenueByCustomer.get(
            customer.id,
          ) ?? 0,

      }))

      .sort(

        (a, b) =>

          b.revenue -
          a.revenue,

      );

  const totalRevenue =

    Array.from(

      revenueByCustomer.values(),

    ).reduce(

      (sum, value) =>

        sum + value,

      0,

    );

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
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

      <div className="grid gap-6 lg:grid-cols-4">

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
            Active Customers
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-600">
            {activeCustomers}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Total Revenue
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-600">

            ₹
            {totalRevenue.toLocaleString()}

          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Average Revenue
          </p>

          <h2 className="mt-3 text-4xl font-bold">

            ₹
            {(
              totalCustomers === 0
                ? 0
                : totalRevenue /
                  totalCustomers
            ).toLocaleString(
              undefined,
              {
                maximumFractionDigits: 2,
              },
            )}

          </h2>

        </div>

      </div>
            <div className="grid gap-6 lg:grid-cols-2">

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

              <dt>Active Customers</dt>

              <dd className="font-semibold text-green-600">
                {activeCustomers}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Inactive Customers</dt>

              <dd className="font-semibold text-red-600">
                {totalCustomers - activeCustomers}
              </dd>

            </div>

          </dl>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Revenue Summary
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">

              <dt>Total Revenue</dt>

              <dd className="font-semibold text-blue-600">
                ₹{totalRevenue.toLocaleString()}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Average Revenue / Customer</dt>

              <dd className="font-semibold">
                ₹{(
                  totalCustomers === 0
                    ? 0
                    : totalRevenue / totalCustomers
                ).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Revenue-Producing Customers</dt>

              <dd className="font-semibold">
                {customerRows.filter(
                  (customer) => customer.revenue > 0,
                ).length}
              </dd>

            </div>

          </dl>

        </div>

      </div>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <div className="border-b px-8 py-6">

          <h2 className="text-2xl font-bold">
            Top Customers
          </h2>

        </div>

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
                        {customerRows.length === 0 && (

              <tr>

                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No customers found.
                </td>

              </tr>

            )}

            {customerRows.map((customer) => (

              <tr
                key={customer.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="px-6 py-4">

                  <Link
                    href={`/customers/${customer.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {customer.companyName ||
                      `${customer.firstName} ${customer.lastName ?? ""}`}
                  </Link>

                </td>

                <td className="px-6 py-4 text-right">

                  {customer.jobs.length}

                </td>

                <td className="px-6 py-4 text-right font-semibold text-green-600">

                  ₹
                  {customer.revenue.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}

                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-end">

                    <Link
                      href={`/customers/${customer.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      View
                    </Link>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}