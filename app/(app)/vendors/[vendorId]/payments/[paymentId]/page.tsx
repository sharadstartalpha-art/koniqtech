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
    vendorId: string;
    paymentId: string;
  }>;
}

function badgeColor(
  method: string,
) {

  switch (
    method.toLowerCase()
  ) {

    case "paypal":
      return "bg-blue-100 text-blue-700";

    case "bank transfer":
      return "bg-green-100 text-green-700";

    case "ach":
      return "bg-emerald-100 text-emerald-700";

    case "check":
      return "bg-yellow-100 text-yellow-700";

    case "credit card":
      return "bg-purple-100 text-purple-700";

    case "cash":
      return "bg-slate-100 text-slate-700";

    default:
      return "bg-slate-100 text-slate-700";

  }

}

export default async function VendorPaymentPage({
  params,
}: PageProps) {

  const {
    vendorId,
    paymentId,
  } = await params;

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

  const payment =
    await prisma.vendorPayment.findFirst({

      where: {
        id: paymentId,
        vendorId,
        orgId,
      },

      include: {

        vendor: {

          select: {
            id: true,
            companyName: true,
            currency: true,
          },

        },

      },

    });

  if (!payment) {
    notFound();
  }

  return (

    <div className="mx-auto max-w-6xl space-y-8">

      <div className="flex items-start justify-between">

        <div>

          <Link
            href={`/vendors/${payment.vendor.id}/payments`}
            className="text-blue-600 hover:underline"
          >
            ← Back to Payments
          </Link>

          <h1 className="mt-3 text-4xl font-bold">
            Vendor Payment
          </h1>

          <p className="mt-2 text-slate-600">

            {payment.vendor.companyName}

          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/vendors/${payment.vendor.id}/payments/${payment.id}/edit`}
            className="rounded-xl border px-5 py-3 hover:bg-slate-100"
          >
            Edit
          </Link>

          <Link
            href={`/vendors/${payment.vendor.id}/payments/${payment.id}/delete`}
            className="rounded-xl border border-red-300 px-5 py-3 text-red-600 hover:bg-red-50"
          >
            Delete
          </Link>

        </div>

      </div>

      <div className="grid gap-8 lg:grid-cols-3">

        <div className="space-y-8 lg:col-span-2">

          <div className="rounded-3xl border bg-white p-8">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-semibold">
                Payment Details
              </h2>

              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${badgeColor(
                  payment.paymentMethod
                )}`}
              >
                {payment.paymentMethod}
              </span>

            </div>

            <dl className="mt-8 grid gap-6 md:grid-cols-2">
                              <div>

                <dt className="text-sm text-slate-500">
                  Amount Paid
                </dt>

                <dd className="mt-1 text-2xl font-bold text-green-600">

                  $
                  {payment.amount.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}

                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Payment Method
                </dt>

                <dd className="mt-1">
                  {payment.paymentMethod}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Payment Date
                </dt>

                <dd className="mt-1">
                  {payment.paymentDate.toLocaleDateString()}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Reference Number
                </dt>

                <dd className="mt-1">

                  {payment.referenceNo ??
                    "—"}

                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Created
                </dt>

                <dd className="mt-1">
                  {payment.createdAt.toLocaleDateString()}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Currency
                </dt>

                <dd className="mt-1">

                  {payment.vendor.currency ??
                    "USD"}

                </dd>

              </div>

            </dl>

          </div>

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-2xl font-semibold">
              Notes
            </h2>

            <div className="mt-6 whitespace-pre-wrap leading-7 text-slate-700">

              {payment.notes ||
                "No notes available."}

            </div>

          </div>

        </div>

        <div className="space-y-8">

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Vendor Information
            </h2>

            <dl className="mt-6 space-y-5">

              <div>

                <dt className="text-sm text-slate-500">
                  Vendor
                </dt>

                <dd className="mt-1 font-semibold">
                  {payment.vendor.companyName}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Currency
                </dt>

                <dd className="mt-1">
                  {payment.vendor.currency ??
                    "USD"}
                </dd>

              </div>

            </dl>

          </div>
                    <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

            <h2 className="text-xl font-semibold text-blue-900">
              Payment Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

              <p>

                This payment was made to
                <strong>
                  {" "}
                  {payment.vendor.companyName}
                </strong>.

              </p>

              <p>

                Amount Paid:
                <strong>

                  {" "}
                  $
                  {payment.amount.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}

                </strong>

              </p>

              <p>

                Payment Method:
                <strong>
                  {" "}
                  {payment.paymentMethod}
                </strong>

              </p>

              <p>

                Payment Date:
                <strong>
                  {" "}
                  {payment.paymentDate.toLocaleDateString()}
                </strong>

              </p>

              <p>

                Reference Number:
                <strong>
                  {" "}
                  {payment.referenceNo ?? "N/A"}
                </strong>

              </p>

              <p>

                Currency:
                <strong>
                  {" "}
                  {payment.vendor.currency ?? "USD"}
                </strong>

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}