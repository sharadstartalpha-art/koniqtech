import prisma from "@/shared/lib/prisma"
import Link from "next/link"

import { auth } from "@/auth"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  History,
  Clock
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function Page({
  params
}: {
  params: Promise<{
    id: string
  }>
}) {

  const session =
    await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId =
    session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const { id } =
    await params

  const customer =
    await prisma.customer.findFirst({

      where: {
        id,
        orgId
      },

      select: {

        id: true,

        firstName: true,

        lastName: true,

        activities: {

          orderBy: {
            createdAt: "desc"
          }

        }

      }

    })

  if (!customer) {
    notFound()
  }

  return (

    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}

      <div>

        <Link
          href={`/customers/${customer.id}`}
          className="
          inline-flex
          items-center
          gap-2
          text-slate-500
          hover:text-orange-600
          mb-5
          "
        >
          <ArrowLeft size={16} />

          Back to Customer

        </Link>

        <div className="flex items-center gap-4">

          <div
            className="
            w-12
            h-12
            rounded-2xl
            bg-orange-100
            text-orange-600
            flex
            items-center
            justify-center
            "
          >
            <History size={22} />
          </div>

          <div>

            <h1 className="
            text-4xl
            font-bold
            text-slate-900
            ">
              Customer History
            </h1>

            <p className="text-slate-500 mt-1">

              Activity timeline for

              <span className="font-medium text-slate-700">

                {" "}
                {customer.firstName} {customer.lastName}

              </span>

            </p>

          </div>

        </div>

      </div>

      {/* Timeline */}

      <div
        className="
        bg-white
        border
        rounded-3xl
        shadow-sm
        p-8
        "
      >

        {
          customer.activities.length === 0 ? (

            <div className="py-20 text-center">

              <div
                className="
                w-16
                h-16
                mx-auto
                rounded-full
                bg-orange-100
                text-orange-600
                flex
                items-center
                justify-center
                mb-5
                "
              >

                <History size={26} />

              </div>

              <h3 className="text-xl font-semibold">

                No activity yet

              </h3>

              <p className="text-slate-500 mt-2">

                Customer activity will appear here as your team
                creates quotes, jobs, invoices and notes.

              </p>

            </div>

          ) : (

            <div className="space-y-8">

              {

                customer.activities.map(activity => (

                  <div
                    key={activity.id}
                    className="
                    relative
                    pl-10
                    border-l-2
                    border-orange-200
                    "
                  >

                    <div
                      className="
                      absolute
                      -left-[10px]
                      top-1
                      w-5
                      h-5
                      rounded-full
                      bg-orange-600
                      border-4
                      border-white
                      "
                    />

                    <div className="flex items-center gap-2">

                      <h3 className="
                      font-semibold
                      text-slate-900
                      ">
                        {activity.title}
                      </h3>

                    </div>

                    {

                      activity.description && (

                        <p className="
                        text-slate-600
                        mt-2
                        leading-relaxed
                        ">
                          {activity.description}
                        </p>

                      )

                    }

                    <div className="
                    flex
                    items-center
                    gap-2
                    mt-4
                    text-sm
                    text-slate-500
                    ">

                      <Clock size={14} />

                      {activity.createdAt.toLocaleString()}

                    </div>

                  </div>

                ))

              }

            </div>

          )

        }

      </div>

    </div>

  )

}