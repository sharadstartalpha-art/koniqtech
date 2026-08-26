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

export default async function VendorContactsPage({
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

          orderBy: [
            {
              primary: "desc",
            },
            {
              createdAt: "asc",
            },
          ],

        },

      },

    });

  if (!vendor) {
    notFound();
  }

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
            Vendor Contacts
          </h1>

          <p className="mt-2 text-slate-600">

            Manage contacts for
            {" "}
            <strong>
              {vendor.companyName}
            </strong>

          </p>

        </div>

        <Link
          href={`/vendors/${vendor.id}/contacts/create`}
          className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          New Contact
        </Link>

      </div>

      <div className="rounded-3xl border bg-white overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr className="text-left">

              <th className="px-6 py-4">
                Name
              </th>

              <th className="px-6 py-4">
                Designation
              </th>

              <th className="px-6 py-4">
                Email
              </th>

              <th className="px-6 py-4">
                Phone
              </th>

              <th className="px-6 py-4">
                Primary
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>
                        {vendor.contacts.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="py-16 text-center text-slate-500"
                >

                  No vendor contacts found.

                </td>

              </tr>

            ) : (

              vendor.contacts.map(
                (contact) => (

                  <tr
                    key={contact.id}
                    className="border-t"
                  >

                    <td className="px-6 py-5">

                      <div className="font-semibold">
                        {contact.name}
                      </div>

                    </td>

                    <td className="px-6 py-5">

                      {contact.designation ??
                        "-"}

                    </td>

                    <td className="px-6 py-5">

                      {contact.email ?? "-"}

                    </td>

                    <td className="px-6 py-5">

                      {contact.phone ??
                        contact.mobile ??
                        "-"}

                    </td>

                    <td className="px-6 py-5">

                      {contact.primary ? (

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                          Primary

                        </span>

                      ) : (

                        <span className="text-slate-400">

                          —

                        </span>

                      )}

                    </td>

                    <td className="px-6 py-5">

                      <div className="flex justify-end gap-3">

                        <Link
                          href={`/vendors/${vendor.id}/contacts/${contact.id}/edit`}
                          className="rounded-lg border px-3 py-2 hover:bg-slate-50"
                        >
                          Edit
                        </Link>

                        <Link
                          href={`/vendors/${vendor.id}/contacts/${contact.id}/delete`}
                          className="rounded-lg border border-red-300 px-3 py-2 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Link>

                      </div>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

        <h2 className="text-xl font-semibold text-blue-900">
          Contact Summary
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3">

          <div>

            <div className="text-sm text-blue-700">
              Total Contacts
            </div>

            <div className="mt-2 text-3xl font-bold text-blue-900">
              {vendor.contacts.length}
            </div>

          </div>

          <div>

            <div className="text-sm text-blue-700">
              Primary Contacts
            </div>

            <div className="mt-2 text-3xl font-bold text-blue-900">
              {
                vendor.contacts.filter(
                  (c) => c.primary
                ).length
              }
            </div>

          </div>

          <div>

            <div className="text-sm text-blue-700">
              Email Addresses
            </div>

            <div className="mt-2 text-3xl font-bold text-blue-900">
              {
                vendor.contacts.filter(
                  (c) => c.email
                ).length
              }
            </div>

          </div>

        </div>

      </div>

    </div>

  );

}