import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RevenueReportPage() {

  const session =
    await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId =
    session.user.orgId;

  const [

    totalRevenue,

    paidRevenue,

    outstandingRevenue,

    totalInvoices,

    paidInvoices,

    overdueInvoices,

    invoices,

  ] = await Promise.all([

    prisma.invoice.aggregate({

      where: {

        orgId,

      },

      _sum: {

        total: true,

      },

    }),

    prisma.invoice.aggregate({

      where: {

        orgId,

        status: "paid",

      },

      _sum: {

        total: true,

      },

    }),

    prisma.invoice.aggregate({

      where: {

        orgId,

        NOT: {

          status: "paid",

        },

      },

      _sum: {

        total: true,

      },

    }),

    prisma.invoice.count({

      where: {

        orgId,

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

    prisma.invoice.findMany({

      where: {

        orgId,

      },

      include: {

        customer: {

          select: {

            companyName: true,

            firstName: true,

            lastName: true,

          },

        },

      },

      orderBy: {

        total: "desc",

      },

      take: 10,

    }),

  ]);

  const collectionRate =

    totalInvoices === 0

      ? 0

      : (paidInvoices / totalInvoices) * 100;

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Revenue Report
          </h1>

          <p className="mt-2 text-slate-600">
            Revenue, collections and outstanding invoice analytics.
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
            Total Revenue
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-600">

            ${Number(
              totalRevenue._sum.total ?? 0
            ).toLocaleString()}

          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Paid Revenue
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-600">

            ${Number(
              paidRevenue._sum.total ?? 0
            ).toLocaleString()}

          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Outstanding
          </p>

          <h2 className="mt-3 text-4xl font-bold text-red-600">

            ${Number(
              outstandingRevenue._sum.total ?? 0
            ).toLocaleString()}

          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Collection Rate
          </p>

          <h2 className="mt-3 text-4xl font-bold">

            {collectionRate.toFixed(1)}%

          </h2>

        </div>

      </div>

            <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Revenue Summary
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">

              <dt>Total Revenue</dt>

              <dd className="font-semibold text-green-600">
                ${Number(
                  totalRevenue._sum.total ?? 0
                ).toLocaleString()}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Paid Revenue</dt>

              <dd className="font-semibold text-blue-600">
                ${Number(
                  paidRevenue._sum.total ?? 0
                ).toLocaleString()}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Outstanding Revenue</dt>

              <dd className="font-semibold text-red-600">
                ${Number(
                  outstandingRevenue._sum.total ?? 0
                ).toLocaleString()}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Collection Rate</dt>

              <dd className="font-semibold">
                {collectionRate.toFixed(1)}%
              </dd>

            </div>

          </dl>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Invoice Collection
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">

              <dt>Total Invoices</dt>

              <dd className="font-semibold">
                {totalInvoices}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Paid Invoices</dt>

              <dd className="font-semibold text-green-600">
                {paidInvoices}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Overdue Invoices</dt>

              <dd className="font-semibold text-red-600">
                {overdueInvoices}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Outstanding Invoices</dt>

              <dd className="font-semibold">
                {totalInvoices - paidInvoices}
              </dd>

            </div>

          </dl>

        </div>

      </div>

      <div className="rounded-3xl border bg-white overflow-hidden">

        <div className="border-b px-8 py-6">

          <h2 className="text-2xl font-bold">
            Top Revenue Invoices
          </h2>

        </div>

        <table className="min-w-full">

          <thead className="bg-slate-50 border-b">

            <tr>

              <th className="px-6 py-4 text-left">
                Invoice
              </th>

              <th className="px-6 py-4 text-left">
                Customer
              </th>

              <th className="px-6 py-4 text-right">
                Amount
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

                        {invoices.length === 0 && (

              <tr>

                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No invoice data available.
                </td>

              </tr>

            )}

            {invoices.map((invoice) => (

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

                  {invoice.customer.companyName ||

                    `${invoice.customer.firstName} ${invoice.customer.lastName ?? ""}`}

                </td>

                <td className="px-6 py-4 text-right font-semibold">

                  ${Number(invoice.total).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}

                </td>

                <td className="px-6 py-4">

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium
                    ${
                      invoice.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : invoice.status === "sent"
                        ? "bg-blue-100 text-blue-700"
                        : invoice.status === "draft"
                        ? "bg-slate-100 text-slate-700"
                        : invoice.status === "overdue"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {invoice.status.charAt(0).toUpperCase() +
                      invoice.status.slice(1)}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}