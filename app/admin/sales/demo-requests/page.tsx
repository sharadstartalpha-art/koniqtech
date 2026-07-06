// app/admin/sales/demo-requests/page.tsx

import Link from "next/link"

import prisma from "@/shared/lib/prisma"

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Presentation,
  UserRound,
  XCircle,
} from "lucide-react"


/* ==========================================================
   HELPERS
========================================================== */

function formatDateTime(
  value: Date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(value)
}


function formatStatus(
  value: string
) {
  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    )
}


function getCompanyName(
  company: unknown,
  companyId: string
) {
  const value =
    company as Record<
      string,
      unknown
    >

  const possibleName =
    value?.companyName ??
    value?.name ??
    value?.businessName ??
    value?.company

  if (
    typeof possibleName ===
      "string" &&
    possibleName.trim()
  ) {
    return possibleName
  }

  return `Company ${companyId.slice(
    0,
    8
  )}`
}


function statusClass(
  status: string
) {
  switch (status) {

    case "scheduled":
      return `
        border-blue-200
        bg-blue-50
        text-blue-700
      `

    case "confirmed":
      return `
        border-green-200
        bg-green-50
        text-green-700
      `

    case "completed":
      return `
        border-emerald-200
        bg-emerald-50
        text-emerald-700
      `

    case "rescheduled":
      return `
        border-orange-200
        bg-orange-50
        text-orange-700
      `

    case "cancelled":
      return `
        border-red-200
        bg-red-50
        text-red-700
      `

    case "no_show":
      return `
        border-slate-300
        bg-slate-100
        text-slate-700
      `

    default:
      return `
        border-slate-200
        bg-slate-50
        text-slate-600
      `
  }
}


/* ==========================================================
   PAGE
========================================================== */

export default async function DemoRequestsPage() {

  const demos =
    await prisma.demoSchedule.findMany({

      include: {

        company: true,

        marketer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

      },

      orderBy: {
        meetingDate: "asc",
      },

    })


  /* ========================================================
     STATS
  ======================================================== */

  const total =
    demos.length


  const scheduled =
    demos.filter(
      (demo) =>
        demo.status ===
        "scheduled"
    ).length


  const confirmed =
    demos.filter(
      (demo) =>
        demo.status === "confirmed"
    ).length


  const completed =
    demos.filter(
      (demo) =>
        demo.status ===
        "completed"
    ).length


  const cancelled =
    demos.filter(
      (demo) =>
        demo.status ===
        "cancelled"
    ).length


  return (

    <div className="space-y-6">

      {/* ====================================================
          PAGE HEADER
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        <div>

          <p
            className="
              text-sm
              font-medium
              text-blue-600
            "
          >
            Sales Operations
          </p>


          <h1
            className="
              mt-1
              text-3xl
              font-bold
              tracking-tight
              text-slate-950
            "
          >
            Demo Requests
          </h1>


          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Manage demo appointments
            handed over from Sales to
            Marketing.
          </p>

        </div>


        <Link
          href="/admin/sales/demo-requests/new"
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-600
            px-5
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-blue-700
          "
        >
          <CalendarDays
            className="h-4 w-4"
          />

          Schedule Demo
        </Link>

      </div>


      {/* ====================================================
          MAIN STAT CARDS
      ===================================================== */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        {/* TOTAL */}

        <StatCard
          title="Total Requests"
          value={total}
          description="All demo requests"
          icon={
            <Presentation
              className="h-5 w-5"
            />
          }
          iconClass="
            bg-blue-50
            text-blue-600
          "
        />


        {/* SCHEDULED */}

        <StatCard
          title="Scheduled"
          value={scheduled}
          description="Waiting for confirmation"
          icon={
            <Clock3
              className="h-5 w-5"
            />
          }
          iconClass="
            bg-orange-50
            text-orange-600
          "
        />


        {/* CONFIRMED */}

        <StatCard
          title="Confirmed"
          value={confirmed}
          description="Confirmed appointments"
          icon={
            <CheckCircle2
              className="h-5 w-5"
            />
          }
          iconClass="
            bg-green-50
            text-green-600
          "
        />


        {/* COMPLETED */}

        <StatCard
          title="Completed"
          value={completed}
          description="Demo sessions completed"
          icon={
            <CheckCircle2
              className="h-5 w-5"
            />
          }
          iconClass="
            bg-emerald-50
            text-emerald-600
          "
        />

      </div>


      {/* ====================================================
          SECONDARY SUMMARY
      ===================================================== */}

      <div
        className="
          grid
          gap-4
          md:grid-cols-2
        "
      >

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-slate-500
                "
              >
                Cancelled Demos
              </p>


              <p
                className="
                  mt-2
                  text-2xl
                  font-bold
                  text-slate-950
                "
              >
                {cancelled}
              </p>

            </div>


            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-red-50
                text-red-600
              "
            >
              <XCircle
                className="h-5 w-5"
              />
            </div>

          </div>

        </div>


        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-slate-500
                "
              >
                Completion Rate
              </p>


              <p
                className="
                  mt-2
                  text-2xl
                  font-bold
                  text-slate-950
                "
              >
                {total > 0
                  ? Math.round(
                      (
                        completed /
                        total
                      ) * 100
                    )
                  : 0}
                %
              </p>

            </div>


            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-green-50
                text-green-600
              "
            >
              <CheckCircle2
                className="h-5 w-5"
              />
            </div>

          </div>

        </div>

      </div>


      {/* ====================================================
          DEMO REQUEST TABLE
      ===================================================== */}

      <section
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >

        {/* TABLE HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            px-5
            py-5
          "
        >

          <div>

            <h2
              className="
                text-lg
                font-semibold
                text-slate-950
              "
            >
              Scheduled Demonstrations
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {total} demo request
              {total === 1
                ? ""
                : "s"}{" "}
              found.
            </p>

          </div>

        </div>


        {/* EMPTY STATE */}

        {demos.length === 0 ? (

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              px-6
              py-16
              text-center
            "
          >

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
                text-blue-600
              "
            >
              <Presentation
                className="h-7 w-7"
              />
            </div>


            <h3
              className="
                mt-4
                font-semibold
                text-slate-950
              "
            >
              No demo requests yet
            </h3>


            <p
              className="
                mt-1
                max-w-md
                text-sm
                text-slate-500
              "
            >
              When Sales qualifies an
              interested prospect, schedule
              the demo and assign it to a
              Marketing employee.
            </p>


            <Link
              href="/admin/sales/demo-requests/new"
              className="
                mt-5
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-blue-600
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-blue-700
              "
            >
              <CalendarDays
                className="h-4 w-4"
              />

              Schedule First Demo
            </Link>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table
              className="
                min-w-full
                divide-y
                divide-slate-200
              "
            >

              <thead className="bg-slate-50">

                <tr>

                  <TableHeading>
                    Company
                  </TableHeading>

                  <TableHeading>
                    Marketing Employee
                  </TableHeading>

                  <TableHeading>
                    Meeting Date
                  </TableHeading>

                  <TableHeading>
                    Status
                  </TableHeading>

                  <TableHeading>
                    Meeting
                  </TableHeading>

                  <TableHeading align="right">
                    Action
                  </TableHeading>

                </tr>

              </thead>


              <tbody
                className="
                  divide-y
                  divide-slate-100
                "
              >

                {demos.map(
                  (demo) => {

                    const companyName =
                      getCompanyName(
                        demo.company,
                        demo.companyId
                      )


                    return (

                      <tr
                        key={demo.id}
                        className="
                          transition
                          hover:bg-slate-50/70
                        "
                      >

                        {/* COMPANY */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5
                            py-4
                          "
                        >

                          <div
                            className="
                              font-medium
                              text-slate-950
                            "
                          >
                            {companyName}
                          </div>


                          <div
                            className="
                              mt-1
                              text-xs
                              text-slate-500
                            "
                          >
                            Demo prospect
                          </div>

                        </td>


                        {/* MARKETER */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5
                            py-4
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >

                            <div
                              className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                bg-violet-50
                                text-violet-600
                              "
                            >
                              <UserRound
                                className="
                                  h-4
                                  w-4
                                "
                              />
                            </div>


                            <div>

                              <p
                                className="
                                  text-sm
                                  font-medium
                                  text-slate-900
                                "
                              >
                                {
                                  demo
                                    .marketer
                                    .firstName
                                }{" "}
                                {
                                  demo
                                    .marketer
                                    .lastName
                                }
                              </p>


                              <p
                                className="
                                  text-xs
                                  text-slate-500
                                "
                              >
                                {
                                  demo
                                    .marketer
                                    .email
                                }
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* DATE */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5
                            py-4
                            text-sm
                            text-slate-700
                          "
                        >
                          {formatDateTime(
                            demo.meetingDate
                          )}
                        </td>


                        {/* STATUS */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5
                            py-4
                          "
                        >

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              border
                              px-2.5
                              py-1
                              text-xs
                              font-semibold

                              ${statusClass(
                                demo.status
                              )}
                            `}
                          >
                            {formatStatus(
                              demo.status
                            )}
                          </span>

                        </td>


                        {/* MEETING */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5
                            py-4
                          "
                        >

                          {demo.meetingLink ? (

                            <a
                              href={
                                demo.meetingLink
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="
                                inline-flex
                                items-center
                                gap-1.5
                                text-sm
                                font-medium
                                text-green-600
                                hover:text-green-700
                              "
                            >
                              Join Meeting

                              <ExternalLink
                                className="
                                  h-3.5
                                  w-3.5
                                "
                              />
                            </a>

                          ) : (

                            <span
                              className="
                                text-sm
                                text-slate-400
                              "
                            >
                              Not added
                            </span>

                          )}

                        </td>


                        {/* ACTION */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5
                            py-4
                            text-right
                          "
                        >

                          <Link
                            href={
                              `/admin/sales/demo-requests/${demo.id}`
                            }
                            className="
                              inline-flex
                              items-center
                              justify-center
                              rounded-lg
                              bg-blue-50
                              px-3
                              py-2
                              text-sm
                              font-medium
                              text-blue-600
                              transition
                              hover:bg-blue-100
                            "
                          >
                            View
                          </Link>

                        </td>

                      </tr>

                    )
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  )
}


/* ==========================================================
   STAT CARD
========================================================== */

function StatCard({
  title,
  value,
  description,
  icon,
  iconClass,
}: {
  title: string
  value: number
  description: string
  icon: React.ReactNode
  iconClass: string
}) {

  return (

    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >

        <div>

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            {title}
          </p>


          <p
            className="
              mt-2
              text-3xl
              font-bold
              text-slate-950
            "
          >
            {value}
          </p>


          <p
            className="
              mt-2
              text-xs
              text-slate-400
            "
          >
            {description}
          </p>

        </div>


        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl

            ${iconClass}
          `}
        >
          {icon}
        </div>

      </div>

    </div>
  )
}


/* ==========================================================
   TABLE HEADING
========================================================== */

function TableHeading({
  children,
  align = "left",
}: {
  children: React.ReactNode
  align?: "left" | "right"
}) {

  return (

    <th
      className={`
        whitespace-nowrap
        px-5
        py-3.5
        text-xs
        font-semibold
        uppercase
        tracking-wide
        text-slate-500

        ${
          align === "right"
            ? "text-right"
            : "text-left"
        }
      `}
    >
      {children}
    </th>
  )
}