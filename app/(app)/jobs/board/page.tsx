import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import { redirect } from "next/navigation"
import Board from "./Board"

export const dynamic = "force-dynamic"

export default async function JobBoardPage() {

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = (session.user as any).orgId

  if (!orgId) {
    redirect("/login")
  }

  const jobs = await prisma.job.findMany({

    where: {
      orgId
    },

    include: {

      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          companyName: true
        }
      },

      technician: {
        select: {
          id: true,
          name: true
        }
      },

      quote: {
        select: {
          id: true,
          quoteNumber: true
        }
      },

      invoices: {
        select: {
          id: true,
          invoiceNumber: true,
          status: true
        }
      }

    },

    orderBy: [
      {
        scheduledDate: "asc"
      },
      {
        createdAt: "desc"
      }
    ]

  })

  const technicians = await prisma.user.findMany({

    where: {
      orgId,
      status: "active"
    },

    select: {
      id: true,
      name: true
    },

    orderBy: {
      name: "asc"
    }

  })

  const customers = await prisma.customer.findMany({

    where: {
      orgId
    },

    select: {
      id: true,
      firstName: true,
      lastName: true,
      companyName: true
    },

    orderBy: {
      firstName: "asc"
    }

  })

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Job Board
          </h1>

          <p className="mt-2 text-slate-500">
            Drag jobs between stages to update their status.
          </p>

        </div>

      </div>

      <Board
        jobs={jobs}
        technicians={technicians}
        customers={customers}
      />

    </div>

  )

}