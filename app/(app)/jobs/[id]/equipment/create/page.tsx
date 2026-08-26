import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import Link from "next/link"

import {
  notFound,
  redirect,
} from "next/navigation"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CreateEquipmentPage({
  params,
}: PageProps) {

  const { id } =
    await params

  const session =
    await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId =
    (session.user as any).orgId

  const job =
    await prisma.job.findFirst({

      where: {
        id,
        orgId,
      },

      select: {
        id: true,
        title: true,
      },

    })

  if (!job) {
    notFound()
  }

  const customers =
    await prisma.customer.findMany({

      where: {
        orgId,
      },

      orderBy: {
        companyName: "asc",
      },

      select: {
        id: true,
        companyName: true,
      },

    })

  async function createEquipment(
    formData: FormData
  ) {

    "use server"

    const session =
      await auth()

    if (!session?.user) {
      redirect("/login")
    }

    const orgId =
      (session.user as any).orgId

    await prisma.userEquipment.create({

      data: {

        orgId,

        jobId: id,

        customerId:
          String(
            formData.get("customerId") ??
              ""
          ).trim() || null,

        equipmentName:
          String(
            formData.get("equipmentName")
          ).trim(),

        manufacturer:
          String(
            formData.get("manufacturer") ??
              ""
          ).trim() || null,

        model:
          String(
            formData.get("model") ??
              ""
          ).trim() || null,

        serialNumber:
          String(
            formData.get("serialNumber") ??
              ""
          ).trim() || null,

        installDate:
          String(
            formData.get("installDate") ??
              ""
          )
            ? new Date(
                String(
                  formData.get(
                    "installDate"
                  )
                )
              )
            : null,

        warrantyExpiry:
          String(
            formData.get(
              "warrantyExpiry"
            ) ?? ""
          )
            ? new Date(
                String(
                  formData.get(
                    "warrantyExpiry"
                  )
                )
              )
            : null,

        status:
          String(
            formData.get("status")
          ).trim() || "active",

        notes:
          String(
            formData.get("notes") ??
              ""
          ).trim() || null,

      },

    })

    redirect(
      `/jobs/${id}/equipment`
    )

  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/equipment`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Equipment
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Add Equipment
        </h1>

        <p className="mt-2 text-slate-500">
          Register equipment for this job.
        </p>

      </div>

      <form
        action={createEquipment}
        className="space-y-8 rounded-3xl border bg-white p-8"
      >
                <div className="grid gap-8 lg:grid-cols-2">

          <div className="space-y-6">

            <div>

              <label className="mb-2 block font-medium">
                Customer
              </label>

              <select
                name="customerId"
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                "
              >

                <option value="">
                  No Customer
                </option>

                {customers.map((customer) => (

                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.companyName}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Equipment Name
              </label>

              <input
                type="text"
                name="equipmentName"
                required
                placeholder="Equipment name"
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                "
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Manufacturer
              </label>

              <input
                type="text"
                name="manufacturer"
                placeholder="Manufacturer"
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                "
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Model
              </label>

              <input
                type="text"
                name="model"
                placeholder="Model"
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                "
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Serial Number
              </label>

              <input
                type="text"
                name="serialNumber"
                placeholder="Serial number"
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                "
              />

            </div>

          </div>

          <div className="space-y-6">

            <div>

              <label className="mb-2 block font-medium">
                Install Date
              </label>

              <input
                type="date"
                name="installDate"
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                "
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Warranty Expiry
              </label>

              <input
                type="date"
                name="warrantyExpiry"
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                "
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Status
              </label>

              <select
                name="status"
                defaultValue="active"
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                "
              >

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>

                <option value="maintenance">
                  Maintenance
                </option>

                <option value="retired">
                  Retired
                </option>

              </select>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Notes
              </label>

              <textarea
                name="notes"
                rows={6}
                placeholder="Additional information..."
                className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                "
              />

            </div>

          </div>

        </div>
                <div className="grid gap-8 lg:grid-cols-2">

          <div className="rounded-3xl border bg-white p-6">

            <h2 className="text-xl font-semibold">
              Equipment Summary
            </h2>

            <dl className="mt-6 space-y-4">

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Job
                </dt>

                <dd className="font-medium">
                  {job.title}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Customers Available
                </dt>

                <dd className="font-medium">
                  {customers.length}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Default Status
                </dt>

                <dd className="font-medium">
                  Active
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Linked Job
                </dt>

                <dd className="font-medium">
                  Yes
                </dd>

              </div>

            </dl>

          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

            <h2 className="text-xl font-semibold text-blue-900">
              Registration Guidelines
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

              <p>

                Enter the equipment name and,
                whenever available, record the
                manufacturer, model and serial
                number.

              </p>

              <p>

                Assign the equipment to a
                customer if applicable. The
                equipment will always be linked
                to the current job.

              </p>

              <p>

                Record installation and
                warranty dates to help manage
                future maintenance and warranty
                claims.

              </p>

              <p>

                Use notes to capture important
                installation details, asset
                identifiers or special service
                information.

              </p>

            </div>

          </div>

        </div>

        <div className="flex justify-end gap-4 border-t pt-8">

          <Link
            href={`/jobs/${job.id}/equipment`}
            className="
            rounded-xl
            border
            px-6
            py-3
            font-medium
            transition
            hover:bg-slate-100
            "
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="
            rounded-xl
            bg-blue-600
            px-6
            py-3
            font-medium
            text-white
            transition
            hover:bg-blue-700
            "
          >
            Create Equipment
          </button>

        </div>

      </form>

    </div>

  )

}