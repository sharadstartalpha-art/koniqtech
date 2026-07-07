import Link from "next/link"

import {
  notFound,
  redirect,
} from "next/navigation"

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Mail,
  MousePointerClick,
  Send,
  TriangleAlert,
  Users,
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

/* =========================================================
   HELPERS
========================================================= */

function formatDate(
  value: Date | null | undefined
) {
  if (!value) {
    return "Not available"
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(value)
}


function formatAudience(
  value: string
) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    )
}


function formatStatus(
  value: string
) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    )
}


function statusClass(
  status: string
) {
  switch (status) {
    case "sent":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200"

    case "sending":
    case "queued":
      return "bg-blue-50 text-blue-700 ring-blue-200"

    case "scheduled":
      return "bg-amber-50 text-amber-700 ring-amber-200"

    case "failed":
    case "partially_failed":
      return "bg-red-50 text-red-700 ring-red-200"

    case "cancelled":
      return "bg-slate-100 text-slate-600 ring-slate-200"

    default:
      return "bg-violet-50 text-violet-700 ring-violet-200"
  }
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
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
              font-medium
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
              tracking-tight
              text-slate-950
            "
          >
            {value}
          </p>
        </div>

        <div
          className="
            rounded-xl
            bg-slate-50
            p-3
            text-slate-600
          "
        >
          {icon}
        </div>
      </div>
    </div>
  )
}


/* =========================================================
   PAGE
========================================================= */

export default async function NewsletterDetailPage({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {
  /* =====================================================
     AUTH
  ===================================================== */

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/admin/dashboard")
  }

  const { id } = await params

  /* =====================================================
     NEWSLETTER
  ===================================================== */

  const newsletter =
    await prisma.marketingNewsletter.findFirst({
      where: {
        id,
        orgId,
      },

      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

  if (!newsletter) {
    notFound()
  }

  /* =====================================================
     CALCULATIONS
  ===================================================== */

  const deliveryRate =
    newsletter.recipientCount > 0
      ? (
          (newsletter.sentCount /
            newsletter.recipientCount) *
          100
        ).toFixed(1)
      : "0.0"

  const openRate =
    newsletter.sentCount > 0
      ? (
          (newsletter.openedCount /
            newsletter.sentCount) *
          100
        ).toFixed(1)
      : "0.0"

  const clickRate =
    newsletter.sentCount > 0
      ? (
          (newsletter.clickedCount /
            newsletter.sentCount) *
          100
        ).toFixed(1)
      : "0.0"

  return (
    <div
      className="
        min-h-screen
        bg-slate-50/70
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
          space-y-6
          p-6
          lg:p-8
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-start
            lg:justify-between
          "
        >
          <div>
            <Link
              href="/admin/marketing/newsletter"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-blue-600
                transition
                hover:text-blue-700
              "
            >
              <ArrowLeft className="h-4 w-4" />

              Back to newsletters
            </Link>

            <div
              className="
                mt-4
                flex
                flex-wrap
                items-center
                gap-3
              "
            >
              <h1
                className="
                  text-3xl
                  font-bold
                  tracking-tight
                  text-slate-950
                "
              >
                {newsletter.title}
              </h1>

              <span
                className={`
                  inline-flex
                  items-center
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  ring-1
                  ring-inset
                  ${statusClass(
                    newsletter.status
                  )}
                `}
              >
                {formatStatus(
                  newsletter.status
                )}
              </span>
            </div>

            <p
              className="
                mt-2
                max-w-3xl
                text-sm
                text-slate-500
              "
            >
              {newsletter.subject}
            </p>
          </div>

          <div
            className="
              flex
              flex-wrap
              gap-3
            "
          >
            <Link
              href={`/admin/marketing/newsletter/${newsletter.id}/edit`}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-blue-200
                bg-blue-50
                px-4
                py-2.5
                text-sm
                font-semibold
                text-blue-700
                transition
                hover:bg-blue-100
              "
            >
              <FileText className="h-4 w-4" />

              Edit Newsletter
            </Link>
          </div>
        </div>

        {/* =================================================
            PRIMARY STATS
        ================================================= */}

        <div
          className="
            grid
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <StatCard
            title="Recipients"
            value={
              newsletter.recipientCount
            }
            icon={
              <Users className="h-5 w-5" />
            }
          />

          <StatCard
            title="Delivered"
            value={
              newsletter.sentCount
            }
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
          />

          <StatCard
            title="Opened"
            value={
              newsletter.openedCount
            }
            icon={
              <Eye className="h-5 w-5" />
            }
          />

          <StatCard
            title="Clicked"
            value={
              newsletter.clickedCount
            }
            icon={
              <MousePointerClick className="h-5 w-5" />
            }
          />
        </div>

        {/* =================================================
            PERFORMANCE
        ================================================= */}

        <div
          className="
            grid
            gap-4
            md:grid-cols-3
          "
        >
          <div
            className="
              rounded-2xl
              border
              border-emerald-200
              bg-emerald-50
              p-5
            "
          >
            <p
              className="
                text-sm
                font-semibold
                text-emerald-700
              "
            >
              Delivery Rate
            </p>

            <p
              className="
                mt-2
                text-3xl
                font-bold
                text-emerald-950
              "
            >
              {deliveryRate}%
            </p>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-blue-200
              bg-blue-50
              p-5
            "
          >
            <p
              className="
                text-sm
                font-semibold
                text-blue-700
              "
            >
              Open Rate
            </p>

            <p
              className="
                mt-2
                text-3xl
                font-bold
                text-blue-950
              "
            >
              {openRate}%
            </p>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-orange-200
              bg-orange-50
              p-5
            "
          >
            <p
              className="
                text-sm
                font-semibold
                text-orange-700
              "
            >
              Click Rate
            </p>

            <p
              className="
                mt-2
                text-3xl
                font-bold
                text-orange-950
              "
            >
              {clickRate}%
            </p>
          </div>
        </div>

        {/* =================================================
            CONTENT GRID
        ================================================= */}

        <div
          className="
            grid
            gap-6
            xl:grid-cols-[minmax(0,1fr)_360px]
          "
        >
          {/* ===============================================
              EMAIL PREVIEW
          =============================================== */}

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <div
              className="
                border-b
                border-slate-200
                px-6
                py-5
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
                    rounded-xl
                    bg-blue-50
                    p-2.5
                    text-blue-600
                  "
                >
                  <Mail className="h-5 w-5" />
                </div>

                <div>
                  <h2
                    className="
                      font-semibold
                      text-slate-950
                    "
                  >
                    Newsletter Preview
                  </h2>

                  <p
                    className="
                      text-sm
                      text-slate-500
                    "
                  >
                    Preview of the email content
                  </p>
                </div>
              </div>
            </div>

            <div
              className="
                border-b
                border-slate-100
                bg-slate-50
                px-6
                py-4
              "
            >
              <div
                className="
                  space-y-2
                  text-sm
                "
              >
                <div
                  className="
                    flex
                    gap-3
                  "
                >
                  <span
                    className="
                      w-16
                      font-medium
                      text-slate-500
                    "
                  >
                    Subject
                  </span>

                  <span
                    className="
                      font-medium
                      text-slate-900
                    "
                  >
                    {newsletter.subject}
                  </span>
                </div>

                {newsletter.previewText && (
                  <div
                    className="
                      flex
                      gap-3
                    "
                  >
                    <span
                      className="
                        w-16
                        font-medium
                        text-slate-500
                      "
                    >
                      Preview
                    </span>

                    <span
                      className="
                        text-slate-700
                      "
                    >
                      {
                        newsletter.previewText
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <div
                className="
                  min-h-[320px]
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                "
                dangerouslySetInnerHTML={{
                  __html:
                    newsletter.content,
                }}
              />
            </div>
          </div>

          {/* ===============================================
              SIDEBAR
          =============================================== */}

          <div className="space-y-6">
            {/* DETAILS */}

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
              "
            >
              <h2
                className="
                  text-lg
                  font-semibold
                  text-slate-950
                "
              >
                Newsletter Details
              </h2>

              <div
                className="
                  mt-5
                  space-y-5
                "
              >
                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <Users
                    className="
                      mt-0.5
                      h-4
                      w-4
                      text-slate-400
                    "
                  />

                  <div>
                    <p
                      className="
                        text-xs
                        font-medium
                        uppercase
                        tracking-wide
                        text-slate-400
                      "
                    >
                      Audience
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-semibold
                        text-slate-800
                      "
                    >
                      {formatAudience(
                        newsletter.audience
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <CalendarDays
                    className="
                      mt-0.5
                      h-4
                      w-4
                      text-slate-400
                    "
                  />

                  <div>
                    <p
                      className="
                        text-xs
                        font-medium
                        uppercase
                        tracking-wide
                        text-slate-400
                      "
                    >
                      Created
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-semibold
                        text-slate-800
                      "
                    >
                      {formatDate(
                        newsletter.createdAt
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <Clock3
                    className="
                      mt-0.5
                      h-4
                      w-4
                      text-slate-400
                    "
                  />

                  <div>
                    <p
                      className="
                        text-xs
                        font-medium
                        uppercase
                        tracking-wide
                        text-slate-400
                      "
                    >
                      Scheduled
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-semibold
                        text-slate-800
                      "
                    >
                      {formatDate(
                        newsletter.scheduledAt
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <Send
                    className="
                      mt-0.5
                      h-4
                      w-4
                      text-slate-400
                    "
                  />

                  <div>
                    <p
                      className="
                        text-xs
                        font-medium
                        uppercase
                        tracking-wide
                        text-slate-400
                      "
                    >
                      Sent
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-semibold
                        text-slate-800
                      "
                    >
                      {formatDate(
                        newsletter.sentAt
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* DELIVERY */}

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
              "
            >
              <h2
                className="
                  text-lg
                  font-semibold
                  text-slate-950
                "
              >
                Delivery Summary
              </h2>

              <div
                className="
                  mt-5
                  space-y-4
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      text-sm
                      text-slate-500
                    "
                  >
                    Recipients
                  </span>

                  <span
                    className="
                      font-semibold
                      text-slate-900
                    "
                  >
                    {
                      newsletter.recipientCount
                    }
                  </span>
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      text-sm
                      text-slate-500
                    "
                  >
                    Sent
                  </span>

                  <span
                    className="
                      font-semibold
                      text-emerald-700
                    "
                  >
                    {
                      newsletter.sentCount
                    }
                  </span>
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      text-sm
                      text-slate-500
                    "
                  >
                    Failed
                  </span>

                  <span
                    className="
                      font-semibold
                      text-red-600
                    "
                  >
                    {
                      newsletter.failedCount
                    }
                  </span>
                </div>
              </div>

              {newsletter.failedCount >
                0 && (
                <div
                  className="
                    mt-5
                    flex
                    gap-3
                    rounded-xl
                    border
                    border-orange-200
                    bg-orange-50
                    p-4
                  "
                >
                  <TriangleAlert
                    className="
                      mt-0.5
                      h-5
                      w-5
                      shrink-0
                      text-orange-600
                    "
                  />

                  <p
                    className="
                      text-sm
                      text-orange-800
                    "
                  >
                    Some newsletter deliveries
                    failed. Check the email queue
                    for delivery errors.
                  </p>
                </div>
              )}
            </div>

            {/* CREATED BY */}

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
              "
            >
              <h2
                className="
                  text-lg
                  font-semibold
                  text-slate-950
                "
              >
                Created By
              </h2>

              <div className="mt-4">
                <p
                  className="
                    font-semibold
                    text-slate-900
                  "
                >
                  {newsletter.createdBy
                    ?.name ||
                    "System User"}
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  {newsletter.createdBy
                    ?.email ||
                    "No email available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}