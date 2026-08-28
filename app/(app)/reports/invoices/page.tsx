import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function InvoiceReportPage() {

  const session =
    await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId =
    session.user.orgId;

  const invoices =
    await prisma.invoice.findMany({

      where: {
        orgId,
      },

      include: {

        customer: true,

        job: true,

      },

      orderBy: {
        createdAt: "desc",
      },

    });

  const totalInvoices =
    invoices.length;

  const totalRevenue =
    invoices.reduce(

      (sum, invoice) =>

        sum +
        Number(invoice.total),

      0,

    );

  const draftInvoices =
    invoices.filter(
      (invoice) =>
        invoice.status === "draft",
    );

  const sentInvoices =
    invoices.filter(
      (invoice) =>
        invoice.status === "sent",
    );

  const paidInvoices =
    invoices.filter(
      (invoice) =>
        invoice.status === "paid",
    );

  const overdueInvoices =
    invoices.filter(
      (invoice) =>
        invoice.status === "overdue",
    );

  const cancelledInvoices =
    invoices.filter(
      (invoice) =>
        invoice.status === "cancelled",
    );

  const outstandingBalance =
    invoices

      .filter(
        (invoice) =>
          invoice.status !== "paid",
      )

      .reduce(

        (sum, invoice) =>

          sum +
          Number(invoice.total),

        0,

      );

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
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

      <div className="grid gap-6 lg:grid-cols-4">

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

          <h2 className="mt-3 text-4xl font-bold text-green-600">

            ₹
            {totalRevenue.toLocaleString()}

          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Paid Invoices
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-600">
            {paidInvoices.length}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Outstanding
          </p>

          <h2 className="mt-3 text-4xl font-bold text-red-600">

            ₹
            {outstandingBalance.toLocaleString()}

          </h2>

        </div>

      </div>
            <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Invoice Status Summary
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">

              <dt>Draft</dt>

              <dd className="font-semibold text-slate-600">
                {draftInvoices.length}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Sent</dt>

              <dd className="font-semibold text-blue-600">
                {sentInvoices.length}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Paid</dt>

              <dd className="font-semibold text-green-600">
                {paidInvoices.length}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Overdue</dt>

              <dd className="font-semibold text-red-600">
                {overdueInvoices.length}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Cancelled</dt>

              <dd className="font-semibold text-orange-600">
                {cancelledInvoices.length}
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

              <dd className="font-semibold text-green-600">
                ₹{totalRevenue.toLocaleString()}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Outstanding Balance</dt>

              <dd className="font-semibold text-red-600">
                ₹{outstandingBalance.toLocaleString()}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Paid Revenue</dt>

              <dd className="font-semibold text-blue-600">

                ₹
                {paidInvoices
                  .reduce(
                    (sum, invoice) =>
                      sum + Number(invoice.total),
                    0,
                  )
                  .toLocaleString()}

              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Collection Rate</dt>

              <dd className="font-semibold text-green-600">

                {totalRevenue === 0
                  ? "0%"
                  : `${(
                      (paidInvoices.reduce(
                        (sum, invoice) =>
                          sum + Number(invoice.total),
                        0,
                      ) /
                        totalRevenue) *
                      100
                    ).toFixed(1)}%`}

              </dd>

            </div>

          </dl>

        </div>

      </div>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <div className="border-b px-8 py-6">

          <h2 className="text-2xl font-bold">
            Recent Invoices
          </h2>

        </div>

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
                        {invoices.length === 0 && (

              <tr>

                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No invoices found.
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

                <td className="px-6 py-4 text-right font-semibold">

                  ₹
                  {Number(invoice.total).toLocaleString(
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
                      href={`/billing/${invoice.id}`}
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