import Link from "next/link"

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Eye,
  MessageSquare,
  RefreshCcw,
  Search,
  Send,
  Smartphone,
  XCircle
} from "lucide-react"

import { redirect } from "next/navigation"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

/* =========================================================
   TYPES
========================================================= */

type SmsQueuePageProps = {
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

export default async function SmsQueuePage({
  searchParams
}: SmsQueuePageProps) {
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

  const where = {
    orgId,

    ...(status
      ? {
          status: status as never
        }
      : {}),

    ...(q
      ? {
          OR: [
            {
              phone: {
                contains: q,
                mode: "insensitive" as const
              }
            },

            {
              message: {
                contains: q,
                mode: "insensitive" as const
              }
            },

            {
              provider: {
                contains: q,
                mode: "insensitive" as const
              }
            }
          ]
        }
      : {})
  }

  /* =======================================================
     DATA
  ======================================================= */

  const [
    smsRecords,
    totalCount,
    pendingCount,
    sentCount,
    failedCount
  ] = await Promise.all([
    prisma.smsQueue.findMany({
      where,

      orderBy: {
        createdAt: "desc"
      },

      take: 100
    }),

    prisma.smsQueue.count({
      where: {
        orgId
      }
    }),

    prisma.smsQueue.count({
      where: {
        orgId,
        status: "pending"
      }
    }),

    prisma.smsQueue.count({
      where: {
        orgId,
        status: "sent"
      }
    }),

    prisma.smsQueue.count({
      where: {
        orgId,
        status: "failed"
      }
    })
  ])

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1500px] p-6 lg:p-8">
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
              SMS Queue
            </h1>

            <p className="
              mt-2
              text-slate-500
            ">
              Monitor internal marketing SMS
              delivery, retries, failures, and
              provider processing.
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
            title="Total SMS"
            value={totalCount}
            description="All queue records"
            icon={
              <MessageSquare size={21} />
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
                  placeholder="Search phone, message, or provider..."
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
                  href="/admin/marketing/sms-queue"
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

          {/* TABLE */}

          {smsRecords.length === 0 ? (
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
                <Smartphone size={28} />
              </div>

              <h2 className="
                mt-5
                text-lg
                font-bold
                text-slate-950
              ">
                No SMS records found
              </h2>

              <p className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-500
              ">
                SMS messages created by internal
                marketing operations will appear
                here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="
                w-full
                min-w-[1000px]
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
                      Message
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
                  {smsRecords.map(
                    (sms) => (
                      <tr
                        key={sms.id}
                        className="
                          transition
                          hover:bg-slate-50/80
                        "
                      >
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
                              items-center
                              justify-center
                              rounded-xl
                              bg-blue-50
                              text-blue-600
                            ">
                              <Smartphone
                                size={18}
                              />
                            </div>

                            <span className="
                              font-medium
                              text-slate-900
                            ">
                              {sms.phone}
                            </span>
                          </div>
                        </td>

                        <td className="
                          max-w-[360px]
                          px-5
                          py-4
                        ">
                          <p className="
                            truncate
                            text-sm
                            text-slate-600
                          ">
                            {sms.message}
                          </p>
                        </td>

                        <td className="
                          px-5
                          py-4
                          text-sm
                          text-slate-600
                        ">
                          {sms.provider ??
                            "Not assigned"}
                        </td>

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
                                sms.status
                              )}
                            `}
                          >
                            {getStatusIcon(
                              sms.status
                            )}

                            {formatStatus(
                              sms.status
                            )}
                          </span>
                        </td>

                        <td className="
                          px-5
                          py-4
                          text-sm
                          font-semibold
                          text-slate-700
                        ">
                          {sms.attempts}
                        </td>

                        <td className="
                          px-5
                          py-4
                          text-sm
                          text-slate-500
                        ">
                          {formatDate(
                            sms.createdAt
                          )}
                        </td>

                        <td className="
                          px-5
                          py-4
                          text-right
                        ">
                          <Link
                            href={`/admin/marketing/sms-queue/${sms.id}`}
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