import Link from "next/link"
import { notFound } from "next/navigation"

import {
  ArrowLeft,
  CalendarClock,
  FileEdit,
  Mail,
  Users,
} from "lucide-react"

import prisma from "@/shared/lib/prisma"

import NewsletterEditForm from "./components/NewsletterEditForm"

/* =========================================================
   TYPES
========================================================= */

type NewsletterEditPageProps = {
  params: Promise<{
    id: string
  }>
}

/* =========================================================
   HELPERS
========================================================= */

function formatDate(
  date: Date | null
) {
  if (!date) {
    return "Not scheduled"
  }

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

function formatAudience(
  audience: string
) {
  switch (audience) {
    case "all":
      return "All Contacts"

    case "prospects":
      return "Prospects"

    case "customers":
      return "Customers"

    case "trial":
      return "Trial Customers"

    case "inactive":
      return "Inactive Customers"

    default:
      return audience
  }
}

function formatStatus(
  status: string
) {
  return status
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ")
}

function getStatusClasses(
  status: string
) {
  switch (status) {
    case "draft":
      return `
        border-slate-200
        bg-slate-50
        text-slate-700
      `

    case "scheduled":
      return `
        border-blue-200
        bg-blue-50
        text-blue-700
      `

    case "queued":
      return `
        border-blue-200
        bg-blue-50
        text-blue-700
      `

    case "sending":
      return `
        border-orange-200
        bg-orange-50
        text-orange-700
      `

    case "sent":
      return `
        border-green-200
        bg-green-50
        text-green-700
      `

    case "partially_failed":
      return `
        border-orange-200
        bg-orange-50
        text-orange-700
      `

    case "failed":
      return `
        border-red-200
        bg-red-50
        text-red-700
      `

    case "cancelled":
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

/* =========================================================
   PAGE
========================================================= */

export default async function NewsletterEditPage({
  params,
}: NewsletterEditPageProps) {
  const { id } = await params

  /* =======================================================
     LOAD NEWSLETTER
  ======================================================= */

  const newsletter =
    await prisma.marketingNewsletter.findUnique({
      where: {
        id,
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

  /* =======================================================
     EDIT RULES
  ======================================================= */

  const isLocked =
    newsletter.status === "sent" ||
    newsletter.status === "sending"

  /* =======================================================
     SERIALIZABLE FORM DATA
  ======================================================= */

  const formData = {
    id: newsletter.id,

    title: newsletter.title,

    subject: newsletter.subject,

    previewText:
      newsletter.previewText ?? "",

    content: newsletter.content,

    audience: newsletter.audience,

    status: newsletter.status,

    scheduledAt:
      newsletter.scheduledAt
        ? newsletter.scheduledAt
            .toISOString()
            .slice(0, 16)
        : "",
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        space-y-6
        p-6
        lg:p-8
      "
    >
      {/* =================================================
          BACK LINK
      ================================================= */}

      <Link
        href={`/admin/marketing/newsletter/${newsletter.id}`}
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-semibold
          text-slate-600
          transition
          hover:text-blue-600
        "
      >
        <ArrowLeft className="h-4 w-4" />

        Back to Newsletter
      </Link>

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-start
          lg:justify-between
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
            Marketing / Newsletter
          </p>

          <div
            className="
              mt-1
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
              Edit Newsletter
            </h1>

            <span
              className={`
                inline-flex
                items-center
                rounded-full
                border
                px-3
                py-1
                text-xs
                font-semibold
                ${getStatusClasses(
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
              max-w-2xl
              text-sm
              leading-6
              text-slate-500
            "
          >
            Update newsletter content,
            audience selection, subject,
            preview text, and delivery
            schedule.
          </p>
        </div>

        <Link
          href={`/admin/marketing/newsletter/${newsletter.id}`}
          className="
            inline-flex
            items-center
            justify-center
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
          <Mail className="h-4 w-4" />

          View Newsletter
        </Link>
      </div>

      {/* =================================================
          LOCK WARNING
      ================================================= */}

      {isLocked && (
        <div
          className="
            rounded-2xl
            border
            border-orange-200
            bg-orange-50
            p-5
          "
        >
          <div
            className="
              flex
              items-start
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
                rounded-xl
                bg-orange-100
              "
            >
              <FileEdit
                className="
                  h-5
                  w-5
                  text-orange-700
                "
              />
            </div>

            <div>
              <h2
                className="
                  font-bold
                  text-orange-950
                "
              >
                Newsletter editing restricted
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-orange-800
                "
              >
                This newsletter is currently{" "}
                <strong>
                  {formatStatus(
                    newsletter.status
                  )}
                </strong>
                . Newsletters that are sending
                or already sent should not have
                their delivery content changed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div
        className="
          grid
          gap-4
          md:grid-cols-3
        "
      >
        <SummaryCard
          title="Audience"
          value={formatAudience(
            newsletter.audience
          )}
          icon={Users}
        />

        <SummaryCard
          title="Recipients"
          value={new Intl.NumberFormat(
            "en-US"
          ).format(
            newsletter.recipientCount
          )}
          icon={Mail}
        />

        <SummaryCard
          title="Scheduled"
          value={formatDate(
            newsletter.scheduledAt
          )}
          icon={CalendarClock}
        />
      </div>

      {/* =================================================
          FORM CARD
      ================================================= */}

      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
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
          <h2
            className="
              text-lg
              font-bold
              text-slate-950
            "
          >
            Newsletter Details
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Edit the newsletter information
            and save your changes.
          </p>
        </div>

        <div className="p-6">
          <NewsletterEditForm
            newsletter={formData}
            disabled={isLocked}
          />
        </div>
      </div>

      {/* =================================================
          CREATED BY
      ================================================= */}

      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                text-sm
                font-semibold
                text-slate-950
              "
            >
              Newsletter Information
            </p>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Created{" "}
              {formatDate(
                newsletter.createdAt
              )}
            </p>
          </div>

          {newsletter.createdBy && (
            <div
              className="
                rounded-xl
                bg-slate-50
                px-4
                py-3
              "
            >
              <p
                className="
                  text-xs
                  font-medium
                  text-slate-500
                "
              >
                Created by
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-semibold
                  text-slate-950
                "
              >
                {newsletter.createdBy.name ??
                  newsletter.createdBy.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: string
  icon: React.ComponentType<{
    className?: string
  }>
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
      "
    >
      <div
        className="
          flex
          items-center
          gap-4
        "
      >
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-blue-50
          "
        >
          <Icon
            className="
              h-5
              w-5
              text-blue-600
            "
          />
        </div>

        <div className="min-w-0">
          <p
            className="
              text-xs
              font-medium
              text-slate-500
            "
          >
            {title}
          </p>

          <p
            className="
              mt-1
              truncate
              text-sm
              font-bold
              text-slate-950
            "
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}