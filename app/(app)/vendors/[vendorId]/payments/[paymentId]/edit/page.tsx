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

export default async function EditVendorPaymentPage({
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

  async function updatePayment(
    formData: FormData,
  ) {
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

    const amount =
      Number(
        formData.get("amount")
      );

    const paymentMethod =
      formData
        .get("paymentMethod")
        ?.toString()
        .trim() ?? "";

    const paymentDate =
      formData
        .get("paymentDate")
        ?.toString() ?? "";

    const referenceNo =
      formData
        .get("referenceNo")
        ?.toString()
        .trim() || null;

    const notes =
      formData
        .get("notes")
        ?.toString()
        .trim() || null;

    if (
      !amount ||
      amount <= 0
    ) {

      throw new Error(
        "Amount must be greater than zero."
      );

    }

    if (!paymentMethod) {

      throw new Error(
        "Payment method is required."
      );

    }

    if (!paymentDate) {

      throw new Error(
        "Payment date is required."
      );

    }

    await prisma.vendorPayment.update({

      where: {
        id: currentPaymentId,
      },

      data: {

        amount,

        paymentMethod,

        paymentDate: new Date(
          paymentDate
        ),

        referenceNo,

        notes,

      },

    });

    redirect(
      `/vendors/${currentVendorId}/payments/${currentPaymentId}`
    );

  }

  return (

    <div className="mx-auto max-w-4xl space-y-8">

      <div>

        <Link
          href={`/vendors/${currentVendorId}/payments/${currentPaymentId}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Payment
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Edit Vendor Payment
        </h1>

        <p className="mt-2 text-slate-600">

          Update payment for
          {" "}
          <strong>
            {payment.vendor.companyName}
          </strong>

        </p>

      </div>

      <form
        action={updatePayment}
        className="space-y-8"
      >

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Payment Details
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div>

              <label className="block text-sm font-medium">
                Amount *
              </label>

              <input
                type="number"
                name="amount"
                step="0.01"
                min="0"
                required
                defaultValue={payment.amount}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Payment Date *
              </label>

              <input
                type="date"
                name="paymentDate"
                required
                defaultValue={
                  payment.paymentDate
                    .toISOString()
                    .split("T")[0]
                }
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>
                        <div>

              <label className="block text-sm font-medium">
                Payment Method *
              </label>

              <select
                name="paymentMethod"
                required
                defaultValue={payment.paymentMethod}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >

                <option value="PayPal">
                  PayPal
                </option>

                <option value="Bank Transfer">
                  Bank Transfer
                </option>

                <option value="ACH">
                  ACH
                </option>

                <option value="Check">
                  Check
                </option>

                <option value="Credit Card">
                  Credit Card
                </option>

                <option value="Cash">
                  Cash
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            <div>

              <label className="block text-sm font-medium">
                Reference Number
              </label>

              <input
                name="referenceNo"
                defaultValue={
                  payment.referenceNo ?? ""
                }
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div className="md:col-span-2">

              <label className="block text-sm font-medium">
                Notes
              </label>

              <textarea
                name="notes"
                rows={5}
                defaultValue={
                  payment.notes ?? ""
                }
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

          </div>

        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

          <h2 className="text-xl font-semibold text-blue-900">
            Payment Information
          </h2>

          <div className="mt-6 space-y-3 text-sm leading-7 text-blue-800">

            <p>

              Vendor:
              <strong>
                {" "}
                {payment.vendor.companyName}
              </strong>

            </p>

            <p>

              Currency:
              <strong>
                {" "}
                {payment.vendor.currency ?? "USD"}
              </strong>

            </p>

            <p>

              Update payment details as required.
              These changes will immediately be
              reflected in vendor payment history
              and financial reports.

            </p>

          </div>

        </div>
                <div className="flex justify-end gap-4">

          <Link
            href={`/vendors/${currentVendorId}/payments/${currentPaymentId}`}
            className="rounded-xl border px-6 py-3 hover:bg-slate-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Save Changes
          </button>

        </div>

      </form>

    </div>

  );

}