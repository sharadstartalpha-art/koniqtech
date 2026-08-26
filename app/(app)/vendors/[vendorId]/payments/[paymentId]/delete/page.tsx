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

export default async function DeleteVendorPaymentPage({
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

  const currentVendorId =
    payment.vendor.id;

  const currentPaymentId =
    payment.id;

  async function deletePayment() {
    "use server";

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
          id: currentPaymentId,
          vendorId: currentVendorId,
          orgId,
        },

      });

    if (!payment) {
      notFound();
    }

    await prisma.vendorPayment.delete({

      where: {
        id: currentPaymentId,
      },

    });

    redirect(
      `/vendors/${currentVendorId}/payments`
    );

  }

  return (

    <div className="mx-auto max-w-3xl space-y-8">

      <div>

        <Link
          href={`/vendors/${currentVendorId}/payments/${currentPaymentId}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Payment
        </Link>

        <h1 className="mt-3 text-4xl font-bold text-red-600">
          Delete Vendor Payment
        </h1>

        <p className="mt-2 text-slate-600">
          This action cannot be undone.
        </p>

      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

        <h2 className="text-2xl font-semibold">
          Payment Details
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
                      <div>

            <div className="text-sm text-slate-500">
              Vendor
            </div>

            <div className="mt-1 font-semibold">
              {payment.vendor.companyName}
            </div>

          </div>

          <div>

            <div className="text-sm text-slate-500">
              Amount
            </div>

            <div className="mt-1 text-2xl font-bold text-red-600">

              $
              {payment.amount.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}

            </div>

          </div>

          <div>

            <div className="text-sm text-slate-500">
              Payment Method
            </div>

            <div className="mt-1 font-semibold">
              {payment.paymentMethod}
            </div>

          </div>

          <div>

            <div className="text-sm text-slate-500">
              Payment Date
            </div>

            <div className="mt-1">
              {payment.paymentDate.toLocaleDateString()}
            </div>

          </div>

          <div>

            <div className="text-sm text-slate-500">
              Reference Number
            </div>

            <div className="mt-1">
              {payment.referenceNo ?? "-"}
            </div>

          </div>

          <div>

            <div className="text-sm text-slate-500">
              Currency
            </div>

            <div className="mt-1">
              {payment.vendor.currency ?? "USD"}
            </div>

          </div>

          <div className="md:col-span-2">

            <div className="text-sm text-slate-500">
              Notes
            </div>

            <div className="mt-1 whitespace-pre-wrap">
              {payment.notes ?? "-"}
            </div>

          </div>

        </div>

      </div>

      <div className="rounded-3xl border border-yellow-300 bg-yellow-50 p-6">

        <h3 className="text-lg font-semibold text-yellow-800">
          Warning
        </h3>

        <p className="mt-3 text-yellow-700">

          Deleting this payment will permanently remove
          it from the vendor payment history.

        </p>

        <p className="mt-3 text-yellow-700">

          This action may affect vendor balances,
          purchase order reconciliation and financial
          reports.

        </p>

      </div>
            <form
        action={deletePayment}
        className="space-y-6"
      >

        <div className="flex justify-end gap-4">

          <Link
            href={`/vendors/${currentVendorId}/payments/${currentPaymentId}`}
            className="rounded-xl border px-6 py-3 hover:bg-slate-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
          >
            Delete Payment
          </button>

        </div>

      </form>

    </div>

  );

}