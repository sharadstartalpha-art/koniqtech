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
    invoiceId: string;
  }>;
}

export default async function InvoiceDetailsPage({
  params,
}: PageProps) {

  const { invoiceId } =
    await params;

  const session =
    await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId =
    session.user.orgId;

  const invoice =
    await prisma.invoice.findFirst({

      where: {

        id: invoiceId,

        orgId,

      },

      include: {

        customer: {

          select: {

            id: true,

            companyName: true,

            firstName: true,

            lastName: true,

            email: true,

            phone: true,

          },

        },

        job: {

          select: {

            id: true,

            title: true,

            status: true,

          },

        },

        payments: {

          orderBy: {

            createdAt: "desc",

          },

        },

      },

    });

  if (!invoice) {
    notFound();
  }

  const paidAmount =
    invoice.payments.reduce(

      (sum, payment) =>

        sum + Number(payment.amount),

      0,

    );

  const balance =
    Number(invoice.total) -
    paidAmount;

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">

            {invoice.invoiceNumber}

          </h1>

          <p className="mt-2 text-slate-600">

            Invoice Details

          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href="/billing"
            className="rounded-xl border border-slate-300 px-6 py-3 hover:bg-slate-50"
          >
            Back
          </Link>

          <Link
            href={`/billing/${invoice.id}/edit`}
            className="rounded-xl bg-orange-500 px-6 py-3 text-white hover:bg-orange-600"
          >
            Edit
          </Link>

          <Link
            href={`/billing/${invoice.id}/delete`}
            className="rounded-xl bg-red-600 px-6 py-3 text-white hover:bg-red-700"
          >
            Delete
          </Link>

        </div>

      </div>
            <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Total
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            ₹{Number(invoice.total).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Paid
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-600">
            ₹{paidAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Balance
          </p>

          <h2 className="mt-3 text-4xl font-bold text-red-600">
            ₹{balance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Status
          </p>

          <span
            className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-medium
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

        </div>

      </div>

      <div className="grid gap-8 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Customer
          </h2>

          <dl className="space-y-5">

            <div>

              <dt className="text-sm text-slate-500">
                Name
              </dt>

              <dd className="mt-1 font-medium">
                {invoice.customer.companyName ||
                  `${invoice.customer.firstName} ${invoice.customer.lastName ?? ""}`}
              </dd>

            </div>

            <div>

              <dt className="text-sm text-slate-500">
                Email
              </dt>

              <dd className="mt-1">
                {invoice.customer.email ?? "-"}
              </dd>

            </div>

            <div>

              <dt className="text-sm text-slate-500">
                Phone
              </dt>

              <dd className="mt-1">
                {invoice.customer.phone ?? "-"}
              </dd>

            </div>

          </dl>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Job
          </h2>

          <dl className="space-y-5">

            <div>

              <dt className="text-sm text-slate-500">
                Title
              </dt>

              <dd className="mt-1 font-medium">
                {invoice.job.title}
              </dd>

            </div>

            <div>

              <dt className="text-sm text-slate-500">
                Status
              </dt>

              <dd className="mt-1">
                {invoice.job.status}
              </dd>

            </div>

            <div>

              <dt className="text-sm text-slate-500">
                Due Date
              </dt>

              <dd className="mt-1">
                {invoice.dueDate
                  ? invoice.dueDate.toLocaleDateString()
                  : "-"}
              </dd>

            </div>

          </dl>

        </div>

      </div>

      <div className="rounded-3xl border bg-white p-8">

        <h2 className="mb-6 text-2xl font-bold">
          Payments
        </h2>
                {invoice.payments.length === 0 ? (

          <p className="text-slate-500">
            No payments have been recorded for this invoice.
          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="border-b bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left">
                    Method
                  </th>

                  <th className="px-6 py-4 text-left">
                    Reference
                  </th>

                </tr>

              </thead>

              <tbody>

                {invoice.payments.map((payment) => (

                  <tr
                    key={payment.id}
                    className="border-t"
                  >

                    <td className="px-6 py-4">

                      {payment.createdAt.toLocaleDateString()}

                    </td>

                    <td className="px-6 py-4 text-right font-semibold">

                      ₹{Number(payment.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}

                    </td>

                    <td className="px-6 py-4">

                      {payment.method}

                    </td>

                    <td className="px-6 py-4">

                      {payment.reference ?? "-"}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      <div className="rounded-3xl border bg-white p-8">

        <h2 className="mb-6 text-2xl font-bold">
          Invoice Summary
        </h2>

        <dl className="grid gap-6 md:grid-cols-2">

          <div>

            <dt className="text-sm text-slate-500">
              Subtotal
            </dt>

            <dd className="mt-1 text-lg font-semibold">
              ₹{Number(invoice.subtotal).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Tax
            </dt>

            <dd className="mt-1 text-lg font-semibold">
              ₹{Number(invoice.tax).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Sent At
            </dt>

            <dd className="mt-1">
              {invoice.sentAt
                ? invoice.sentAt.toLocaleString()
                : "-"}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Paid At
            </dt>

            <dd className="mt-1">
              {invoice.paidAt
                ? invoice.paidAt.toLocaleString()
                : "-"}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Created
            </dt>

            <dd className="mt-1">
              {invoice.createdAt.toLocaleString()}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Last Updated
            </dt>

            <dd className="mt-1">
              {invoice.updatedAt.toLocaleString()}
            </dd>

          </div>

        </dl>

      </div>

    </div>

  );

}