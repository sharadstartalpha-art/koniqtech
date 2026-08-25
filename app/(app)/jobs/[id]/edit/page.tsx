import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"

import { notFound, redirect } from "next/navigation"

import JobForm from "../../create/JobForm"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditJobPage({
  params,
}: PageProps) {

  const session = await auth()

  const orgId =
    (session?.user as any)?.orgId

  if (!orgId) {
    redirect("/login")
  }

  const { id } = await params

  const job =
    await prisma.job.findFirst({

      where: {
        id,
        orgId,
      },

      include: {

        customer: true,

        technician: true,

        quote: true,

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
        firstName: "asc",
      },

    })

  const technicians =
    await prisma.user.findMany({

      where: {
        orgId,
        status: "active",
      },

      orderBy: {
        name: "asc",
      },

    })

  const quotes =
    await prisma.quote.findMany({

      where: {
        orgId,
      },

      orderBy: {
        createdAt: "desc",
      },

    })

  return (

    <div className="max-w-5xl mx-auto space-y-8">

      <div>

        <h1 className="text-4xl font-semibold">
          Edit Job
        </h1>

        <p className="mt-2 text-slate-500">
          Update job information, technician assignment,
          schedule and project details.
        </p>

      </div>

            <JobForm

              customers={customers}

              technicians={technicians}

              quotes={quotes}

              job={{
                  id: job.id,

                  title: job.title,

                  customerId: job.customerId,

                  technicianId: job.technicianId ?? "",

                  quoteId: job.quoteId ?? "",

                  status: job.status,

                  scheduledDate: job.scheduledDate
                      ? job.scheduledDate
                          .toISOString()
                          .split("T")[0]
                      : "",

                  completedDate: job.completedDate
                      ? job.completedDate
                          .toISOString()
                          .split("T")[0]
                      : "",

                  notes: job.notes ?? "",
              }} action={function (formData: FormData): void | Promise<void> {
                  throw new Error("Function not implemented.")
              } } submitLabel={""}
      />

          </div>

  )

}