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

export default async function EquipmentDetailsPage({
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

          include: {

            technician: {

              select: {
                id: true,
                name: true,
                email: true,
              },

            },

          },

          orderBy: {
            serviceDate: "desc",
          },

          take: 10,

        },

      },

    })

  if (!equipment) {
    notFound()
  }

  return (

    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

        <div>

          <Link
            href={`/jobs/${job.id}/equipment`}
            className="text-blue-600 hover:underline"
          >
            ← Back to Equipment
          </Link>

          <h1 className="mt-3 text-4xl font-bold">
            {equipment.equipmentName}
          </h1>

          <p className="mt-2 text-slate-500">
            Equipment details and service history.
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/jobs/${job.id}/equipment/${equipment.id}/edit`}
            className="rounded-xl border px-5 py-3 hover:bg-slate-100"
          >
            Edit
          </Link>

          <Link
            href={`/jobs/${job.id}/equipment/${equipment.id}/delete`}
            className="rounded-xl border border-red-300 px-5 py-3 text-red-600 hover:bg-red-50"
          >
            Delete
          </Link>

        </div>

      </div>

      <div className="grid gap-8 lg:grid-cols-2">
                <div className="rounded-3xl border bg-white p-8">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Equipment Information
            </h2>

            <span
              className="
              inline-flex
              rounded-full
              bg-green-100
              px-3
              py-1
              text-sm
              font-medium
              text-green-700
              capitalize
              "
            >
              {equipment.status}
            </span>

          </div>

          <dl className="mt-8 space-y-5">

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
                Install Date
              </dt>

              <dd>

                {equipment.installDate
                  ? equipment.installDate.toLocaleDateString()
                  : "-"}

              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Warranty Expiry
              </dt>

              <dd>

                {equipment.warrantyExpiry
                  ? equipment.warrantyExpiry.toLocaleDateString()
                  : "-"}

              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Created
              </dt>

              <dd>

                {equipment.createdAt.toLocaleDateString()}

              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Last Updated
              </dt>

              <dd>

                {equipment.updatedAt.toLocaleDateString()}

              </dd>

            </div>

          </dl>

          <div className="mt-8">

            <h3 className="font-semibold">
              Notes
            </h3>

            <div className="mt-3 rounded-xl border bg-slate-50 p-4">

              {equipment.notes?.trim()
                ? equipment.notes
                : "No notes available."}

            </div>

          </div>

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

              <div>

                <dt className="text-sm text-slate-500">
                  Phone
                </dt>

                <dd className="mt-1">

                  {equipment.customer
                    ?.phone ?? "-"}

                </dd>

              </div>

            </dl>

          </div>

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Recent Service History
            </h2>

            {equipment.serviceHistory.length === 0 ? (

              <p className="mt-6 text-slate-500">
                No service history available.
              </p>

            ) : (

              <div className="mt-6 overflow-x-auto">

                <table className="min-w-full">

                  <thead>

                    <tr className="border-b">

                      <th className="pb-3 text-left">
                        Date
                      </th>

                      <th className="pb-3 text-left">
                        Service
                      </th>

                      <th className="pb-3 text-left">
                        Technician
                      </th>

                      <th className="pb-3 text-left">
                        Next Service
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {equipment.serviceHistory.map(
                      (service) => (

                        <tr
                          key={service.id}
                          className="border-b last:border-0"
                        >

                          <td className="py-3">

                            {service.serviceDate.toLocaleDateString()}

                          </td>

                          <td className="py-3">

                            <div className="font-medium">
                              {service.serviceType}
                            </div>

                            <div className="text-sm text-slate-500">

                              {service.notes ??
                                "-"}

                            </div>

                          </td>

                          <td className="py-3">

                            {service.technician
                              ?.name ?? "-"}

                          </td>

                          <td className="py-3">

                            {service.nextService
                              ? service.nextService.toLocaleDateString()
                              : "-"}

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

      </div>
            <div className="grid gap-6 lg:grid-cols-4">

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Total Services
          </p>

          <p className="mt-2 text-3xl font-bold">
            {equipment.serviceHistory.length}
          </p>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Status
          </p>

          <p className="mt-2 text-2xl font-semibold capitalize">
            {equipment.status}
          </p>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Warranty
          </p>

          <p className="mt-2 text-lg font-semibold">

            {equipment.warrantyExpiry
              ? equipment.warrantyExpiry > new Date()
                ? "Active"
                : "Expired"
              : "Not Available"}

          </p>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Next Service
          </p>

          <p className="mt-2 text-lg font-semibold">

            {equipment.serviceHistory.find(
              (service) => service.nextService
            )?.nextService
              ?.toLocaleDateString() ?? "-"}

          </p>

        </div>

      </div>

      <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

        <h2 className="text-xl font-semibold text-blue-900">
          Maintenance Overview
        </h2>

        <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

          <p>

            This equipment record provides a
            complete overview of installation
            details, warranty information and
            maintenance history.

          </p>

          <p>

            Keep manufacturer, model and serial
            number information up to date to
            simplify future servicing,
            warranty claims and replacement
            tracking.

          </p>

          <p>

            Regularly recording maintenance
            activities helps build a complete
            service history and improves
            scheduling of preventive
            maintenance.

          </p>

          <p>

            If the equipment is no longer in
            service, consider updating its
            status instead of deleting the
            record to preserve historical
            maintenance information.

          </p>

        </div>

      </div>

    </div>

  )

}