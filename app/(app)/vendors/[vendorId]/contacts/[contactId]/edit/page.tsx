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

export default async function EditVendorContactPage({
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

  async function updateContact(
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

    const name =
      formData
        .get("name")
        ?.toString()
        .trim() ?? "";

    const designation =
      formData
        .get("designation")
        ?.toString()
        .trim() || null;

    const email =
      formData
        .get("email")
        ?.toString()
        .trim() || null;

    const phone =
      formData
        .get("phone")
        ?.toString()
        .trim() || null;

    const mobile =
      formData
        .get("mobile")
        ?.toString()
        .trim() || null;

    const primary =
      formData.get("primary") === "on";

    if (!name) {

      throw new Error(
        "Contact name is required."
      );

    }

    if (primary) {

      await prisma.vendorContact.updateMany({

        where: {
          vendorId: vendor.id,
          id: {
            not: currentContactId,
          },
          primary: true,
        },

        data: {
          primary: false,
        },

      });

    }

    await prisma.vendorContact.update({

      where: {
        id: currentContactId,
      },

      data: {

        name,

        designation,

        email,

        phone,

        mobile,

        primary,

      },

    });

    redirect(
      `/vendors/${vendor.id}/contacts`
    );

  }

  return (

    <div className="mx-auto max-w-4xl space-y-8">

      <div>

        <Link
          href={`/vendors/${currentVendorId}/contacts`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Contacts
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Edit Vendor Contact
        </h1>

        <p className="mt-2 text-slate-600">

          Update contact for
          {" "}
          <strong>
            {vendor.companyName}
          </strong>

        </p>

      </div>

      <form
        action={updateContact}
        className="space-y-8"
      >

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Contact Information
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div>

              <label className="block text-sm font-medium">
                Contact Name *
              </label>

              <input
                name="name"
                required
                defaultValue={contact.name}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Designation
              </label>

              <input
                name="designation"
                defaultValue={
                  contact.designation ?? ""
                }
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>
                        <div>

              <label className="block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                defaultValue={
                  contact.email ?? ""
                }
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Phone
              </label>

              <input
                name="phone"
                defaultValue={
                  contact.phone ?? ""
                }
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Mobile
              </label>

              <input
                name="mobile"
                defaultValue={
                  contact.mobile ?? ""
                }
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div className="md:col-span-2">

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  name="primary"
                  defaultChecked={contact.primary}
                  className="h-5 w-5 rounded border"
                />

                <span className="font-medium">
                  Primary Contact
                </span>

              </label>

              <p className="mt-2 text-sm text-slate-500">

                If checked, this contact will become
                the primary contact for the vendor and
                any existing primary contact will be
                updated automatically.

              </p>

            </div>

          </div>

        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

          <h2 className="text-xl font-semibold text-blue-900">
            Contact Information
          </h2>

          <div className="mt-6 space-y-3 text-sm leading-7 text-blue-800">

            <p>
              Update the contact details as needed.
            </p>

            <p>
              Primary contacts are used by default
              for purchase orders, communications,
              and vendor correspondence.
            </p>

            <p>
              You can change the primary contact at
              any time.
            </p>

          </div>

        </div>
                <div className="flex justify-end gap-4">

          <Link
            href={`/vendors/${currentVendorId}/contacts`}
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