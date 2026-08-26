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
    equipmentId: string
  }>
}

export default async function EditEquipmentPage({
  params,
}: PageProps) {

  const {
    id,
    equipmentId,
  } = await params

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

  const equipment =
    await prisma.userEquipment.findFirst({

      where: {
        id: equipmentId,
        orgId,
        jobId: job.id,
      },

      include: {
        customer: true,
      },

    })

  if (!equipment) {
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

  async function updateEquipment(
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

    const existing =
      await prisma.userEquipment.findFirst({

        where: {
          id: equipmentId,
          orgId,
          jobId: id,
        },

        select: {
          id: true,
        },

      })

    if (!existing) {
      notFound()
    }

    await prisma.userEquipment.update({

      where: {
        id: existing.id,
      },

      data: {

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
          ).trim(),

        notes:
          String(
            formData.get("notes") ??
              ""
          ).trim() || null,

      },

    })

    redirect(
      `/jobs/${id}/equipment/${equipmentId}`
    )

  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/equipment/${equipment.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Equipment
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Edit Equipment
        </h1>

        <p className="mt-2 text-slate-500">
          Update equipment information.
        </p>

      </div>

      <form
        action={updateEquipment}
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
                defaultValue={
                  equipment.customerId ?? ""
                }
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
                defaultValue={
                  equipment.equipmentName
                }
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
                defaultValue={
                  equipment.manufacturer ?? ""
                }
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
                defaultValue={
                  equipment.model ?? ""
                }
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
                defaultValue={
                  equipment.serialNumber ?? ""
                }
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
                defaultValue={
                  equipment.installDate
                    ? equipment.installDate
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
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
                defaultValue={
                  equipment.warrantyExpiry
                    ? equipment.warrantyExpiry
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
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
                defaultValue={
                  equipment.status
                }
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
                defaultValue={
                  equipment.notes ?? ""
                }
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
                  Equipment
                </dt>

                <dd className="font-medium">
                  {equipment.equipmentName}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Current Status
                </dt>

                <dd className="font-medium capitalize">
                  {equipment.status}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Customer
                </dt>

                <dd className="font-medium">
                  {equipment.customer?.companyName ?? "-"}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Warranty
                </dt>

                <dd className="font-medium">

                  {equipment.warrantyExpiry
                    ? equipment.warrantyExpiry.toLocaleDateString()
                    : "-"}

                </dd>

              </div>

            </dl>

          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

            <h2 className="text-xl font-semibold text-blue-900">
              Editing Guidelines
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

              <p>

                Keep the equipment name,
                manufacturer and model accurate
                to simplify future service
                visits.

              </p>

              <p>

                Update warranty information
                whenever warranty extensions or
                replacements occur.

              </p>

              <p>

                If equipment is no longer in
                use, update its status instead
                of deleting the record whenever
                possible.

              </p>

              <p>

                Use the notes field to record
                installation changes, hardware
                upgrades or important service
                information.

              </p>

            </div>

          </div>

        </div>

        <div className="flex justify-end gap-4 border-t pt-8">

          <Link
            href={`/jobs/${job.id}/equipment/${equipment.id}`}
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
            Save Changes
          </button>

        </div>

      </form>

    </div>

  )

}