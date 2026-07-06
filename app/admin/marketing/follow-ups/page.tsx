import Link from "next/link"
import { redirect } from "next/navigation"

import {
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  UserRound,
  XCircle,
} from "lucide-react"

import {
  DemoFollowUpStatus,
  DemoFollowUpType,
} from "@prisma/client"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

/* =========================================================
   PAGE TYPES
========================================================= */

type PageProps = {
  searchParams: Promise<{
    status?: string
    type?: string
  }>
}

/* =========================================================
   HELPERS
========================================================= */

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(date)
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(date)
}

function formatEnumLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    )
}

function isValidStatus(
  value?: string
): value is DemoFollowUpStatus {
  if (!value) {
    return false
  }

  return Object.values(
    DemoFollowUpStatus
  ).includes(
    value as DemoFollowUpStatus
  )
}

function isValidType(
  value?: string
): value is DemoFollowUpType {
  if (!value) {
    return false
  }

  return Object.values(
    DemoFollowUpType
  ).includes(
    value as DemoFollowUpType
  )
}

/* =========================================================
   STATUS BADGE
========================================================= */

function getStatusBadge(
  status: DemoFollowUpStatus
) {
  switch (status) {
    case DemoFollowUpStatus.pending:
      return {
        label: "Pending",
        className:
          "border-orange-200 bg-orange-50 text-orange-700",
      }

    case DemoFollowUpStatus.contacted:
      return {
        label: "Contacted",
        className:
          "border-blue-200 bg-blue-50 text-blue-700",
      }

    case DemoFollowUpStatus.interested:
      return {
        label: "Interested",
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
      }

    case DemoFollowUpStatus.trial:
      return {
        label: "Trial",
        className:
          "border-violet-200 bg-violet-50 text-violet-700",
      }

    case DemoFollowUpStatus.negotiation:
      return {
        label: "Negotiation",
        className:
          "border-amber-200 bg-amber-50 text-amber-700",
      }

    case DemoFollowUpStatus.won:
      return {
        label: "Won",
        className:
          "border-green-200 bg-green-50 text-green-700",
      }

    case DemoFollowUpStatus.lost:
      return {
        label: "Lost",
        className:
          "border-red-200 bg-red-50 text-red-700",
      }

    case DemoFollowUpStatus.completed:
      return {
        label: "Completed",
        className:
          "border-slate-200 bg-slate-100 text-slate-700",
      }

    default:
      return {
        label: formatEnumLabel(status),
        className:
          "border-slate-200 bg-slate-50 text-slate-700",
      }
  }
}

/* =========================================================
   TYPE BADGE
========================================================= */

function getTypeBadge(
  type: DemoFollowUpType
) {
  switch (type) {
    case DemoFollowUpType.call:
      return {
        label: "Call",
        className:
          "border-blue-200 bg-blue-50 text-blue-700",
      }

    case DemoFollowUpType.email:
      return {
        label: "Email",
        className:
          "border-violet-200 bg-violet-50 text-violet-700",
      }

    case DemoFollowUpType.sms:
      return {
        label: "SMS",
        className:
          "border-cyan-200 bg-cyan-50 text-cyan-700",
      }

    case DemoFollowUpType.whatsapp:
      return {
        label: "WhatsApp",
        className:
          "border-green-200 bg-green-50 text-green-700",
      }

    case DemoFollowUpType.meeting:
      return {
        label: "Meeting",
        className:
          "border-orange-200 bg-orange-50 text-orange-700",
      }

    case DemoFollowUpType.trial:
      return {
        label: "Trial",
        className:
          "border-indigo-200 bg-indigo-50 text-indigo-700",
      }

    case DemoFollowUpType.pricing:
      return {
        label: "Pricing",
        className:
          "border-amber-200 bg-amber-50 text-amber-700",
      }

    case DemoFollowUpType.negotiation:
      return {
        label: "Negotiation",
        className:
          "border-rose-200 bg-rose-50 text-rose-700",
      }

    default:
      return {
        label: formatEnumLabel(type),
        className:
          "border-slate-200 bg-slate-50 text-slate-700",
      }
  }
}

/* =========================================================
   PAGE
========================================================= */

export default async function MarketingFollowUpsPage({
  searchParams,
}: PageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const params = await searchParams

  const statusFilter = isValidStatus(
    params.status
  )
    ? params.status
    : undefined

  const typeFilter = isValidType(
    params.type
  )
    ? params.type
    : undefined

  /* =======================================================
     CURRENT MARKETING EMPLOYEE
  ======================================================= */

  const employee =
    await prisma.employee.findFirst({
      where: {
        userId: session.user.id,
        active: true,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    })

  if (!employee) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-lg font-bold text-red-900">
              Employee profile not found
            </h1>

            <p className="mt-2 text-sm text-red-700">
              Your user account is not connected to an active
              employee profile.
            </p>
          </div>
        </div>
      </main>
    )
  }

  /* =======================================================
     DATA
  ======================================================= */

  const [
    followUps,
    totalFollowUps,
    pendingCount,
    interestedCount,
    wonCount,
    lostCount,
  ] = await Promise.all([
    prisma.demoFollowUp.findMany({
      where: {
        marketingEmployeeId:
          employee.id,

        ...(statusFilter
          ? {
              status: statusFilter,
            }
          : {}),

        ...(typeFilter
          ? {
              type: typeFilter,
            }
          : {}),
      },

      include: {
        demoSchedule: {
          include: {
            company: true,
          },
        },
      },

      orderBy: [
        {
          followUpDate: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    }),

    prisma.demoFollowUp.count({
      where: {
        marketingEmployeeId:
          employee.id,
      },
    }),

    prisma.demoFollowUp.count({
      where: {
        marketingEmployeeId:
          employee.id,

        status:
          DemoFollowUpStatus.pending,
      },
    }),

    prisma.demoFollowUp.count({
      where: {
        marketingEmployeeId:
          employee.id,

        status:
          DemoFollowUpStatus.interested,
      },
    }),

    prisma.demoFollowUp.count({
      where: {
        marketingEmployeeId:
          employee.id,

        status:
          DemoFollowUpStatus.won,
      },
    }),

    prisma.demoFollowUp.count({
      where: {
        marketingEmployeeId:
          employee.id,

        status:
          DemoFollowUpStatus.lost,
      },
    }),
  ])

  const now = new Date()

  const overdueCount =
    followUps.filter(
      (followUp) =>
        followUp.followUpDate < now &&
        followUp.status !==
          DemoFollowUpStatus.completed &&
        followUp.status !==
          DemoFollowUpStatus.won &&
        followUp.status !==
          DemoFollowUpStatus.lost
    ).length

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1600px] space-y-6 p-6 lg:p-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-orange-600">
              Marketing / Follow-ups
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Demo Follow-ups
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Manage post-demo communication,
              trials, pricing discussions and
              negotiations.
            </p>
          </div>

          <Link
            href="/admin/marketing/demos"
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
            View My Demos

            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">

          <StatCard
            label="Total Follow-ups"
            value={totalFollowUps}
            icon={
              <CalendarClock className="h-5 w-5" />
            }
            iconClassName="bg-blue-50 text-blue-600"
          />

          <StatCard
            label="Pending"
            value={pendingCount}
            icon={
              <Clock3 className="h-5 w-5" />
            }
            iconClassName="bg-orange-50 text-orange-600"
          />

          <StatCard
            label="Interested"
            value={interestedCount}
            icon={
              <UserRound className="h-5 w-5" />
            }
            iconClassName="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            label="Won"
            value={wonCount}
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
            iconClassName="bg-green-50 text-green-600"
          />

          <StatCard
            label="Lost"
            value={lostCount}
            icon={
              <XCircle className="h-5 w-5" />
            }
            iconClassName="bg-red-50 text-red-600"
          />

          <StatCard
            label="Overdue"
            value={overdueCount}
            icon={
              <Clock3 className="h-5 w-5" />
            }
            iconClassName="bg-rose-50 text-rose-600"
          />
        </section>

        {/* =================================================
            FILTERS
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-2">

            <FilterLink
              href="/admin/marketing/follow-ups"
              label="All"
              active={
                !statusFilter &&
                !typeFilter
              }
            />

            <FilterLink
              href="/admin/marketing/follow-ups?status=pending"
              label="Pending"
              active={
                statusFilter ===
                DemoFollowUpStatus.pending
              }
            />

            <FilterLink
              href="/admin/marketing/follow-ups?status=contacted"
              label="Contacted"
              active={
                statusFilter ===
                DemoFollowUpStatus.contacted
              }
            />

            <FilterLink
              href="/admin/marketing/follow-ups?status=interested"
              label="Interested"
              active={
                statusFilter ===
                DemoFollowUpStatus.interested
              }
            />

            <FilterLink
              href="/admin/marketing/follow-ups?status=trial"
              label="Trial"
              active={
                statusFilter ===
                DemoFollowUpStatus.trial
              }
            />

            <FilterLink
              href="/admin/marketing/follow-ups?status=negotiation"
              label="Negotiation"
              active={
                statusFilter ===
                DemoFollowUpStatus.negotiation
              }
            />

            <FilterLink
              href="/admin/marketing/follow-ups?status=won"
              label="Won"
              active={
                statusFilter ===
                DemoFollowUpStatus.won
              }
            />

            <FilterLink
              href="/admin/marketing/follow-ups?status=lost"
              label="Lost"
              active={
                statusFilter ===
                DemoFollowUpStatus.lost
              }
            />
          </div>
        </section>

        {/* =================================================
            FOLLOW-UP LIST
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Follow-up Pipeline
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {followUps.length} record
                  {followUps.length === 1
                    ? ""
                    : "s"}{" "}
                  found
                </p>
              </div>

              <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                {employee.firstName}{" "}
                {employee.lastName}
              </div>
            </div>
          </div>

          {followUps.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="divide-y divide-slate-100">
              {followUps.map(
                (followUp) => {
                  const company =
                    followUp.demoSchedule
                      .company

                  const statusBadge =
                    getStatusBadge(
                      followUp.status
                    )

                  const typeBadge =
                    getTypeBadge(
                      followUp.type
                    )

                  const isOverdue =
                    followUp.followUpDate <
                      now &&
                    followUp.status !==
                      DemoFollowUpStatus.completed &&
                    followUp.status !==
                      DemoFollowUpStatus.won &&
                    followUp.status !==
                      DemoFollowUpStatus.lost

                  return (
                    <article
                      key={followUp.id}
                      className="
                        p-6
                        transition
                        hover:bg-slate-50/70
                      "
                    >
                      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

                        {/* ===============================
                            COMPANY
                        =============================== */}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="truncate text-lg font-bold text-slate-950">
                              {
                                company.companyName
                              }
                            </h3>

                            <span
                              className={`
                                rounded-full
                                border
                                px-2.5
                                py-1
                                text-xs
                                font-semibold
                                ${statusBadge.className}
                              `}
                            >
                              {
                                statusBadge.label
                              }
                            </span>

                            <span
                              className={`
                                rounded-full
                                border
                                px-2.5
                                py-1
                                text-xs
                                font-semibold
                                ${typeBadge.className}
                              `}
                            >
                              {
                                typeBadge.label
                              }
                            </span>

                            {isOverdue && (
                              <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                                Overdue
                              </span>
                            )}
                          </div>

                          {/* =============================
                              CONTACT DETAILS
                          ============================= */}

                          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">

                            <div className="flex items-center gap-2">
                              <UserRound className="h-4 w-4 text-slate-400" />

                              <span>
                                {company.ownerName ||
                                  "Contact not provided"}
                              </span>
                            </div>

                            {company.primaryEmail && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-slate-400" />

                                <span>
                                  {
                                    company.primaryEmail
                                  }
                                </span>
                              </div>
                            )}

                            {company.primaryPhone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-slate-400" />

                                <span>
                                  {company.primaryPhone}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-slate-400" />

                              <span>
                                {company.industry ||
                                  "Industry not set"}
                              </span>
                            </div>
                          </div>

                          {/* =============================
                              NOTES
                          ============================= */}

                          {followUp.notes && (
                            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Follow-up Notes
                              </p>

                              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                {
                                  followUp.notes
                                }
                              </p>
                            </div>
                          )}

                          {followUp.outcome && (
                            <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                Outcome
                              </p>

                              <p className="mt-2 text-sm leading-6 text-blue-900">
                                {
                                  followUp.outcome
                                }
                              </p>
                            </div>
                          )}
                        </div>

                        {/* ===============================
                            DATES + ACTION
                        =============================== */}

                        <div className="w-full xl:w-[280px]">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Follow-up Date
                              </p>

                              <p
                                className={`mt-1 text-sm font-bold ${
                                  isOverdue
                                    ? "text-red-600"
                                    : "text-slate-950"
                                }`}
                              >
                                {formatDateTime(
                                  followUp.followUpDate
                                )}
                              </p>
                            </div>

                            <div className="mt-4 border-t border-slate-200 pt-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Original Demo
                              </p>

                              <p className="mt-1 text-sm font-semibold text-slate-700">
                                {formatDate(
                                  followUp
                                    .demoSchedule
                                    .meetingDate
                                )}
                              </p>
                            </div>

                            <Link
                              href={`/admin/marketing/follow-ups/${followUp.id}`}
                              className="
                                mt-5
                                inline-flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
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
                              Manage Follow-up

                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                }
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  icon,
  iconClassName,
}: {
  label: string
  value: number
  icon: React.ReactNode
  iconClassName: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            ${iconClassName}
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   FILTER LINK
========================================================= */

function FilterLink({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`
        rounded-lg
        border
        px-3.5
        py-2
        text-sm
        font-semibold
        transition
        ${
          active
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        }
      `}
    >
      {label}
    </Link>
  )
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
        <CalendarClock className="h-7 w-7" />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-950">
        No follow-ups found
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        There are no follow-up activities matching the
        current filter. Follow-ups created from your demo
        workflow will appear here.
      </p>

      <Link
        href="/admin/marketing/demos"
        className="
          mt-5
          inline-flex
          items-center
          gap-2
          rounded-lg
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
        View My Demos

        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}