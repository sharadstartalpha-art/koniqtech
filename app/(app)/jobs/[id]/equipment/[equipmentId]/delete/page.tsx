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

export default async function DeleteEquipmentPage({
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

       customer: {
  select: {
    companyName: true,
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
  },
},

        serviceHistory: {

          select: {
            id: true,
            serviceDate: true,
            serviceType: true,
          },

          orderBy: {
            serviceDate: "desc",
          },

        },

      },

    })

  if (!equipment) {
    notFound()
  }

  async function deleteEquipment() {

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

    await prisma.userEquipment.delete({

      where: {
        id: existing.id,
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
          href={`/jobs/${job.id}/equipment/${equipment.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Equipment
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Delete Equipment
        </h1>

        <p className="mt-2 text-slate-500">
          Permanently remove this equipment
          record.
        </p>

      </div>

      <form
        action={deleteEquipment}
        className="space-y-8"
      >
                <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

          <h2 className="text-2xl font-semibold text-red-700">
            Permanent Deletion Warning
          </h2>

          <p className="mt-4 leading-7 text-red-700">

            This equipment record will be
            permanently removed from the
            system.

          </p>

          <p className="mt-2 leading-7 text-red-700">

            All associated service history,
            maintenance references and job
            relationships will also be
            deleted because of the cascade
            relationship.

          </p>

          <p className="mt-2 leading-7 text-red-700">

            This action cannot be undone.

          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          <div className="rounded-3xl border bg-white p-8">

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
                  Manufacturer
                </dt>

                <dd>

                  {equipment.manufacturer ??
                    "-"}

                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Model
                </dt>

                <dd>

                  {equipment.model ??
                    "-"}

                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Serial Number
                </dt>

                <dd>

                  {equipment.serialNumber ??
                    "-"}

                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Status
                </dt>

                <dd className="capitalize">
                  {equipment.status}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Warranty
                </dt>

                <dd>

                  {equipment.warrantyExpiry
                    ? equipment.warrantyExpiry.toLocaleDateString()
                    : "-"}

                </dd>

              </div>

            </dl>

          </div>

          <div className="space-y-8">

            <div className="rounded-3xl border bg-white p-8">

              <h2 className="text-xl font-semibold">
                Customer Information
              </h2>

              <dl className="mt-6 space-y-4">

                <div>

                  <dt className="text-sm text-slate-500">
                    Company
                  </dt>

                  <dd className="mt-1 font-medium">

                    {equipment.customer
                      ?.companyName ?? "-"}

                  </dd>

                </div>

                <div>

                 <dt>Customer</dt>

<dd>
  {[
    equipment.customer?.firstName,
    equipment.customer?.lastName,
  ]
    .filter(Boolean)
    .join(" ") || "-"}
</dd>
                </div>

                <div>

                  <dt className="text-sm text-slate-500">
                    Email
                  </dt>

                  <dd className="mt-1">

                    {equipment.customer
                      ?.email ?? "-"}

                  </dd>

                </div>

              </dl>

            </div>

            <div className="rounded-3xl border bg-white p-8">

              <h2 className="text-xl font-semibold">
                Service History Summary
              </h2>

              <dl className="mt-6 space-y-4">

                <div className="flex justify-between">

                  <dt className="text-slate-500">
                    Total Services
                  </dt>

                  <dd className="font-semibold">
                    {equipment.serviceHistory.length}
                  </dd>

                </div>

                <div>

                  <dt className="text-sm text-slate-500">
                    Latest Service
                  </dt>

                  <dd className="mt-2">

                    {equipment.serviceHistory[0]
                      ? (
                        <>
                          <div className="font-medium">
                            {
                              equipment
                                .serviceHistory[0]
                                .serviceType
                            }
                          </div>

                          <div className="text-sm text-slate-500">

                            {
                              equipment
                                .serviceHistory[0]
                                .serviceDate
                                .toLocaleDateString()
                            }

                          </div>
                        </>
                      )
                      : "No service history"}

                  </dd>

                </div>

              </dl>

            </div>

          </div>

        </div>
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">

          <h2 className="text-xl font-semibold text-amber-900">
            Final Confirmation
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-7 text-amber-800">

            <p>

              Please verify that this
              equipment should be removed
              before continuing.

            </p>

            <p>

              Deleting this equipment will
              permanently remove the asset
              record and any related service
              history stored for this
              equipment.

            </p>

            <p>

              If the equipment has simply
              been retired or replaced,
              consider updating its status
              instead of deleting the record.

            </p>

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
            bg-red-600
            px-6
            py-3
            font-medium
            text-white
            transition
            hover:bg-red-700
            "
          >
            Delete Equipment
          </button>

        </div>

      </form>

    </div>

  )

}