import Link from "next/link"

import {
  notFound,
  redirect,
} from "next/navigation"

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Edit3,
  Eye,
  FileText,
  Hash,
  LayoutTemplate,
  Mail,
  Sparkles,
} from "lucide-react"

import {
  MarketingTemplateCategory,
  MarketingTemplateStatus,
} from "@prisma/client"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import TemplateStatusControls from "./components/TemplateStatusControls"
import TemplateDuplicateButton from "./components/TemplateDuplicateButton"
import TemplateDeleteButton from "./components/TemplateDeleteButton"

/* =========================================================
   TYPES
========================================================= */

type TemplateDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

/* =========================================================
   CATEGORY LABELS
========================================================= */

const CATEGORY_LABELS: Record<
  MarketingTemplateCategory,
  string
> = {
  campaign: "Campaign",

  newsletter: "Newsletter",

  demo_invitation:
    "Demo Invitation",

  demo_reminder:
    "Demo Reminder",

  follow_up:
    "Follow-up",

  sales_outreach:
    "Sales Outreach",

  trial:
    "Trial",

  onboarding:
    "Onboarding",

  re_engagement:
    "Re-engagement",

  custom:
    "Custom",
}

/* =========================================================
   PAGE
========================================================= */

export default async function MarketingTemplateDetailPage({
  params,
}: TemplateDetailPageProps) {
  /* =======================================================
     AUTH
  ======================================================= */

  const session =
    await auth()

  const userId =
    (
      session?.user as {
        id?: string
      } | undefined
    )?.id

  if (!userId) {
    redirect("/login")
  }

  /* =======================================================
     USER CONTEXT
  ======================================================= */

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        orgId: true,
      },
    })

  if (!user?.orgId) {
    redirect("/login")
  }

  /* =======================================================
     PARAMS
  ======================================================= */

  const {
    id,
  } = await params

  /* =======================================================
     TEMPLATE
  ======================================================= */

  const template =
    await prisma.marketingTemplate.findFirst({
      where: {
        id,
        orgId: user.orgId,
      },

      select: {
        id: true,

        name: true,

        description: true,

        category: true,

        subject: true,

        previewText: true,

        content: true,

        status: true,

        usageCount: true,

        createdAt: true,

        updatedAt: true,

        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

  if (!template) {
    notFound()
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50">
      <div
        className="
          mx-auto
          max-w-[1500px]
          space-y-7
          px-6
          py-8
          lg:px-8
        "
      >
        {/* ===============================================
            BACK
        =============================================== */}

        <Link
          href="/admin/marketing/templates"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-slate-500
            transition
            hover:text-blue-600
          "
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Templates
        </Link>

        {/* ===============================================
            HEADER
        =============================================== */}

        <div
          className="
            flex
            flex-col
            gap-5
            xl:flex-row
            xl:items-start
            xl:justify-between
          "
        >
          {/* LEFT */}

          <div
            className="
              flex
              items-start
              gap-4
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-orange-50
                text-orange-600
              "
            >
              <LayoutTemplate className="h-7 w-7" />
            </div>

            <div>
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-orange-50
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-orange-700
                  "
                >
                  <Sparkles className="h-3.5 w-3.5" />

                  {
                    CATEGORY_LABELS[
                      template.category
                    ]
                  }
                </span>

                <StatusBadge
                  status={
                    template.status
                  }
                />
              </div>

              <h1
                className="
                  mt-3
                  text-3xl
                  font-bold
                  tracking-tight
                  text-slate-950
                "
              >
                {template.name}
              </h1>

              <p
                className="
                  mt-2
                  max-w-3xl
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                {template.description ||
                  "No description has been added to this template."}
              </p>
            </div>
          </div>

          {/* =============================================
              HEADER ACTIONS
          ============================================= */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
            "
          >
            <TemplateDuplicateButton
              templateId={
                template.id
              }
              templateName={
                template.name
              }
            />

            <Link
              href={`/admin/marketing/templates/${template.id}/edit`}
              className="
                inline-flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-orange-600
                px-5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-orange-700
              "
            >
              <Edit3 className="h-4 w-4" />

              Edit Template
            </Link>

            <TemplateDeleteButton
              templateId={
                template.id
              }
              templateName={
                template.name
              }
            />
          </div>
        </div>

        {/* ===============================================
            METRICS
        =============================================== */}

        <div
          className="
            grid
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <MetricCard
            icon={
              <Hash className="h-5 w-5" />
            }
            label="Usage Count"
            value={`${template.usageCount}`}
            iconClassName="
              bg-blue-50
              text-blue-600
            "
          />

          <MetricCard
            icon={
              <FileText className="h-5 w-5" />
            }
            label="Category"
            value={
              CATEGORY_LABELS[
                template.category
              ]
            }
            iconClassName="
              bg-orange-50
              text-orange-600
            "
          />

          <MetricCard
            icon={
              <CalendarDays className="h-5 w-5" />
            }
            label="Created"
            value={formatShortDate(
              template.createdAt
            )}
            iconClassName="
              bg-green-50
              text-green-600
            "
          />

          <MetricCard
            icon={
              <Clock3 className="h-5 w-5" />
            }
            label="Last Updated"
            value={formatShortDate(
              template.updatedAt
            )}
            iconClassName="
              bg-blue-50
              text-blue-600
            "
          />
        </div>

        {/* ===============================================
            MAIN GRID
        =============================================== */}

        <div
          className="
            grid
            gap-6
            xl:grid-cols-[minmax(0,1fr)_350px]
          "
        >
          {/* =============================================
              LEFT COLUMN
          ============================================= */}

          <div className="space-y-6">
            {/* ===========================================
                EMAIL INFORMATION
            =========================================== */}

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
              <div
                className="
                  flex
                  items-center
                  gap-3
                  border-b
                  border-slate-200
                  px-6
                  py-5
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                  "
                >
                  <Mail className="h-5 w-5" />
                </div>

                <div>
                  <h2
                    className="
                      font-bold
                      text-slate-950
                    "
                  >
                    Message Information
                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    Subject and inbox
                    preview settings.
                  </p>
                </div>
              </div>

              <div
                className="
                  grid
                  gap-0
                  divide-y
                  divide-slate-100
                "
              >
                <MessageField
                  label="Subject"
                  value={
                    template.subject ||
                    "No subject"
                  }
                />

                <MessageField
                  label="Preview Text"
                  value={
                    template.previewText ||
                    "No preview text"
                  }
                />
              </div>
            </section>

            {/* ===========================================
                CONTENT PREVIEW
            =========================================== */}

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
              {/* HEADER */}

              <div
                className="
                  flex
                  flex-col
                  gap-4
                  border-b
                  border-slate-200
                  px-6
                  py-5
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
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
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-green-50
                      text-green-600
                    "
                  >
                    <Eye className="h-5 w-5" />
                  </div>

                  <div>
                    <h2
                      className="
                        font-bold
                        text-slate-950
                      "
                    >
                      Template Content
                    </h2>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                      "
                    >
                      Preview of the reusable
                      message content.
                    </p>
                  </div>
                </div>

                <span
                  className="
                    rounded-full
                    bg-slate-100
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-slate-600
                  "
                >
                  {
                    template.content
                      .length
                  }{" "}
                  characters
                </span>
              </div>

              {/* =========================================
                  EMAIL PREVIEW
              ========================================= */}

              <div className="p-6">
                <div
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                  "
                >
                  {/* EMAIL HEADER */}

                  <div
                    className="
                      border-b
                      border-slate-200
                      bg-slate-50
                      px-5
                      py-4
                    "
                  >
                    <div
                      className="
                        grid
                        gap-3
                      "
                    >
                      <EmailPreviewRow
                        label="Subject"
                        value={
                          template.subject ||
                          "No subject"
                        }
                      />

                      {template.previewText && (
                        <EmailPreviewRow
                          label="Preview"
                          value={
                            template.previewText
                          }
                        />
                      )}
                    </div>
                  </div>

                  {/* EMAIL BODY */}

                  <div
                    className="
                      min-h-[420px]
                      whitespace-pre-wrap
                      break-words
                      px-7
                      py-7
                      text-sm
                      leading-7
                      text-slate-700
                    "
                  >
                    {
                      template.content
                    }
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* =============================================
              RIGHT COLUMN
          ============================================= */}

          <aside className="space-y-5">
            {/* STATUS CONTROLS */}

            <TemplateStatusControls
              templateId={
                template.id
              }
              currentStatus={
                template.status
              }
            />

            {/* ===========================================
                TEMPLATE DETAILS
            =========================================== */}

            <section
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
              "
            >
              <h2
                className="
                  font-bold
                  text-slate-950
                "
              >
                Template Details
              </h2>

              <div
                className="
                  mt-5
                  divide-y
                  divide-slate-100
                "
              >
                <DetailRow
                  label="Category"
                  value={
                    CATEGORY_LABELS[
                      template.category
                    ]
                  }
                />

                <DetailRow
                  label="Status"
                  value={
                    formatStatus(
                      template.status
                    )
                  }
                />

                <DetailRow
                  label="Usage Count"
                  value={`${template.usageCount}`}
                />

                <DetailRow
                  label="Created"
                  value={formatDate(
                    template.createdAt
                  )}
                />

                <DetailRow
                  label="Updated"
                  value={formatDate(
                    template.updatedAt
                  )}
                />
              </div>
            </section>

            {/* ===========================================
                CREATED BY
            =========================================== */}

            <section
              className="
                rounded-2xl
                border
                border-blue-200
                bg-blue-50
                p-5
              "
            >
              <h2
                className="
                  font-bold
                  text-blue-950
                "
              >
                Created By
              </h2>

              {template.createdBy ? (
                <div className="mt-4">
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
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-600
                        text-sm
                        font-bold
                        text-white
                      "
                    >
                      {getInitials(
                        template.createdBy.name
                      )}
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-sm
                          font-bold
                          text-blue-950
                        "
                      >
                        {
                          template
                            .createdBy
                            .name
                        }
                      </p>

                      <p
                        className="
                          mt-0.5
                          truncate
                          text-xs
                          text-blue-700
                        "
                      >
                        {
                          template
                            .createdBy
                            .email
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p
                  className="
                    mt-3
                    text-sm
                    leading-6
                    text-blue-800
                  "
                >
                  Creator information is
                  not available for this
                  template.
                </p>
              )}
            </section>

            {/* ===========================================
                QUICK ACTIONS
            =========================================== */}

            <section
              className="
                rounded-2xl
                border
                border-orange-200
                bg-orange-50
                p-5
              "
            >
              <h2
                className="
                  font-bold
                  text-orange-950
                "
              >
                Quick Actions
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-orange-800
                "
              >
                Edit the template, create
                a reusable copy, or manage
                its availability using the
                status controls.
              </p>

              <Link
                href={`/admin/marketing/templates/${template.id}/edit`}
                className="
                  mt-4
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-orange-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-orange-700
                "
              >
                <Edit3 className="h-4 w-4" />

                Edit Template
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status:
    MarketingTemplateStatus
}) {
  const styles: Record<
    MarketingTemplateStatus,
    string
  > = {
    active:
      "bg-green-50 text-green-700 ring-green-200",

    inactive:
      "bg-orange-50 text-orange-700 ring-orange-200",

    archived:
      "bg-blue-50 text-blue-700 ring-blue-200",
  }

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        capitalize
        ring-1
        ring-inset
        ${styles[status]}
      `}
    >
      {formatStatus(status)}
    </span>
  )
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  icon,
  label,
  value,
  iconClassName,
}: {
  icon: React.ReactNode

  label: string

  value: string

  iconClassName: string
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
          items-center
          gap-3
        "
      >
        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${iconClassName}
          `}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p
            className="
              text-xs
              font-medium
              text-slate-500
            "
          >
            {label}
          </p>

          <p
            className="
              mt-1
              truncate
              text-base
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

/* =========================================================
   MESSAGE FIELD
========================================================= */

function MessageField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div
      className="
        grid
        gap-2
        px-6
        py-5
        md:grid-cols-[150px_minmax(0,1fr)]
      "
    >
      <p
        className="
          text-sm
          font-semibold
          text-slate-500
        "
      >
        {label}
      </p>

      <p
        className="
          break-words
          text-sm
          font-medium
          leading-6
          text-slate-800
        "
      >
        {value}
      </p>
    </div>
  )
}

/* =========================================================
   EMAIL PREVIEW ROW
========================================================= */

function EmailPreviewRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div
      className="
        flex
        items-start
        gap-3
      "
    >
      <span
        className="
          w-16
          shrink-0
          text-xs
          font-semibold
          uppercase
          tracking-wide
          text-slate-400
        "
      >
        {label}
      </span>

      <span
        className="
          break-words
          text-sm
          font-medium
          text-slate-800
        "
      >
        {value}
      </span>
    </div>
  )
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-4
        py-3
        first:pt-0
        last:pb-0
      "
    >
      <span
        className="
          text-sm
          text-slate-500
        "
      >
        {label}
      </span>

      <span
        className="
          max-w-[190px]
          text-right
          text-sm
          font-semibold
          text-slate-800
        "
      >
        {value}
      </span>
    </div>
  )
}

/* =========================================================
   FORMAT STATUS
========================================================= */

function formatStatus(
  status: MarketingTemplateStatus
) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    )
}

/* =========================================================
   SHORT DATE
========================================================= */

function formatShortDate(
  value: Date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(value)
}

/* =========================================================
   FULL DATE
========================================================= */

function formatDate(
  value: Date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(value)
}

/* =========================================================
   INITIALS
========================================================= */

function getInitials(
  name: string
) {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0)
      )
      .join("")
      .toUpperCase()

  return initials || "U"
}