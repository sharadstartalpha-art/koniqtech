import Link from "next/link"
import { redirect } from "next/navigation"

import {
  ArrowRight,
  Clock3,
  Mail,
  Megaphone,
  Send,
  Users,
} from "lucide-react"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"

import EmailComposer from "./components/EmailComposer"

/* =========================================================
   TYPES
========================================================= */

type EmailCenterPageProps = {
  searchParams?: Promise<{
    campaignId?: string
  }>
}

/* =========================================================
   HELPERS
========================================================= */

function getInitials(
  value: string
) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("")
}

/* =========================================================
   PAGE
========================================================= */

export default async function MarketingEmailCenterPage({
  searchParams,
}: EmailCenterPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const userId =
    session.user.id

  const orgId =
    session.user.orgId

  if (!userId || !orgId) {
    redirect("/login")
  }

  const params =
    searchParams
      ? await searchParams
      : {}

  const selectedCampaignId =
    params.campaignId || null

  /* =======================================================
     DATA
  ======================================================= */

  const [
    recipientsRaw,
    campaigns,
    queueCount,
    sentCount,
    failedCount,
    recentQueue,
  ] = await Promise.all([
    prisma.companyLead.findMany({
      where: {
        orgId,

        primaryEmail: {
          not: null,
        },
      },

      select: {
        id: true,
        companyName: true,
        ownerName: true,
        primaryEmail: true,
        industry: true,
        city: true,
        state: true,
        country: true,
      },

      orderBy: {
        companyName: "asc",
      },

      take: 500,
    }),

    prisma.marketingCampaign.findMany({
      where: {
        orgId,
      },

      select: {
        id: true,
        title: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.userEmailQueue.count({
      where: {
        orgId,

        status: {
          in: [
            "pending",
            "queued",
          ],
        },
      },
    }),

    prisma.userEmailQueue.count({
      where: {
        orgId,
        status: "sent",
      },
    }),

    prisma.userEmailQueue.count({
      where: {
        orgId,
        status: "failed",
      },
    }),

    prisma.userEmailQueue.findMany({
      where: {
        orgId,
      },

      select: {
        id: true,
        toEmail: true,
        subject: true,
        status: true,
        scheduledAt: true,
        sentAt: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 8,
    }),
  ])

  /* =======================================================
     NORMALIZE RECIPIENTS
  ======================================================= */

  const recipients =
    recipientsRaw.flatMap(
      (recipient) => {
        if (
          !recipient.primaryEmail
        ) {
          return []
        }

        return [
          {
            id:
              recipient.id,

            companyName:
              recipient.companyName,

            ownerName:
              recipient.ownerName,

            primaryEmail:
              recipient.primaryEmail,

            industry:
              recipient.industry,

            city:
              recipient.city,

            state:
              recipient.state,

            country:
              recipient.country,
          },
        ]
      }
    )

  /* =======================================================
     STATS
  ======================================================= */

  const stats = [
    {
      label:
        "Available Recipients",

      value:
        recipients.length,

      icon:
        Users,

      iconClass:
        "bg-blue-50 text-blue-600",
    },

    {
      label:
        "Active Campaigns",

      value:
        campaigns.length,

      icon:
        Megaphone,

      iconClass:
        "bg-orange-50 text-orange-600",
    },

    {
      label:
        "Queued Emails",

      value:
        queueCount,

      icon:
        Clock3,

      iconClass:
        "bg-orange-50 text-orange-600",
    },

    {
      label:
        "Sent Emails",

      value:
        sentCount,

      icon:
        Send,

      iconClass:
        "bg-green-50 text-green-600",
    },
  ]

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50/70">
      <div className="mx-auto max-w-[1600px] space-y-7 p-6 lg:p-8">
        {/* ===============================================
            HEADER
        =============================================== */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <span>
                Marketing
              </span>

              <ArrowRight className="h-3.5 w-3.5" />

              <span>
                Email Center
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Email Center
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Compose, personalize,
              schedule, and queue
              marketing emails for
              company leads.
            </p>
          </div>

          <Link
            href="/admin/marketing/campaigns"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Megaphone className="h-4 w-4" />

            View Campaigns
          </Link>
        </div>

        {/* ===============================================
            STATS
        =============================================== */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon =
              stat.icon

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {
                        stat.label
                      }
                    </p>

                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                      {
                        stat.value
                      }
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ===============================================
            FAILURE NOTICE
        =============================================== */}

        {failedCount > 0 && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-red-600" />

              <div>
                <p className="text-sm font-semibold text-red-900">
                  Email delivery
                  attention required
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {failedCount} email
                  {failedCount === 1
                    ? ""
                    : "s"}{" "}
                  currently have failed
                  status.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===============================================
            COMPOSER
        =============================================== */}

        <EmailComposer
          recipients={recipients}
          campaigns={campaigns}
        />

        {/* ===============================================
            RECENT EMAIL ACTIVITY
        =============================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="font-semibold text-slate-950">
                Recent Email Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest queued and sent
                marketing emails
              </p>
            </div>

            <Mail className="h-5 w-5 text-slate-400" />
          </div>

          {recentQueue.length ===
          0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                <Mail className="h-6 w-6 text-slate-400" />
              </div>

              <p className="mt-4 font-semibold text-slate-900">
                No email activity
                yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Queued emails will
                appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentQueue.map(
                (email) => {
                  const status =
                    email.status.toLowerCase()

                  const statusClass =
                    status === "sent"
                      ? "bg-green-50 text-green-700"
                      : status ===
                          "failed"
                        ? "bg-red-50 text-red-700"
                        : status ===
                            "sending"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-orange-50 text-orange-700"

                  const displayDate =
                    email.sentAt ||
                    email.scheduledAt ||
                    email.createdAt

                  return (
                    <div
                      key={email.id}
                      className="flex flex-col gap-4 px-6 py-4 transition hover:bg-slate-50/80 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                          {getInitials(
                            email.toEmail
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {
                              email.subject
                            }
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            To:{" "}
                            {
                              email.toEmail
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pl-14 md:pl-0">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClass}`}
                        >
                          {
                            email.status
                          }
                        </span>

                        <span className="whitespace-nowrap text-xs text-slate-400">
                          {displayDate.toLocaleString(
                            "en-US",
                            {
                              month:
                                "short",
                              day:
                                "numeric",
                              hour:
                                "numeric",
                              minute:
                                "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          )}
        </section>

        {/* ===============================================
            SELECTED CAMPAIGN INFO
        =============================================== */}

        {selectedCampaignId && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Email Center opened from
            campaign context. Select
            the matching campaign in
            the composer before
            queueing the email batch.
          </div>
        )}
      </div>
    </div>
  )
}