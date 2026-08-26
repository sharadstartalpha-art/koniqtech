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
  }>;
}

export default async function DeleteVendorPage({
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

        _count: {

          select: {

            contacts: true,

            purchaseOrders: true,

            payments: true,

          },

        },

      },

    });

  if (!vendor) {
    notFound();
  }

  const currentVendorId =
    vendor.id;

  async function deleteVendor() {
    "use server";

    const session =
      await auth();

    if (!session?.user) {
      redirect("/login");
    }

    const orgId =
      (session.user as any).orgId;

    await prisma.vendor.delete({

      where: {
        id: currentVendorId,
        orgId,
      },

    });

    redirect("/vendors");

  }

  return (

    <div className="mx-auto max-w-3xl space-y-8">

      <div>

        <Link
          href={`/vendors/${currentVendorId}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Vendor
        </Link>

        <h1 className="mt-3 text-4xl font-bold text-red-600">
          Delete Vendor
        </h1>

        <p className="mt-2 text-slate-600">
          This action cannot be undone.
        </p>

      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

        <h2 className="text-2xl font-semibold">
          {vendor.companyName}
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
                      <div>

            <div className="text-sm text-slate-500">
              Vendor Code
            </div>

            <div className="mt-1 font-semibold">
              {vendor.vendorCode}
            </div>

          </div>

          <div>

            <div className="text-sm text-slate-500">
              Contact Person
            </div>

            <div className="mt-1 font-semibold">
              {vendor.contactPerson ?? "-"}
            </div>

          </div>

          <div>

            <div className="text-sm text-slate-500">
              Email
            </div>

            <div className="mt-1 font-semibold">
              {vendor.email ?? "-"}
            </div>

          </div>

          <div>

            <div className="text-sm text-slate-500">
              Phone
            </div>

            <div className="mt-1 font-semibold">
              {vendor.phone ?? "-"}
            </div>

          </div>

          <div>

            <div className="text-sm text-slate-500">
              Purchase Orders
            </div>

            <div className="mt-1 text-2xl font-bold">
              {vendor._count.purchaseOrders}
            </div>

          </div>

          <div>

            <div className="text-sm text-slate-500">
              Contacts
            </div>

            <div className="mt-1 text-2xl font-bold">
              {vendor._count.contacts}
            </div>

          </div>

          <div>

            <div className="text-sm text-slate-500">
              Payments
            </div>

            <div className="mt-1 text-2xl font-bold">
              {vendor._count.payments}
            </div>

          </div>

          <div>

            <div className="text-sm text-slate-500">
              Status
            </div>

            <div
              className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                vendor.active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {vendor.active
                ? "Active"
                : "Inactive"}
            </div>

          </div>

        </div>

      </div>

      {vendor._count.purchaseOrders > 0 && (

        <div className="rounded-3xl border border-yellow-300 bg-yellow-50 p-6">

          <h3 className="text-lg font-semibold text-yellow-800">
            Cannot Delete Vendor
          </h3>

          <p className="mt-3 text-yellow-700">

            This vendor has
            {" "}
            <strong>
              {vendor._count.purchaseOrders}
            </strong>
            {" "}
            purchase order(s).

          </p>

          <p className="mt-2 text-sm text-yellow-700">

            Delete or reassign all purchase orders
            before deleting this vendor.

          </p>

        </div>

      )}
            <form
        action={deleteVendor}
        className="flex justify-end gap-4"
      >

        <Link
          href={`/vendors/${currentVendorId}`}
          className="rounded-xl border px-6 py-3 hover:bg-slate-100"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={
            vendor._count.purchaseOrders > 0
          }
          className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Delete Vendor
        </button>

      </form>

    </div>

  );

}