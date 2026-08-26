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

export default async function EditVendorPage({
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

    });

  if (!vendor) {
    notFound();
  }

  

  async function updateVendor(
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

    const companyName =
      formData
        .get("companyName")
        ?.toString()
        .trim() ?? "";

    const contactPerson =
      formData
        .get("contactPerson")
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

    const alternatePhone =
      formData
        .get("alternatePhone")
        ?.toString()
        .trim() || null;

    const website =
      formData
        .get("website")
        ?.toString()
        .trim() || null;

    const taxNumber =
      formData
        .get("taxNumber")
        ?.toString()
        .trim() || null;

    const paymentTerms =
      formData
        .get("paymentTerms")
        ?.toString()
        .trim() || null;

    const currency =
      formData
        .get("currency")
        ?.toString()
        .trim() || "USD";

    const ratingValue =
      formData
        .get("rating")
        ?.toString();

    const rating =
      ratingValue
        ? Number(ratingValue)
        : null;

    const active =
      formData.get("active") === "on";

    const notes =
      formData
        .get("notes")
        ?.toString()
        .trim() || null;

    if (!companyName) {

      throw new Error(
        "Company name is required."
      );

    }

    await prisma.vendor.update({
  where: {
    id: vendorId,
    orgId,
  },

      data: {

        companyName,

        contactPerson,

        email,

        phone,

        alternatePhone,

        website,

        taxNumber,

        paymentTerms,

        currency,

        rating,

        active,

        notes,

      },

    });

    redirect(`/vendors/${vendorId}`);

  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <Link
         href={`/vendors/${vendorId}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Vendor
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Edit Vendor
        </h1>

        <p className="mt-2 text-slate-600">
          Update vendor information.
        </p>

      </div>

      <form
        action={updateVendor}
        className="space-y-8"
      >

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Vendor Information
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div>

              <label className="block text-sm font-medium">
                Vendor Code
              </label>

              <input
                value={vendor.vendorCode}
                readOnly
                className="mt-2 w-full rounded-xl border bg-slate-100 px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Company Name *
              </label>

              <input
                name="companyName"
                required
                defaultValue={vendor.companyName}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Contact Person
              </label>

              <input
                name="contactPerson"
                defaultValue={
                  vendor.contactPerson ?? ""
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
                defaultValue={vendor.email ?? ""}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Phone
              </label>

              <input
                name="phone"
                defaultValue={vendor.phone ?? ""}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Alternate Phone
              </label>

              <input
                name="alternatePhone"
                defaultValue={
                  vendor.alternatePhone ?? ""
                }
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Website
              </label>

              <input
                name="website"
                defaultValue={vendor.website ?? ""}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Tax Number
              </label>

              <input
                name="taxNumber"
                defaultValue={
                  vendor.taxNumber ?? ""
                }
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Business Information
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div>

              <label className="block text-sm font-medium">
                Payment Terms
              </label>

              <select
                name="paymentTerms"
                defaultValue={
                  vendor.paymentTerms ?? ""
                }
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >

                <option value="">
                  Select Payment Terms
                </option>

                <option value="Due on Receipt">
                  Due on Receipt
                </option>

                <option value="Net 7">
                  Net 7
                </option>

                <option value="Net 15">
                  Net 15
                </option>

                <option value="Net 30">
                  Net 30
                </option>

                <option value="Net 45">
                  Net 45
                </option>

                <option value="Net 60">
                  Net 60
                </option>

              </select>

            </div>

            <div>

              <label className="block text-sm font-medium">
                Currency
              </label>

              <select
                name="currency"
                defaultValue={
                  vendor.currency ?? "USD"
                }
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >

                <option value="USD">
                  USD ($)
                </option>

              </select>

            </div>

            <div>

              <label className="block text-sm font-medium">
                Vendor Rating
              </label>

              <select
                name="rating"
                defaultValue={
                  vendor.rating?.toString() ?? ""
                }
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >

                <option value="">
                  Not Rated
                </option>

                <option value="1">⭐ 1</option>
                <option value="2">⭐⭐ 2</option>
                <option value="3">⭐⭐⭐ 3</option>
                <option value="4">⭐⭐⭐⭐ 4</option>
                <option value="5">⭐⭐⭐⭐⭐ 5</option>

              </select>

            </div>
                        <div>

              <label className="block text-sm font-medium">
                Active Vendor
              </label>

              <label className="mt-3 flex items-center gap-3">

                <input
                  type="checkbox"
                  name="active"
                  defaultChecked={vendor.active}
                  className="h-5 w-5 rounded border"
                />

                <span>
                  Vendor is active
                </span>

              </label>

            </div>

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Notes
          </h2>

          <textarea
            name="notes"
            rows={6}
            defaultValue={vendor.notes ?? ""}
            className="mt-6 w-full rounded-xl border px-4 py-3"
            placeholder="Internal notes..."
          />

        </div>

        <div className="flex justify-end gap-4">

          <Link
            href={`/vendors/${vendorId}`}
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