import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {

  const session =
    await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId =
    session.user.orgId;

  const [

    totalCustomers,

    totalJobs,

    totalInvoices,

    totalRevenue,

    paidRevenue,

    outstandingRevenue,

    draftInvoices,

    sentInvoices,

    paidInvoices,

    overdueInvoices,

    completedJobs,

    inProgressJobs,

    scheduledJobs,

    cancelledJobs,

  ] = await Promise.all([

    prisma.customer.count({

      where: {

        orgId,

      },

    }),

    prisma.job.count({

      where: {

        orgId,

      },

    }),

    prisma.invoice.count({

      where: {

        orgId,

      },

    }),

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

    prisma.job.count({

      where: {

        orgId,

        status: "completed",

      },

    }),

    prisma.job.count({

      where: {

        orgId,

        status: "in_progress",

      },

    }),

    prisma.job.count({

      where: {

        orgId,

        status: "scheduled",

      },

    }),

    prisma.job.count({

      where: {

        orgId,

        status: "cancelled",

      },

    }),

  ]);

  const averageJobValue =

    totalJobs === 0

      ? 0

      : Number(
          totalRevenue._sum.total ?? 0
        ) / totalJobs;

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Reports
          </h1>

          <p className="mt-2 text-slate-600">
            Business analytics and performance dashboard.
          </p>

        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Total Revenue
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-600">

            ₹
            {Number(
              totalRevenue._sum.total ?? 0
            ).toLocaleString()}

          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Total Jobs
          </p>

          <h2 className="mt-3 text-4xl font-bold">

            {totalJobs}

          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Customers
          </p>

          <h2 className="mt-3 text-4xl font-bold">

            {totalCustomers}

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

              <dt className="text-slate-500">
                Total Revenue
              </dt>

              <dd className="font-semibold text-green-600">
                ₹{Number(
                  totalRevenue._sum.total ?? 0
                ).toLocaleString()}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt className="text-slate-500">
                Paid Revenue
              </dt>

              <dd className="font-semibold text-blue-600">
                ₹{Number(
                  paidRevenue._sum.total ?? 0
                ).toLocaleString()}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt className="text-slate-500">
                Outstanding Revenue
              </dt>

              <dd className="font-semibold text-red-600">
                ₹{Number(
                  outstandingRevenue._sum.total ?? 0
                ).toLocaleString()}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt className="text-slate-500">
                Average Job Value
              </dt>

              <dd className="font-semibold">
                ₹{averageJobValue.toLocaleString(
                  undefined,
                  {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  },
                )}
              </dd>

            </div>

          </dl>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Invoice Summary
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">

              <dt>Draft</dt>

              <dd className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
                {draftInvoices}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Sent</dt>

              <dd className="rounded-full bg-blue-100 px-3 py-1 font-semibold text-blue-700">
                {sentInvoices}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Paid</dt>

              <dd className="rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700">
                {paidInvoices}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Overdue</dt>

              <dd className="rounded-full bg-red-100 px-3 py-1 font-semibold text-red-700">
                {overdueInvoices}
              </dd>

            </div>

            <div className="flex items-center justify-between border-t pt-5">

              <dt className="font-semibold">
                Total Invoices
              </dt>

              <dd className="text-xl font-bold">
                {totalInvoices}
              </dd>

            </div>

          </dl>

        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Job Summary
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">

              <dt>Completed</dt>

              <dd className="font-semibold text-green-600">
                {completedJobs}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>In Progress</dt>

              <dd className="font-semibold text-blue-600">
                {inProgressJobs}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Scheduled</dt>

              <dd className="font-semibold text-orange-600">
                {scheduledJobs}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Cancelled</dt>

              <dd className="font-semibold text-red-600">
                {cancelledJobs}
              </dd>

            </div>

          </dl>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Business Metrics
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">

              <dt>Total Customers</dt>

              <dd className="font-semibold">
                {totalCustomers}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Total Jobs</dt>

              <dd className="font-semibold">
                {totalJobs}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Total Invoices</dt>

              <dd className="font-semibold">
                {totalInvoices}
              </dd>

            </div>

          </dl>

        </div>

      </div>
            <div className="rounded-3xl border bg-white p-8">

        <h2 className="mb-6 text-2xl font-bold">
          Quick Reports
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          <Link
            href="/reports/revenue"
            className="rounded-2xl border p-6 transition hover:border-green-500 hover:bg-green-50"
          >

            <h3 className="text-xl font-semibold">
              Revenue Report
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Revenue trends, invoice totals, collections and outstanding balances.
            </p>

          </Link>

          <Link
            href="/reports/jobs"
            className="rounded-2xl border p-6 transition hover:border-blue-500 hover:bg-blue-50"
          >

            <h3 className="text-xl font-semibold">
              Job Report
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Analyze completed, scheduled, cancelled and active jobs.
            </p>

          </Link>

          <Link
            href="/reports/customers"
            className="rounded-2xl border p-6 transition hover:border-purple-500 hover:bg-purple-50"
          >

            <h3 className="text-xl font-semibold">
              Customer Report
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Customer growth, activity and service history.
            </p>

          </Link>

          <Link
            href="/reports/technicians"
            className="rounded-2xl border p-6 transition hover:border-orange-500 hover:bg-orange-50"
          >

            <h3 className="text-xl font-semibold">
              Technician Report
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Productivity, assignments and technician performance.
            </p>

          </Link>

          <Link
            href="/reports/invoices"
            className="rounded-2xl border p-6 transition hover:border-indigo-500 hover:bg-indigo-50"
          >

            <h3 className="text-xl font-semibold">
              Invoice Report
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Invoice status, payment collections and aging analysis.
            </p>

          </Link>

          <Link
            href="/reports/fleet"
            className="rounded-2xl border p-6 transition hover:border-red-500 hover:bg-red-50"
          >

            <h3 className="text-xl font-semibold">
              Fleet Report
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Vehicle utilization, maintenance and fleet performance.
            </p>

          </Link>

        </div>

      </div>

    </div>

  );

}