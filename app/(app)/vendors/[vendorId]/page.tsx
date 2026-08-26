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

function ratingStars(
  rating: number | null,
) {

  if (!rating) {
    return "Not Rated";
  }

  return "⭐".repeat(rating);

}

export default async function VendorPage({
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

        contacts: {

          orderBy: {
            primary: "desc",
          },

        },

        purchaseOrders: {

          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            orderedAt: true,
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 10,

        },

        payments: {

          orderBy: {
            paymentDate: "desc",
          },

          take: 10,

        },

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

  const totalPaid =
    vendor.payments.reduce(
      (sum, payment) =>
        sum + payment.amount,
      0
    );

  const totalPOValue =
    vendor.purchaseOrders.reduce(
      (sum, po) =>
        sum + po.total,
      0
    );

  return (

    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex items-start justify-between">

        <div>

          <Link
            href="/vendors"
            className="text-blue-600 hover:underline"
          >
            ← Back to Vendors
          </Link>

          <h1 className="mt-3 text-4xl font-bold">

            {vendor.companyName}

          </h1>

          <p className="mt-2 text-slate-600">

            Vendor Code:
            <strong>
              {" "}
              {vendor.vendorCode}
            </strong>

          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/vendors/${vendor.id}/edit`}
            className="rounded-xl border px-5 py-3 hover:bg-slate-100"
          >
            Edit
          </Link>

          <Link
            href={`/vendors/${vendor.id}/delete`}
            className="rounded-xl border border-red-300 px-5 py-3 text-red-600 hover:bg-red-50"
          >
            Delete
          </Link>

        </div>

      </div>

      <div className="grid gap-8 lg:grid-cols-3">

        <div className="space-y-8 lg:col-span-2">

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-2xl font-semibold">
              Vendor Information
            </h2>

            <dl className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <dt className="text-sm text-slate-500">
                  Company
                </dt>

                <dd className="mt-1 font-semibold">
                  {vendor.companyName}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Contact Person
                </dt>

                <dd className="mt-1">
                  {vendor.contactPerson || "—"}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Email
                </dt>

                <dd className="mt-1 break-all">
                  {vendor.email || "—"}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Phone
                </dt>

                <dd className="mt-1">
                  {vendor.phone || "—"}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Alternate Phone
                </dt>

                <dd className="mt-1">
                  {vendor.alternatePhone || "—"}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Website
                </dt>

                <dd className="mt-1 break-all">
                  {vendor.website || "—"}
                </dd>

              </div>
                            <div>

                <dt className="text-sm text-slate-500">
                  Tax Number
                </dt>

                <dd className="mt-1">
                  {vendor.taxNumber || "—"}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Payment Terms
                </dt>

                <dd className="mt-1">
                  {vendor.paymentTerms || "—"}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Currency
                </dt>

                <dd className="mt-1">
                  {vendor.currency || "USD"}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Rating
                </dt>

                <dd className="mt-1">
                  {ratingStars(vendor.rating)}
                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Status
                </dt>

                <dd className="mt-1">

                  {vendor.active ? (

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      Active
                    </span>

                  ) : (

                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                      Inactive
                    </span>

                  )}

                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Created
                </dt>

                <dd className="mt-1">
                  {vendor.createdAt.toLocaleDateString()}
                </dd>

              </div>

            </dl>

          </div>

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-2xl font-semibold">
              Notes
            </h2>

            <div className="mt-6 whitespace-pre-wrap leading-7 text-slate-700">

              {vendor.notes ||
                "No notes available."}

            </div>

          </div>

          <div className="rounded-3xl border bg-white p-8">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-semibold">
                Contacts
              </h2>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">

                {vendor._count.contacts} Contact
                {vendor._count.contacts === 1
                  ? ""
                  : "s"}

              </span>

            </div>

            {vendor.contacts.length === 0 ? (

              <div className="py-10 text-center text-slate-500">

                No contacts added.

              </div>

            ) : (

              <div className="mt-6 overflow-x-auto">

                <table className="min-w-full">

                  <thead className="border-b bg-slate-50">

                    <tr>

                      <th className="px-4 py-3 text-left">
                        Name
                      </th>

                      <th className="px-4 py-3 text-left">
                        Designation
                      </th>

                      <th className="px-4 py-3 text-left">
                        Email
                      </th>

                      <th className="px-4 py-3 text-left">
                        Phone
                      </th>

                      <th className="px-4 py-3 text-center">
                        Primary
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {vendor.contacts.map(
                      (contact) => (

                        <tr
                          key={contact.id}
                          className="border-b"
                        >

                          <td className="px-4 py-4 font-medium">
                            {contact.name}
                          </td>

                          <td className="px-4 py-4">
                            {contact.designation || "—"}
                          </td>

                          <td className="px-4 py-4">
                            {contact.email || "—"}
                          </td>

                          <td className="px-4 py-4">
                            {contact.phone ??
                              contact.mobile ??
                              "—"}
                          </td>

                          <td className="px-4 py-4 text-center">

                            {contact.primary
                              ? "✅"
                              : "—"}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>
                  </div>

        <div className="space-y-8">

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Summary
            </h2>

            <div className="mt-8 space-y-5">

              <div className="flex justify-between">

                <span>Total Contacts</span>

                <strong>
                  {vendor._count.contacts}
                </strong>

              </div>

              <div className="flex justify-between">

                <span>Purchase Orders</span>

                <strong>
                  {vendor._count.purchaseOrders}
                </strong>

              </div>

              <div className="flex justify-between">

                <span>Payments</span>

                <strong>
                  {vendor._count.payments}
                </strong>

              </div>

              <hr />

              <div className="flex justify-between font-semibold">

                <span>Total PO Value</span>

                <span>
                  $
                  {totalPOValue.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </span>

              </div>

              <div className="flex justify-between font-semibold">

                <span>Total Paid</span>

                <span>
                  $
                  {totalPaid.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </span>

              </div>

            </div>

          </div>

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Recent Purchase Orders
            </h2>

            {vendor.purchaseOrders.length === 0 ? (

              <div className="py-8 text-center text-slate-500">

                No purchase orders found.

              </div>

            ) : (

              <div className="mt-6 space-y-4">

                {vendor.purchaseOrders.map(
                  (po) => (

                    <Link
                      key={po.id}
                      href={`/purchase-orders/${po.id}`}
                      className="block rounded-xl border p-4 hover:bg-slate-50"
                    >

                      <div className="flex items-center justify-between">

                        <div>

                          <div className="font-semibold">

                            {po.orderNumber}

                          </div>

                          <div className="mt-1 text-sm text-slate-500">

                            {po.status}

                          </div>

                        </div>

                        <div className="text-right">

                          <div className="font-semibold">

                            $
                            {po.total.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}

                          </div>

                          <div className="text-xs text-slate-500">

                            {po.orderedAt
                              ? po.orderedAt.toLocaleDateString()
                              : "Draft"}

                          </div>

                        </div>

                      </div>

                    </Link>

                  )
                )}

              </div>

            )}

          </div>

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Recent Payments
            </h2>

            {vendor.payments.length === 0 ? (

              <div className="py-8 text-center text-slate-500">

                No payments recorded.

              </div>

            ) : (

              <div className="mt-6 space-y-4">

                {vendor.payments.map(
                  (payment) => (

                    <div
                      key={payment.id}
                      className="rounded-xl border p-4"
                    >

                      <div className="flex justify-between">

                        <strong>

                          $
                          {payment.amount.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}

                        </strong>

                        <span className="text-sm text-slate-500">

                          {payment.paymentDate.toLocaleDateString()}

                        </span>

                      </div>

                      <div className="mt-2 text-sm text-slate-600">

                        {payment.paymentMethod}

                      </div>

                      {payment.referenceNo && (

                        <div className="mt-1 text-xs text-slate-500">

                          Ref: {payment.referenceNo}

                        </div>

                      )}

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}