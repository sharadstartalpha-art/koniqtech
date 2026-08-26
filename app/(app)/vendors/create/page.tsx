import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import {
  redirect,
} from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CreateVendorPage() {

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

  const existingVendors =
    await prisma.vendor.count({

      where: {
        orgId,
      },

    });

  const vendorCode =
    `VEN-${String(
      existingVendors + 1
    ).padStart(5, "0")}`;

  async function createVendor(
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
        ?.toString()
        .trim();

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

    const count =
      await prisma.vendor.count({

        where: {
          orgId,
        },

      });

    const vendorCode =
      `VEN-${String(
        count + 1
      ).padStart(5, "0")}`;

          await prisma.vendor.create({

      data: {

        orgId,

        vendorCode,

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

    redirect("/vendors");

  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <Link
            href="/vendors"
            className="text-blue-600 hover:underline"
          >
            ← Back to Vendors
          </Link>

          <h1 className="mt-3 text-4xl font-bold">
            Create Vendor
          </h1>

          <p className="mt-2 text-slate-600">
            Add a new supplier or vendor to your
            organization.
          </p>

        </div>

      </div>

      <form
        action={createVendor}
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
                value={vendorCode}
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
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Contact Person
              </label>

              <input
                name="contactPerson"
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
                Alternate Phone
              </label>

              <input
                name="alternatePhone"
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Website
              </label>

              <input
                name="website"
                placeholder="https://"
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="block text-sm font-medium">
                Tax Number
              </label>

              <input
                name="taxNumber"
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

          </div>

        </div>
                <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Business Details
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div>

              <label className="block text-sm font-medium">
                Payment Terms
              </label>

              <select
                name="paymentTerms"
                className="mt-2 w-full rounded-xl border px-4 py-3"
                defaultValue=""
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
                defaultValue="USD"
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
                defaultValue=""
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

            <div className="flex items-center">

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  name="active"
                  defaultChecked
                  className="h-5 w-5 rounded border"
                />

                <span className="font-medium">
                  Active Vendor
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
            className="mt-6 w-full rounded-xl border px-4 py-3"
            placeholder="Internal notes about this vendor..."
          />

        </div>

        <div className="flex justify-end gap-4">

          <Link
            href="/vendors"
            className="rounded-xl border px-6 py-3 hover:bg-slate-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Create Vendor
          </button>

        </div>

      </form>

    </div>

  );

}