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
    contactId: string;
  }>;
}

export default async function DeleteVendorContactPage({
  params,
}: PageProps) {

  const {
    vendorId,
    contactId,
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

      select: {
        id: true,
        companyName: true,
      },

    });

  if (!vendor) {
    notFound();
  }

  const contact =
    await prisma.vendorContact.findFirst({

      where: {
        id: contactId,
        vendorId: vendor.id,
      },

    });

  if (!contact) {
    notFound();
  }

  const currentVendorId =
    vendor.id;

  const currentContactId =
    contact.id;

  async function deleteContact() {
    "use server";

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
          id: currentVendorId,
          orgId,
        },

        select: {
          id: true,
        },

      });

    if (!vendor) {
      notFound();
    }

    await prisma.vendorContact.delete({

      where: {
        id: currentContactId,
      },

    });

    redirect(
      `/vendors/${vendor.id}/contacts`
    );

  }

  return (

    <div className="mx-auto max-w-3xl space-y-8">

      <div>

        <Link
          href={`/vendors/${currentVendorId}/contacts`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Contacts
        </Link>

        <h1 className="mt-3 text-4xl font-bold text-red-600">
          Delete Vendor Contact
        </h1>

        <p className="mt-2 text-slate-600">
          This action cannot be undone.
        </p>

      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

        <h2 className="text-2xl font-semibold">
          {contact.name}
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
                      <div>

            <div className="text-sm text-slate-500">
              Vendor
            </div>

            <div className="mt-1 font-semibold">
              {vendor.companyName}
            </div>

          </div>

          <div>

            <div className="text-sm text-slate-500">
              Contact Name
            </div>

            <div className="mt-1 font-semibold">
              {contact.name}
            </div>

          </div>

          <div>

            <div className="text-sm text-slate-500">
              Designation
            </div>

            <div className="mt-1 font-semibold">
              {contact.designation ?? "-"}
            </div>

          </div>

          <div>

            <div className="text-sm text-slate-500">
              Email
            </div>

            <div className="mt-1 font-semibold">
              {contact.email ?? "-"}
            </div>

          </div>

          <div>

            <div className="text-sm text-slate-500">
              Phone
            </div>

            <div className="mt-1 font-semibold">
              {contact.phone ?? "-"}
            </div>

          </div>

          <div>

            <div className="text-sm text-slate-500">
              Mobile
            </div>

            <div className="mt-1 font-semibold">
              {contact.mobile ?? "-"}
            </div>

          </div>

          <div>

            <div className="text-sm text-slate-500">
              Primary Contact
            </div>

            <div className="mt-1">

              {contact.primary ? (

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  Yes
                </span>

              ) : (

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  No
                </span>

              )}

            </div>

          </div>

        </div>

      </div>

      <div className="rounded-3xl border border-yellow-300 bg-yellow-50 p-6">

        <h3 className="text-lg font-semibold text-yellow-800">
          Warning
        </h3>

        <p className="mt-3 text-yellow-700">

          Deleting this contact permanently removes
          all of its information.

        </p>

        {contact.primary && (

          <p className="mt-3 font-medium text-red-700">

            This is the current primary contact for
            this vendor. After deletion, no primary
            contact will exist until another contact
            is marked as primary.

          </p>

        )}

      </div>
            <form
        action={deleteContact}
        className="space-y-6"
      >

        <div className="flex justify-end gap-4">

          <Link
            href={`/vendors/${currentVendorId}/contacts`}
            className="rounded-xl border px-6 py-3 hover:bg-slate-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
          >
            Delete Contact
          </button>

        </div>

      </form>

    </div>

  );

}