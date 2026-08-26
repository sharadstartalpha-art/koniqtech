import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    vendorId: string;
  }>;
}

export default async function VendorPaymentsPage({
  params,
}: PageProps) {

  const {
    vendorId,
  } = await params;

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

  const vendor =
    await prisma.vendor.findFirst({

      where: {
        id: vendorId,
        orgId,
      },

      include: {

        payments: {

          orderBy: {
            paymentDate: "desc",
          },

        },

        _count: {

          select: {
            payments: true,
          },

        },

      },

    });

  if (!vendor) {
    redirect("/vendors");
  }

  const totalPaid =
    vendor.payments.reduce(

      (sum, payment) =>
        sum + payment.amount,

      0,

    );

  return (

    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex items-start justify-between">

        <div>

          <Link
            href={`/vendors/${vendor.id}`}
            className="text-blue-600 hover:underline"
          >
            ← Back to Vendor
          </Link>

          <h1 className="mt-3 text-4xl font-bold">

            Vendor Payments

          </h1>

          <p className="mt-2 text-slate-600">

            {vendor.companyName}

          </p>

        </div>

        <Link
          href={`/vendors/${vendor.id}/payments/create`}
          className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          + Record Payment
        </Link>

      </div>

      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-3xl border bg-white p-6">

          <div className="text-sm text-slate-500">
            Total Payments
          </div>

          <div className="mt-3 text-3xl font-bold">

            {vendor._count.payments}

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <div className="text-sm text-slate-500">
            Total Paid
          </div>

          <div className="mt-3 text-3xl font-bold text-green-600">

            $
            {totalPaid.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <div className="text-sm text-slate-500">
            Latest Payment
          </div>

          <div className="mt-3 text-lg font-semibold">

            {vendor.payments.length
              ? vendor.payments[0].paymentDate.toLocaleDateString()
              : "No Payments"}

          </div>

        </div>

      </div>

      <div className="rounded-3xl border bg-white overflow-hidden">

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-2xl font-semibold">
            Payment History
          </h2>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">

            {vendor.payments.length}
            {" "}
            Payment
            {vendor.payments.length === 1
              ? ""
              : "s"}

          </span>

        </div>
                {vendor.payments.length === 0 ? (

          <div className="p-16 text-center">

            <h3 className="text-xl font-semibold">
              No Payments Found
            </h3>

            <p className="mt-3 text-slate-500">

              No vendor payments have been
              recorded yet.

            </p>

            <Link
              href={`/vendors/${vendor.id}/payments/create`}
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Record First Payment
            </Link>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-50">

                <tr className="border-b">

                  <th className="px-6 py-4 text-left">
                    Payment Date
                  </th>

                  <th className="px-6 py-4 text-left">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left">
                    Method
                  </th>

                  <th className="px-6 py-4 text-left">
                    Reference
                  </th>

                  <th className="px-6 py-4 text-left">
                    Notes
                  </th>

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {vendor.payments.map(
                  (payment) => (

                    <tr
                      key={payment.id}
                      className="border-b hover:bg-slate-50"
                    >

                      <td className="px-6 py-5">

                        {payment.paymentDate.toLocaleDateString()}

                      </td>

                      <td className="px-6 py-5 font-semibold text-green-700">

                        $
                        {payment.amount.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}

                      </td>

                      <td className="px-6 py-5">

                        {payment.paymentMethod}

                      </td>

                      <td className="px-6 py-5">

                        {payment.referenceNo ??
                          "-"}

                      </td>

                      <td className="px-6 py-5 max-w-sm truncate">

                        {payment.notes ??
                          "-"}

                      </td>

                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          <Link
                            href={`/vendors/${vendor.id}/payments/${payment.id}`}
                            className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-100"
                          >
                            View
                          </Link>

                          <Link
                            href={`/vendors/${vendor.id}/payments/${payment.id}/edit`}
                            className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-100"
                          >
                            Edit
                          </Link>

                          <Link
                            href={`/vendors/${vendor.id}/payments/${payment.id}/delete`}
                            className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </Link>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

        <h2 className="text-xl font-semibold text-blue-900">
          Payment Summary
        </h2>

        <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

          <p>

            Vendor:
            <strong>
              {" "}
              {vendor.companyName}
            </strong>

          </p>

          <p>

            Total Payments Recorded:
            <strong>
              {" "}
              {vendor._count.payments}
            </strong>

          </p>

          <p>

            Total Amount Paid:
            <strong>

              {" "}
              $
              {totalPaid.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}

            </strong>

          </p>

          <p>

            Payment Currency:
            <strong>

              {" "}
              {vendor.currency ?? "USD"}

            </strong>

          </p>

          <p>

            Payments recorded here represent
            amounts paid to this vendor and are
            available for financial reporting and
            purchase order reconciliation.

          </p>

        </div>

      </div>

    </div>

  );

}