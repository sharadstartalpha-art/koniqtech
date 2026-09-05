import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import {
  redirect,
} from "next/navigation";

import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Building2,
  Phone,
  Mail,
  Star,
} from "lucide-react";

import {
  canView,
  canCreate,
  canEdit,
  canDelete,
} from "@/shared/lib/permissions";

export const dynamic = "force-dynamic";

export default async function VendorsPage() {
 
  const session = await auth();

if (!session?.user) {
  redirect("/login");
}

const dbUser = await prisma.user.findUnique({
  where: {
    email: session.user.email!,
  },
  include: {
    organizationRole: {
      include: {
        permissions: true,
      },
    },
  },
});

if (!dbUser) {
  redirect("/login");
}

const permissions =
  dbUser.organizationRole?.permissions ?? [];

const isOwner =
  dbUser.organizationRole?.name === "Owner";

if (!canView(permissions, "Vendors", isOwner)) {
  redirect("/unauthorized");
}

const orgId = dbUser.orgId;

if (!orgId) {
  redirect("/welcome");
}

  const vendors = await prisma.vendor.findMany({
    where: {
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

    orderBy: {
      companyName: "asc",
    },
  });

  const totalVendors = vendors.length;

  const activeVendors = vendors.filter(
    (vendor) => vendor.active,
  ).length;

  const inactiveVendors =
    totalVendors - activeVendors;

  const avgRating =
    vendors.length > 0
      ? (
          vendors.reduce(
            (sum, vendor) =>
              sum + (vendor.rating ?? 0),
            0,
          ) / vendors.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Vendors
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage suppliers, purchase history,
            contacts and payments.
          </p>
        </div>

       {canCreate(permissions, "Vendors", isOwner) && (
  <Link
    href="/vendors/create"
    className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
  >
    <Plus className="mr-2 h-5 w-5" />
    New Vendor
  </Link>
)}

      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-muted-foreground">
            Total Vendors
          </p>

          <p className="mt-3 text-4xl font-bold">
            {totalVendors}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-muted-foreground">
            Active
          </p>

          <p className="mt-3 text-4xl font-bold text-green-600">
            {activeVendors}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-muted-foreground">
            Inactive
          </p>

          <p className="mt-3 text-4xl font-bold text-red-600">
            {inactiveVendors}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-muted-foreground">
            Average Rating
          </p>

          <p className="mt-3 text-4xl font-bold">
            {avgRating}
          </p>
        </div>

      </div>

      <div className="overflow-hidden rounded-xl border bg-white">

        <table className="w-full">

          <thead className="border-b bg-gray-50">

            <tr className="text-left">

              <th className="px-6 py-4">
                Vendor
              </th>

              <th className="px-6 py-4">
                Contact
              </th>

              <th className="px-6 py-4">
                Rating
              </th>

              <th className="px-6 py-4">
                Purchase Orders
              </th>

              <th className="px-6 py-4">
                Contacts
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {vendors.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-20 text-center text-muted-foreground"
                >
                  No vendors found.
                </td>
              </tr>
            )}

            {vendors.map((vendor) => (
              <tr
                key={vendor.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-6 py-5">

                  <div className="flex items-start gap-3">

                    <div className="rounded-lg bg-blue-100 p-2">
                      <Building2 className="h-5 w-5 text-blue-700" />
                    </div>

                    <div>

                      <p className="font-semibold">
                        {vendor.companyName}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {vendor.vendorCode}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="px-6 py-5">

                  <div className="space-y-1 text-sm">

                    {vendor.contactPerson && (
                      <p>{vendor.contactPerson}</p>
                    )}

                    {vendor.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {vendor.phone}
                      </div>
                    )}

                    {vendor.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {vendor.email}
                      </div>
                    )}

                  </div>

                </td>

                <td className="px-6 py-5">

                  <div className="flex items-center gap-2">

                    <Star className="h-4 w-4 text-yellow-500" />

                    {vendor.rating ?? "-"}

                  </div>

                </td>

                <td className="px-6 py-5">
                  {vendor._count.purchaseOrders}
                </td>

                <td className="px-6 py-5">
                  {vendor._count.contacts}
                </td>

                <td className="px-6 py-5">

                  {vendor.active ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                      Inactive
                    </span>
                  )}

                </td>

                <td className="px-6 py-5">

                  <div className="flex justify-end gap-2">

                    <Link
                      href={`/vendors/${vendor.id}`}
                      className="rounded-lg border p-2 hover:bg-gray-100"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    {canEdit(permissions, "Vendors", isOwner) && (
  <Link
    href={`/vendors/${vendor.id}/edit`}
    className="rounded-lg border p-2 hover:bg-gray-100"
  >
    <Pencil className="h-4 w-4" />
  </Link>
)}

                    {canDelete(permissions, "Vendors", isOwner) && (
  <Link
    href={`/vendors/${vendor.id}/delete`}
    className="rounded-lg border border-red-300 p-2 text-red-600 hover:bg-red-50"
  >
    <Trash2 className="h-4 w-4" />
  </Link>
)}

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">

          <thead className="bg-gray-50">

            <tr>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Vendor
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Contact
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Phone
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Email
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Rating
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Purchase Orders
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Payments
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </th>

              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">

            {vendors.length === 0 && (

              <tr>

                <td
                  colSpan={9}
                  className="py-16 text-center text-gray-500"
                >
                  No vendors found.
                </td>

              </tr>

            )}

            {vendors.map((vendor) => (

              <tr
                key={vendor.id}
                className="hover:bg-gray-50"
              >

                <td className="px-6 py-4">

                  <div className="font-medium text-gray-900">
                    {vendor.companyName}
                  </div>

                  <div className="text-xs text-gray-500">
                    {vendor.vendorCode}
                  </div>

                </td>

                <td className="px-6 py-4 text-sm">
                  {vendor.contactPerson || "-"}
                </td>

                <td className="px-6 py-4 text-sm">
                  {vendor.phone || "-"}
                </td>

                <td className="px-6 py-4 text-sm">
                  {vendor.email || "-"}
                </td>

                <td className="px-6 py-4">

                  {vendor.rating ? (
                    <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                      ⭐ {vendor.rating}/5
                    </span>
                  ) : (
                    "-"
                  )}

                </td>

                <td className="px-6 py-4 text-sm">
                  {vendor._count.purchaseOrders}
                </td>

                <td className="px-6 py-4 text-sm">
                  {vendor._count.payments}
                </td>

                <td className="px-6 py-4">

                  {vendor.active ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      Inactive
                    </span>
                  )}

                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-end gap-2">

                    <Link
                      href={`/vendors/${vendor.id}`}
                      className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
                    >
                      View
                    </Link>

                    {canEdit(permissions, "Vendors", isOwner) && (
  <Link
    href={`/vendors/${vendor.id}/edit`}
    className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
  >
    Edit
  </Link>
)}

                   {canDelete(permissions, "Vendors", isOwner) && (
  <Link
    href={`/vendors/${vendor.id}/delete`}
    className="rounded border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
  >
    Delete
  </Link>
)}

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Vendors
          </p>
          <p className="mt-2 text-3xl font-bold">
            {vendors.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Active Vendors
          </p>
          <p className="mt-2 text-3xl font-bold">
            {vendors.filter(v => v.active).length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Purchase Orders
          </p>
          <p className="mt-2 text-3xl font-bold">
            {vendors.reduce(
              (sum, v) => sum + v._count.purchaseOrders,
              0
            )}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Vendor Payments
          </p>
          <p className="mt-2 text-3xl font-bold">
            {vendors.reduce(
              (sum, v) => sum + v._count.payments,
              0
            )}
          </p>
        </div>

      </div>

    </div>

  );

}

