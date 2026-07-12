import Link from "next/link"

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Eye,
  Mail,
  RefreshCcw,
  Search,
  Send,
  XCircle
} from "lucide-react"

import { redirect } from "next/navigation"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import {
  Prisma,
  QueueStatus,
} from "@prisma/client"

/* =========================================================
   TYPES
========================================================= */

type EmailQueuePageProps = {
  searchParams: Promise<{
    q?: string
    status?: string
  }>
}

/* =========================================================
   HELPERS
========================================================= */

function formatDate(
  date: Date | null
) {
  if (!date) {
    return "—"
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  ).format(date)
}

function formatStatus(
  status: string
) {
  return status
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    )
}

function getStatusClasses(
  status: string
) {
  switch (
    status.toLowerCase()
  ) {
    case "sent":
    case "delivered":
      return `
        border-green-200
        bg-green-50
        text-green-700
      `

    case "pending":
    case "queued":
    case "scheduled":
      return `
        border-orange-200
        bg-orange-50
        text-orange-700
      `

    case "processing":
    case "sending":
      return `
        border-blue-200
        bg-blue-50
        text-blue-700
      `

    case "failed":
      return `
        border-red-200
        bg-red-50
        text-red-700
      `

    case "cancelled":
      return `
        border-slate-200
        bg-slate-100
        text-slate-600
      `

    default:
      return `
        border-slate-200
        bg-slate-50
        text-slate-700
      `
  }
}

function getStatusIcon(
  status: string
) {
  switch (
    status.toLowerCase()
  ) {
    case "sent":
    case "delivered":
      return (
        <CheckCircle2
          size={15}
        />
      )

    case "failed":
      return (
        <XCircle
          size={15}
        />
      )

    case "processing":
    case "sending":
      return (
        <RefreshCcw
          size={15}
        />
      )

    default:
      return (
        <Clock3
          size={15}
        />
      )
  }
}

/* =========================================================
   PAGE
========================================================= */

export default async function EmailQueuePage({
  searchParams
}: EmailQueuePageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = String(
    (
      session.user as {
        orgId?: string
      }
    ).orgId ?? ""
  )

  if (!orgId) {
    redirect(
      "/admin/marketing/dashboard"
    )
  }

  const params =
    await searchParams

  const q =
    params.q?.trim() ?? ""

  const status =
    params.status?.trim() ?? ""

  /* =======================================================
     FILTER
  ======================================================= */

 const where: Prisma.EmailQueueWhereInput = {
  orgId,
}

if (status) {
  where.status = status as QueueStatus
}

if (q) {
  where.OR = [
    {
      to: {
        contains: q,
        mode: Prisma.QueryMode.insensitive,
      },
    },
    {
      subject: {
        contains: q,
        mode: Prisma.QueryMode.insensitive,
      },
    },
    {
      html: {
        contains: q,
        mode: Prisma.QueryMode.insensitive,
      },
    },
    {
      provider: {
        contains: q,
        mode: Prisma.QueryMode.insensitive,
      },
    },
  ]
}
  /* =======================================================
     DATA
  ======================================================= */

  const [
  emailRecords,
  totalCount,
  pendingCount,
  sentCount,
  failedCount,
] = await Promise.all([
  prisma.emailQueue.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  }),

  prisma.emailQueue.count({
    where: {
      orgId,
    },
  }),

  prisma.emailQueue.count({
    where: {
      orgId,
      status: QueueStatus.pending,
    },
  }),

  prisma.emailQueue.count({
    where: {
      orgId,
      status: QueueStatus.sent,
    },
  }),

  prisma.emailQueue.count({
    where: {
      orgId,
      status: QueueStatus.failed,
    },
  }),
])
  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="
      min-h-screen
      bg-slate-50
    ">
      <div className="
        mx-auto
        max-w-[1500px]
        p-6
        lg:p-8
      ">
        {/* HEADER */}

        <div className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-end
          lg:justify-between
        ">
          <div>
            <p className="
              text-sm
              font-medium
              text-blue-600
            ">
              Communication
            </p>

            <h1 className="
              mt-2
              text-3xl
              font-bold
              tracking-tight
              text-slate-950
            ">
              Email Queue
            </h1>

            <p className="
              mt-2
              text-slate-500
            ">
              Monitor internal marketing email
              delivery, retries, failures, scheduling,
              and provider processing.
            </p>
          </div>
        </div>

        {/* SUMMARY */}

        <div className="
          mt-8
          grid
          gap-4
          md:grid-cols-2
          xl:grid-cols-4
        ">
          <SummaryCard
            title="Total Emails"
            value={totalCount}
            description="All queue records"
            icon={
              <Mail size={21} />
            }
            iconClass="
              bg-blue-50
              text-blue-600
            "
          />

          <SummaryCard
            title="Pending"
            value={pendingCount}
            description="Waiting for processing"
            icon={
              <Clock3 size={21} />
            }
            iconClass="
              bg-orange-50
              text-orange-600
            "
          />

          <SummaryCard
            title="Sent"
            value={sentCount}
            description="Successfully processed"
            icon={
              <Send size={21} />
            }
            iconClass="
              bg-green-50
              text-green-600
            "
          />

          <SummaryCard
            title="Failed"
            value={failedCount}
            description="Require attention"
            icon={
              <AlertCircle size={21} />
            }
            iconClass="
              bg-red-50
              text-red-600
            "
          />
        </div>

        {/* TABLE CARD */}

        <section className="
          mt-7
          overflow-hidden
          rounded-3xl
          border
          bg-white
          shadow-sm
        ">
          {/* FILTERS */}

          <div className="
            border-b
            p-5
          ">
            <form
              className="
                flex
                flex-col
                gap-3
                lg:flex-row
              "
            >
              <div className="
                relative
                flex-1
              ">
                <Search
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Search recipient, subject, message, or provider..."
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    bg-white
                    pl-11
                    pr-4
                    text-sm
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-50
                  "
                />
              </div>

              <select
                name="status"
                defaultValue={status}
                className="
                  h-12
                  rounded-xl
                  border
                  bg-white
                  px-4
                  text-sm
                  text-slate-700
                  outline-none
                  focus:border-blue-500
                "
              >
                <option value="">
                  All Statuses
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="queued">
                  Queued
                </option>

                <option value="scheduled">
                  Scheduled
                </option>

                <option value="processing">
                  Processing
                </option>

                <option value="sending">
                  Sending
                </option>

                <option value="sent">
                  Sent
                </option>

                <option value="delivered">
                  Delivered
                </option>

                <option value="failed">
                  Failed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>

              <button
                type="submit"
                className="
                  h-12
                  rounded-xl
                  bg-blue-600
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                "
              >
                Apply Filters
              </button>

              {(q || status) && (
                <Link
                  href="/admin/marketing/email-queue"
                  className="
                    inline-flex
                    h-12
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-orange-300
                    bg-orange-50
                    px-6
                    text-sm
                    font-semibold
                    text-orange-700
                    transition
                    hover:bg-orange-100
                  "
                >
                  Reset
                </Link>
              )}
            </form>
          </div>

          {/* EMPTY STATE */}

          {emailRecords.length === 0 ? (
            <div className="
              flex
              flex-col
              items-center
              justify-center
              px-6
              py-20
              text-center
            ">
              <div className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-3xl
                bg-blue-50
                text-blue-600
              ">
                <Mail size={28} />
              </div>

              <h2 className="
                mt-5
                text-lg
                font-bold
                text-slate-950
              ">
                No email records found
              </h2>

              <p className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-500
              ">
                Internal marketing emails added
                to the delivery queue will appear
                here.
              </p>
            </div>
          ) : (
            /* TABLE */

            <div className="overflow-x-auto">
              <table className="
                w-full
                min-w-[1100px]
              ">
                <thead>
                  <tr className="
                    border-b
                    bg-slate-50
                  ">
                    <th className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    ">
                      Recipient
                    </th>

                    <th className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    ">
                      Subject
                    </th>

                    <th className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    ">
                      Provider
                    </th>

                    <th className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    ">
                      Status
                    </th>

                    <th className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    ">
                      Attempts
                    </th>

                    <th className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    ">
                      Created
                    </th>

                    <th className="
                      px-5
                      py-4
                      text-right
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    ">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {emailRecords.map(
                    (email) => (
                      <tr
                        key={email.id}
                        className="
                          transition
                          hover:bg-slate-50/80
                        "
                      >
                        {/* RECIPIENT */}

                        <td className="
                          px-5
                          py-4
                        ">
                          <div className="
                            flex
                            items-center
                            gap-3
                          ">
                            <div className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-blue-50
                              text-blue-600
                            ">
                              <Mail
                                size={18}
                              />
                            </div>

                            <span className="
                              max-w-[240px]
                              truncate
                              font-medium
                              text-slate-900
                            ">
                              {email.to}
                            </span>
                          </div>
                        </td>

                        {/* SUBJECT */}

                        <td className="
                          max-w-[360px]
                          px-5
                          py-4
                        ">
                         <p className="font-medium">
  {email.subject}
</p>

<p className="mt-1 text-xs text-slate-500 truncate">
  {email.html.replace(/<[^>]+>/g, "").slice(0, 80)}
</p>
                        </td>

                        {/* PROVIDER */}

                        <td className="
                          px-5
                          py-4
                          text-sm
                          text-slate-600
                        ">
                          {email.provider || "System"}
                        </td>

                        {/* STATUS */}

                        <td className="
                          px-5
                          py-4
                        ">
                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              border
                              px-3
                              py-1
                              text-xs
                              font-semibold
                              ${getStatusClasses(
                                email.status
                              )}
                            `}
                          >
                            {getStatusIcon(
                              email.status
                            )}

                            {formatStatus(
                              email.status
                            )}
                          </span>
                        </td>

                        {/* ATTEMPTS */}

                        <td className="
                          px-5
                          py-4
                          text-sm
                          font-semibold
                          text-slate-700
                        ">
                          {email.attempts}
                        </td>

                        {/* CREATED */}

                        <td className="
                          px-5
                          py-4
                          text-sm
                          text-slate-500
                        ">
                          {formatDate(
                            email.createdAt
                          )}
                        </td>

                        {/* ACTION */}

                        <td className="
                          px-5
                          py-4
                          text-right
                        ">
                          <Link
                            href={`/admin/marketing/email-queue/${email.id}`}
                            className="
                              inline-flex
                              h-10
                              items-center
                              justify-center
                              gap-2
                              rounded-xl
                              bg-blue-600
                              px-4
                              text-sm
                              font-semibold
                              text-white
                              transition
                              hover:bg-blue-700
                            "
                          >
                            <Eye size={16} />

                            View
                          </Link>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  description,
  icon,
  iconClass
}: {
  title: string
  value: number
  description: string
  icon: React.ReactNode
  iconClass: string
}) {
  return (
    <div className="
      rounded-3xl
      border
      bg-white
      p-5
      shadow-sm
    ">
      <div className="
        flex
        items-start
        justify-between
        gap-4
      ">
        <div>
          <p className="
            text-sm
            text-slate-500
          ">
            {title}
          </p>

          <p className="
            mt-2
            text-3xl
            font-bold
            text-slate-950
          ">
            {value}
          </p>

          <p className="
            mt-2
            text-xs
            text-slate-400
          ">
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
            rounded-2xl
            ${iconClass}
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}