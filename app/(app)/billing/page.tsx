import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import { Prisma } from "@prisma/client";

import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}

export default async function BillingPage({
  searchParams,
}: PageProps) {

  const {
    search = "",
    status = "",
  } = await searchParams;

  const session =
    await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId =
    session.user.orgId;

  const where: Prisma.InvoiceWhereInput = {

    orgId,

    ...(search
      ? {

          OR: [

            {

              invoiceNumber: {

                contains: search,

                mode: Prisma.QueryMode.insensitive,

              },

            },

            {

              customer: {

                OR: [

                  {

                    companyName: {

                      contains: search,

                      mode: Prisma.QueryMode.insensitive,

                    },

                  },

                  {

                    firstName: {

                      contains: search,

                      mode: Prisma.QueryMode.insensitive,

                    },

                  },

                  {

                    lastName: {

                      contains: search,

                      mode: Prisma.QueryMode.insensitive,

                    },

                  },

                ],

              },

            },

            {

              job: {

                title: {

                  contains: search,

                  mode: Prisma.QueryMode.insensitive,

                },

              },

            },

          ],

        }
      : {}),

    ...(status
      ? {
          status,
        }
      : {}),

  };

  const [

    invoices,

    totalInvoices,

    draftCount,

    sentCount,

    paidCount,

    overdueCount,

  ] = await Promise.all([

    prisma.invoice.findMany({

      where,

      include: {

        customer: {

          select: {

            id: true,

            companyName: true,

            firstName: true,

            lastName: true,

          },

        },

        job: {

          select: {

            id: true,

            title: true,

          },

        },

      },

      orderBy: {

        createdAt: "desc",

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

  ]);

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Billing
          </h1>

          <p className="mt-2 text-slate-600">
            Manage invoices, billing and customer payments.
          </p>

        </div>

        <Link
          href="/billing/create"
          className="rounded-xl bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600"
        >
          New Invoice
        </Link>

      </div>
            <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Total Invoices
          </p>

          <h2 className="mt-3 text-5xl font-bold">
            {totalInvoices}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Draft
          </p>

          <h2 className="mt-3 text-5xl font-bold text-slate-700">
            {draftCount}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Sent
          </p>

          <h2 className="mt-3 text-5xl font-bold text-blue-600">
            {sentCount}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Paid
          </p>

          <h2 className="mt-3 text-5xl font-bold text-green-600">
            {paidCount}
          </h2>

          <p className="mt-2 text-sm text-red-600">
            Overdue: {overdueCount}
          </p>

        </div>

      </div>

      <form className="flex flex-col gap-4 lg:flex-row">

        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search invoice, customer or job..."
          className="flex-1 rounded-xl border px-5 py-3"
        />

        <select
          name="status"
          defaultValue={status}
          className="rounded-xl border px-5 py-3"
        >

          <option value="">
            All Statuses
          </option>

          <option value="draft">
            Draft
          </option>

          <option value="sent">
            Sent
          </option>

          <option value="paid">
            Paid
          </option>

          <option value="overdue">
            Overdue
          </option>

          <option value="cancelled">
            Cancelled
          </option>

        </select>

        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
        >
          Search
        </button>

      </form>

      <div className="overflow-hidden rounded-3xl border bg-white">

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
                Job
              </th>

              <th className="px-6 py-4 text-right">
                Total
              </th>

              <th className="px-6 py-4 text-left">
                Due Date
              </th>

              <th className="px-6 py-4 text-left">
                Status
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
                  colSpan={7}
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

                  {invoice.customer.companyName ??

                    `${invoice.customer.firstName} ${invoice.customer.lastName ?? ""}`}

                </td>

                <td className="px-6 py-4">

                  {invoice.job.title}

                </td>

                <td className="px-6 py-4 text-right font-semibold">

                  ₹{Number(invoice.total).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}

                </td>

                <td className="px-6 py-4">

                  {invoice.dueDate
                    ? invoice.dueDate.toLocaleDateString()
                    : "-"}

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

                <td className="px-6 py-4">

                  <div className="flex justify-end gap-4">

                    <Link
                      href={`/billing/${invoice.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      View
                    </Link>

                    <Link
                      href={`/billing/${invoice.id}/edit`}
                      className="font-medium text-orange-600 hover:underline"
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/billing/${invoice.id}/delete`}
                      className="font-medium text-red-600 hover:underline"
                    >
                      Delete
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