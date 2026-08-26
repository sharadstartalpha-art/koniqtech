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

export default async function CreateVendorContactPage({
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

      select: {
        id: true,
        companyName: true,
      },

    });

  if (!vendor) {
    notFound();
  }

  const currentVendorId =
    vendor.id;

  async function createContact(
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
          primary: true,
        },

        data: {
          primary: false,
        },

      });

    }

    await prisma.vendorContact.create({

      data: {

        vendorId: vendor.id,

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
          New Vendor Contact
        </h1>

        <p className="mt-2 text-slate-600">

          Add a contact for
          {" "}
          <strong>
            {vendor.companyName}
          </strong>

        </p>

      </div>

      <form
        action={createContact}
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
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Designation
              </label>

              <input
                name="designation"
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
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Phone
              </label>

              <input
                name="phone"
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Mobile
              </label>

              <input
                name="mobile"
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div className="md:col-span-2">

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  name="primary"
                  className="h-5 w-5 rounded border"
                />

                <span className="font-medium">
                  Set as Primary Contact
                </span>

              </label>

              <p className="mt-2 text-sm text-slate-500">

                If enabled, any existing primary
                contact for this vendor will be
                replaced.

              </p>

            </div>

          </div>

        </div>

        <div className="rounded-3xl border bg-blue-50 p-8">

          <h2 className="text-xl font-semibold text-blue-900">
            Contact Guidelines
          </h2>

          <ul className="mt-6 list-disc space-y-3 pl-5 text-sm leading-7 text-blue-800">

            <li>
              Use the person's full legal name.
            </li>

            <li>
              Email and phone are optional but
              recommended.
            </li>

            <li>
              Only one contact should be marked
              as the primary contact.
            </li>

            <li>
              The primary contact will be used
              for purchase orders and vendor
              communications.
            </li>

          </ul>

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
            Create Contact
          </button>

        </div>

      </form>

    </div>

  );

}