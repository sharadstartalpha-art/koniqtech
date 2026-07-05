// app/admin/sales/leads/page.tsx

import Link from "next/link"
import { redirect } from "next/navigation"

import {
  ArrowRight,
  Mail,
  Phone,
  Search,
  Target,
  UserCheck,
  Users,
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"


/* ==========================================================
   TYPES
========================================================== */

type PageProps = {
  searchParams: Promise<{
    q?: string
    status?: string
    priority?: string
    page?: string
  }>
}


/* ==========================================================
   HELPERS
========================================================== */

function formatDate(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }
  ).format(date)
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


function statusClass(
  status: string
) {
  switch (status) {
    case "new":
      return `
        border-blue-200
        bg-blue-50
        text-blue-700
      `

    case "contacted":
      return `
        border-orange-200
        bg-orange-50
        text-orange-700
      `

    case "estimate":
      return `
        border-purple-200
        bg-purple-50
        text-purple-700
      `

    case "won":
    case "converted":
      return `
        border-green-200
        bg-green-50
        text-green-700
      `

    case "lost":
      return `
        border-red-200
        bg-red-50
        text-red-700
      `

    default:
      return `
        border-slate-200
        bg-slate-50
        text-slate-700
      `
  }
}


function priorityClass(
  priority: string | null
) {
  switch (
    priority
      ?.trim()
      .toLowerCase()
  ) {
    case "high":
      return `
        border-red-200
        bg-red-50
        text-red-700
      `

    case "low":
      return `
        border-green-200
        bg-green-50
        text-green-700
      `

    default:
      return `
        border-orange-200
        bg-orange-50
        text-orange-700
      `
  }
}


/* ==========================================================
   PAGE
========================================================== */

export default async function SalesLeadsPage({
  searchParams,
}: PageProps) {

  /* --------------------------------------------------------
     AUTH
  --------------------------------------------------------- */

  const session =
    await auth()


  if (!session?.user) {
    redirect("/login")
  }


  const userId =
    String(
      (session.user as any).id ??
        ""
    )


  const role =
    String(
      (session.user as any).role ??
        ""
    )
      .trim()
      .toLowerCase()


  if (
    !userId ||
    role !== "platform_sales"
  ) {
    redirect("/admin/dashboard")
  }


  /* --------------------------------------------------------
     SEARCH PARAMS
  --------------------------------------------------------- */

  const params =
    await searchParams


  const query =
    params.q?.trim() ?? ""


  const status =
    params.status?.trim() ?? ""


  const priority =
    params.priority?.trim() ?? ""


  const currentPage =
    Math.max(
      1,
      Number(params.page) || 1
    )


  const pageSize = 10


  /* --------------------------------------------------------
     FILTER
  --------------------------------------------------------- */

  const where = {

    assignedTo:
      userId,

    ...(status
      ? {
          status:
            status as
              | "new"
              | "contacted"
              | "estimate"
              | "won"
              | "lost"
              | "converted",
        }
      : {}),

    ...(priority
      ? {
          priority,
        }
      : {}),

    ...(query
      ? {
          OR: [
            {
              firstName: {
                contains: query,
                mode: "insensitive" as const,
              },
            },

            {
              lastName: {
                contains: query,
                mode: "insensitive" as const,
              },
            },

            {
              email: {
                contains: query,
                mode: "insensitive" as const,
              },
            },

            {
              phone: {
                contains: query,
                mode: "insensitive" as const,
              },
            },

            {
              companyName: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  }


  /* --------------------------------------------------------
     DATA
  --------------------------------------------------------- */

  const [
    totalFiltered,
    totalAssigned,
    newCount,
    contactedCount,
    qualifiedCount,
    leads,
  ] = await Promise.all([

    prisma.lead.count({
      where,
    }),


    prisma.lead.count({
      where: {
        assignedTo:
          userId,
      },
    }),


    prisma.lead.count({
      where: {
        assignedTo:
          userId,

        status:
          "new",
      },
    }),


    prisma.lead.count({
      where: {
        assignedTo:
          userId,

        status:
          "contacted",
      },
    }),


    prisma.lead.count({
      where: {
        assignedTo:
          userId,

        status: {
          in: [
            "estimate",
            "won",
            "converted",
          ],
        },
      },
    }),


    prisma.lead.findMany({
      where,

      orderBy: [
        {
          createdAt:
            "desc",
        },
      ],

      skip:
        (currentPage - 1) *
        pageSize,

      take:
        pageSize,

      select: {
        id: true,

        firstName: true,

        lastName: true,

        companyName: true,

        email: true,

        phone: true,

        source: true,

        priority: true,

        industry: true,

        status: true,

        createdAt: true,

        _count: {
          select: {
            activities: true,
            notes: true,
          },
        },
      },
    }),

  ])


  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalFiltered /
          pageSize
      )
    )


  /* ========================================================
     UI
  ======================================================== */

  return (

    <div className="space-y-6">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-end
          lg:justify-between
        "
      >

        <div>

          <p
            className="
              mb-1
              text-sm
              font-medium
              text-blue-600
            "
          >
            Sales Pipeline
          </p>


          <h1
            className="
              text-3xl
              font-bold
              tracking-tight
              text-slate-950
            "
          >
            My Leads
          </h1>


          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Contact assigned prospects,
            record outreach activity,
            follow up, and move qualified
            leads toward a product demo.
          </p>

        </div>


        <Link
          href="/admin/sales/outreach"
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-green-600
            px-4
            text-sm
            font-medium
            text-white
            transition
            hover:bg-green-700
          "
        >
          <Mail size={17} />

          Start Outreach
        </Link>

      </div>


      {/* ====================================================
          STATS
      ==================================================== */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        <StatCard
          label="Assigned Leads"
          value={totalAssigned}
          description="Total leads assigned to you"
          icon={Users}
          iconClass="bg-blue-50 text-blue-600"
        />


        <StatCard
          label="New Leads"
          value={newCount}
          description="Waiting for first contact"
          icon={Target}
          iconClass="bg-orange-50 text-orange-600"
        />


        <StatCard
          label="Contacted"
          value={contactedCount}
          description="Initial contact completed"
          icon={Phone}
          iconClass="bg-blue-50 text-blue-600"
        />


        <StatCard
          label="Qualified"
          value={qualifiedCount}
          description="Qualified or successful leads"
          icon={UserCheck}
          iconClass="bg-green-50 text-green-600"
        />

      </div>


      {/* ====================================================
          FILTERS
      ==================================================== */}

      <form
        method="GET"
        className="
          grid
          gap-3
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
          lg:grid-cols-[minmax(260px,1fr)_220px_220px_auto]
        "
      >

        {/* SEARCH */}

        <div className="relative">

          <Search
            size={18}
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />


          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search name, email, phone or company..."
            className="
              h-11
              w-full
              rounded-lg
              border
              border-slate-300
              bg-white
              pl-11
              pr-4
              text-sm
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          />

        </div>


        {/* STATUS */}

        <select
          name="status"
          defaultValue={status}
          className="
            h-11
            rounded-lg
            border
            border-slate-300
            bg-white
            px-3
            text-sm
            outline-none
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        >
          <option value="">
            All statuses
          </option>

          <option value="new">
            New
          </option>

          <option value="contacted">
            Contacted
          </option>

          <option value="estimate">
            Estimate / Interested
          </option>

          <option value="won">
            Won
          </option>

          <option value="lost">
            Lost
          </option>

          <option value="converted">
            Converted
          </option>
        </select>


        {/* PRIORITY */}

        <select
          name="priority"
          defaultValue={priority}
          className="
            h-11
            rounded-lg
            border
            border-slate-300
            bg-white
            px-3
            text-sm
            outline-none
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        >
          <option value="">
            All priorities
          </option>

          <option value="High">
            High
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="Low">
            Low
          </option>
        </select>


        <button
          type="submit"
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-blue-600
            px-5
            text-sm
            font-medium
            text-white
            transition
            hover:bg-blue-700
          "
        >
          <Search size={17} />

          Filter
        </button>

      </form>


      {/* ====================================================
          LEADS TABLE
      ==================================================== */}

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
            flex-col
            gap-2
            border-b
            border-slate-200
            px-5
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <h2
              className="
                font-semibold
                text-slate-950
              "
            >
              Assigned Lead Records
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {totalFiltered}{" "}
              {totalFiltered === 1
                ? "lead"
                : "leads"}{" "}
              found
            </p>

          </div>


          <p
            className="
              text-sm
              text-slate-400
            "
          >
            Page {currentPage} of{" "}
            {totalPages}
          </p>

        </div>


        {leads.length === 0 ? (

          /* EMPTY STATE */

          <div
            className="
              flex
              min-h-72
              flex-col
              items-center
              justify-center
              px-6
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
              <Target size={25} />
            </div>


            <h3
              className="
                mt-4
                text-lg
                font-semibold
                text-slate-900
              "
            >
              No leads found
            </h3>


            <p
              className="
                mt-2
                max-w-md
                text-sm
                text-slate-500
              "
            >
              No assigned leads match the
              current filters. New leads
              assigned to your sales account
              will appear here.
            </p>

          </div>

        ) : (

          /* TABLE */

          <div className="overflow-x-auto">

            <table
              className="
                w-full
                min-w-[1100px]
                text-left
              "
            >

              <thead
                className="
                  bg-slate-50
                  text-xs
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >

                <tr>

                  <th className="px-5 py-3">
                    Lead
                  </th>

                  <th className="px-5 py-3">
                    Contact
                  </th>

                  <th className="px-5 py-3">
                    Source
                  </th>

                  <th className="px-5 py-3">
                    Industry
                  </th>

                  <th className="px-5 py-3">
                    Priority
                  </th>

                  <th className="px-5 py-3">
                    Status
                  </th>

                  <th className="px-5 py-3">
                    Activity
                  </th>

                  <th className="px-5 py-3">
                    Created
                  </th>

                  <th className="px-5 py-3 text-right">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody
                className="
                  divide-y
                  divide-slate-100
                "
              >

                {leads.map(
                  (lead) => {

                    const fullName =
                      [
                        lead.firstName,
                        lead.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ")


                    return (

                      <tr
                        key={lead.id}
                        className="
                          transition
                          hover:bg-slate-50/70
                        "
                      >

                        {/* LEAD */}

                        <td className="px-5 py-4">

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
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-50
                                text-sm
                                font-semibold
                                text-blue-700
                              "
                            >
                              {lead.firstName
                                .slice(0, 1)
                                .toUpperCase()}

                              {lead.lastName
                                ?.slice(0, 1)
                                .toUpperCase() ??
                                ""}
                            </div>


                            <div>

                              <p
                                className="
                                  font-medium
                                  text-slate-900
                                "
                              >
                                {fullName}
                              </p>


                              <p
                                className="
                                  mt-1
                                  text-xs
                                  text-slate-500
                                "
                              >
                                {lead.companyName ||
                                  "Individual prospect"}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* CONTACT */}

                        <td className="px-5 py-4">

                          <div
                            className="
                              space-y-1
                              text-sm
                            "
                          >

                            <p
                              className="
                                flex
                                items-center
                                gap-2
                                text-slate-700
                              "
                            >
                              <Mail
                                size={14}
                                className="
                                  text-slate-400
                                "
                              />

                              {lead.email || "—"}
                            </p>


                            <p
                              className="
                                flex
                                items-center
                                gap-2
                                text-slate-500
                              "
                            >
                              <Phone
                                size={14}
                                className="
                                  text-slate-400
                                "
                              />

                              {lead.phone || "—"}
                            </p>

                          </div>

                        </td>


                        {/* SOURCE */}

                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            text-slate-600
                          "
                        >
                          {lead.source || "—"}
                        </td>


                        {/* INDUSTRY */}

                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            text-slate-600
                          "
                        >
                          {lead.industry
                            ? formatStatus(
                                lead.industry
                              )
                            : "—"}
                        </td>


                        {/* PRIORITY */}

                        <td className="px-5 py-4">

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              border
                              px-2.5
                              py-1
                              text-xs
                              font-medium
                              ${priorityClass(
                                lead.priority
                              )}
                            `}
                          >
                            {lead.priority ||
                              "Medium"}
                          </span>

                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              border
                              px-2.5
                              py-1
                              text-xs
                              font-medium
                              ${statusClass(
                                lead.status
                              )}
                            `}
                          >
                            {formatStatus(
                              lead.status
                            )}
                          </span>

                        </td>


                        {/* ACTIVITY */}

                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            text-slate-600
                          "
                        >

                          <div className="space-y-1">

                            <p>
                              {
                                lead._count
                                  .activities
                              }{" "}
                              activities
                            </p>

                            <p
                              className="
                                text-xs
                                text-slate-400
                              "
                            >
                              {
                                lead._count
                                  .notes
                              }{" "}
                              notes
                            </p>

                          </div>

                        </td>


                        {/* CREATED */}

                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            text-slate-500
                          "
                        >
                          {formatDate(
                            lead.createdAt
                          )}
                        </td>


                        {/* ACTION */}

                        <td
                          className="
                            px-5
                            py-4
                            text-right
                          "
                        >

                          <Link
                            href={
                              `/admin/sales/leads/${lead.id}`
                            }
                            className="
                              inline-flex
                              items-center
                              gap-1
                              rounded-lg
                              bg-blue-50
                              px-3
                              py-2
                              text-sm
                              font-medium
                              text-blue-700
                              transition
                              hover:bg-blue-100
                            "
                          >
                            Open

                            <ArrowRight
                              size={15}
                            />
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


        {/* ==================================================
            PAGINATION
        ================================================== */}

        {totalFiltered > 0 && (

          <div
            className="
              flex
              flex-col
              gap-3
              border-t
              border-slate-200
              px-5
              py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <p
              className="
                text-sm
                text-slate-500
              "
            >
              Showing{" "}
              {(currentPage - 1) *
                pageSize +
                1}{" "}
              to{" "}
              {Math.min(
                currentPage *
                  pageSize,
                totalFiltered
              )}{" "}
              of {totalFiltered}
            </p>


            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              {currentPage > 1 ? (

                <Link
                  href={buildPageUrl({
                    query,
                    status,
                    priority,
                    page:
                      currentPage - 1,
                  })}
                  className="
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-slate-700
                    transition
                    hover:bg-slate-50
                  "
                >
                  Previous
                </Link>

              ) : (

                <span
                  className="
                    cursor-not-allowed
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-2
                    text-sm
                    text-slate-400
                  "
                >
                  Previous
                </span>

              )}


              {currentPage <
              totalPages ? (

                <Link
                  href={buildPageUrl({
                    query,
                    status,
                    priority,
                    page:
                      currentPage + 1,
                  })}
                  className="
                    rounded-lg
                    bg-blue-600
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  Next
                </Link>

              ) : (

                <span
                  className="
                    cursor-not-allowed
                    rounded-lg
                    bg-slate-100
                    px-4
                    py-2
                    text-sm
                    text-slate-400
                  "
                >
                  Next
                </span>

              )}

            </div>

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
  label,
  value,
  description,
  icon: Icon,
  iconClass,
}: {
  label: string
  value: number
  description: string
  icon: React.ElementType
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
            {label}
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
              mt-3
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
            items-center
            justify-center
            rounded-xl
            ${iconClass}
          `}
        >
          <Icon size={21} />
        </div>

      </div>

    </div>

  )
}


/* ==========================================================
   PAGINATION URL
========================================================== */

function buildPageUrl({
  query,
  status,
  priority,
  page,
}: {
  query: string
  status: string
  priority: string
  page: number
}) {

  const params =
    new URLSearchParams()


  if (query) {
    params.set(
      "q",
      query
    )
  }


  if (status) {
    params.set(
      "status",
      status
    )
  }


  if (priority) {
    params.set(
      "priority",
      priority
    )
  }


  params.set(
    "page",
    String(page)
  )


  return (
    `/admin/sales/leads?${params.toString()}`
  )
}