import Link from "next/link"
import { redirect } from "next/navigation"

import {
  Archive,
  BarChart3,
  Copy,
  FileText,
  Filter,
  LayoutTemplate,
  Mail,
  Megaphone,
  MessageSquare,
  Plus,
  Search,
  Send,
  Sparkles,
  Users
} from "lucide-react"

import {
  MarketingTemplateCategory,
  MarketingTemplateStatus
} from "@prisma/client"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

/* =========================================================
   TYPES
========================================================= */

type TemplatesPageProps = {
  searchParams: Promise<{
    search?: string
    category?: string
    status?: string
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
  demo_invitation: "Demo Invitation",
  demo_reminder: "Demo Reminder",
  follow_up: "Follow-up",
  sales_outreach: "Sales Outreach",
  trial: "Trial",
  onboarding: "Onboarding",
  re_engagement: "Re-engagement",
  custom: "Custom"
}

/* =========================================================
   STATUS LABELS
========================================================= */

const STATUS_LABELS: Record<
  MarketingTemplateStatus,
  string
> = {
  active: "Active",
  inactive: "Inactive",
  archived: "Archived"
}

/* =========================================================
   CATEGORY ICON
========================================================= */

function CategoryIcon({
  category
}: {
  category: MarketingTemplateCategory
}) {
  const iconClass =
    "h-5 w-5"

  switch (category) {
    case "campaign":
      return (
        <Megaphone
          className={iconClass}
        />
      )

    case "newsletter":
      return (
        <Mail
          className={iconClass}
        />
      )

    case "demo_invitation":
      return (
        <Send
          className={iconClass}
        />
      )

    case "demo_reminder":
      return (
        <MessageSquare
          className={iconClass}
        />
      )

    case "follow_up":
      return (
        <MessageSquare
          className={iconClass}
        />
      )

    case "sales_outreach":
      return (
        <Users
          className={iconClass}
        />
      )

    case "trial":
      return (
        <Sparkles
          className={iconClass}
        />
      )

    case "onboarding":
      return (
        <Users
          className={iconClass}
        />
      )

    case "re_engagement":
      return (
        <Mail
          className={iconClass}
        />
      )

    default:
      return (
        <FileText
          className={iconClass}
        />
      )
  }
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status
}: {
  status: MarketingTemplateStatus
}) {
  const styles: Record<
    MarketingTemplateStatus,
    string
  > = {
    active:
      "border-green-200 bg-green-50 text-green-700",

    inactive:
      "border-orange-200 bg-orange-50 text-orange-700",

    archived:
      "border-slate-200 bg-slate-100 text-slate-600"
  }

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-2.5
        py-1
        text-xs
        font-medium
        ${styles[status]}
      `}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
  value: Date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric"
    }
  ).format(value)
}

/* =========================================================
   PAGE
========================================================= */

export default async function MarketingTemplatesPage({
  searchParams
}: TemplatesPageProps) {
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

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        orgId: true
      }
    })

  if (!user?.orgId) {
    redirect("/login")
  }

  const params =
    await searchParams

  const search =
    params.search?.trim() ?? ""

  const category =
    Object.values(
      MarketingTemplateCategory
    ).includes(
      params.category as MarketingTemplateCategory
    )
      ? (
          params.category as MarketingTemplateCategory
        )
      : undefined

  const status =
    Object.values(
      MarketingTemplateStatus
    ).includes(
      params.status as MarketingTemplateStatus
    )
      ? (
          params.status as MarketingTemplateStatus
        )
      : undefined

  /* =======================================================
     DATA
  ======================================================= */

  const [
    templates,
    totalTemplates,
    activeTemplates,
    archivedTemplates,
    usageAggregate
  ] = await Promise.all([
    prisma.marketingTemplate.findMany({
      where: {
        orgId:
          user.orgId,

        ...(search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive"
                  }
                },
                {
                  description: {
                    contains: search,
                    mode: "insensitive"
                  }
                },
                {
                  subject: {
                    contains: search,
                    mode: "insensitive"
                  }
                }
              ]
            }
          : {}),

        ...(category
          ? {
              category
            }
          : {}),

        ...(status
          ? {
              status
            }
          : {})
      },

      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },

      orderBy: [
        {
          updatedAt: "desc"
        },
        {
          createdAt: "desc"
        }
      ]
    }),

    prisma.marketingTemplate.count({
      where: {
        orgId:
          user.orgId
      }
    }),

    prisma.marketingTemplate.count({
      where: {
        orgId:
          user.orgId,

        status:
          MarketingTemplateStatus.active
      }
    }),

    prisma.marketingTemplate.count({
      where: {
        orgId:
          user.orgId,

        status:
          MarketingTemplateStatus.archived
      }
    }),

    prisma.marketingTemplate.aggregate({
      where: {
        orgId:
          user.orgId
      },

      _sum: {
        usageCount: true
      }
    })
  ])

  const totalUsage =
    usageAggregate._sum.usageCount ??
    0

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        px-6
        py-8
        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          max-w-[1600px]
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            flex-col
            gap-6
            xl:flex-row
            xl:items-center
            xl:justify-between
          "
        >
          <div>
            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-blue-600
              "
            >
              <LayoutTemplate
                className="h-4 w-4"
              />

              Marketing Operations
            </div>

            <h1
              className="
                mt-2
                text-3xl
                font-bold
                tracking-tight
                text-slate-950
              "
            >
              Marketing Templates
            </h1>

            <p
              className="
                mt-2
                max-w-3xl
                text-sm
                text-slate-500
              "
            >
              Create and manage reusable
              templates for campaigns,
              newsletters, demos,
              follow-ups, outreach and
              customer engagement.
            </p>
          </div>

          <Link
            href="/admin/marketing/templates/new"
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-green-600
              px-5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-green-700
            "
          >
            <Plus
              className="h-4 w-4"
            />

            New Template
          </Link>
        </div>

        {/* =================================================
            KPI CARDS
        ================================================= */}

        <div
          className="
            mt-8
            grid
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <MetricCard
            label="Total Templates"
            value={totalTemplates}
            description="All reusable templates"
            icon={
              <LayoutTemplate
                className="
                  h-5
                  w-5
                  text-blue-600
                "
              />
            }
            iconClassName="
              bg-blue-50
            "
          />

          <MetricCard
            label="Active Templates"
            value={activeTemplates}
            description="Ready for use"
            icon={
              <Sparkles
                className="
                  h-5
                  w-5
                  text-green-600
                "
              />
            }
            iconClassName="
              bg-green-50
            "
          />

          <MetricCard
            label="Total Usage"
            value={totalUsage}
            description="Times templates were used"
            icon={
              <BarChart3
                className="
                  h-5
                  w-5
                  text-orange-600
                "
              />
            }
            iconClassName="
              bg-orange-50
            "
          />

          <MetricCard
            label="Archived"
            value={archivedTemplates}
            description="Templates stored in archive"
            icon={
              <Archive
                className="
                  h-5
                  w-5
                  text-slate-600
                "
              />
            }
            iconClassName="
              bg-slate-100
            "
          />
        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div
          className="
            mt-8
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-4
            shadow-sm
          "
        >
          <form
            method="GET"
            className="
              grid
              gap-3
              lg:grid-cols-[minmax(280px,1fr)_220px_180px_auto]
            "
          >
            {/* SEARCH */}

            <div
              className="
                relative
              "
            >
              <Search
                className="
                  absolute
                  left-4
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                name="search"
                defaultValue={search}
                placeholder="Search templates..."
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  pl-11
                  pr-4
                  text-sm
                  outline-none
                  transition
                  focus:border-blue-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-50
                "
              />
            </div>

            {/* CATEGORY */}

            <select
              name="category"
              defaultValue={
                category ?? ""
              }
              className="
                h-11
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                text-sm
                text-slate-700
                outline-none
                focus:border-blue-400
                focus:ring-4
                focus:ring-blue-50
              "
            >
              <option value="">
                All Categories
              </option>

              {Object.entries(
                CATEGORY_LABELS
              ).map(
                ([
                  value,
                  label
                ]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                )
              )}
            </select>

            {/* STATUS */}

            <select
              name="status"
              defaultValue={
                status ?? ""
              }
              className="
                h-11
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                text-sm
                text-slate-700
                outline-none
                focus:border-blue-400
                focus:ring-4
                focus:ring-blue-50
              "
            >
              <option value="">
                All Statuses
              </option>

              {Object.entries(
                STATUS_LABELS
              ).map(
                ([
                  value,
                  label
                ]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                )
              )}
            </select>

            <button
              type="submit"
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
                transition
                hover:bg-blue-700
              "
            >
              <Filter
                className="h-4 w-4"
              />

              Apply
            </button>
          </form>

          {(search ||
            category ||
            status) && (
            <div
              className="
                mt-3
                flex
                justify-end
              "
            >
              <Link
                href="/admin/marketing/templates"
                className="
                  text-sm
                  font-medium
                  text-red-600
                  hover:text-red-700
                "
              >
                Clear filters
              </Link>
            </div>
          )}
        </div>

        {/* =================================================
            CONTENT HEADER
        ================================================= */}

        <div
          className="
            mt-8
            flex
            items-center
            justify-between
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
              Template Library
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {templates.length} template
              {templates.length === 1
                ? ""
                : "s"}{" "}
              found
            </p>
          </div>
        </div>

        {/* =================================================
            TEMPLATE GRID
        ================================================= */}

        {templates.length > 0 ? (
          <div
            className="
              mt-5
              grid
              gap-5
              md:grid-cols-2
              2xl:grid-cols-3
            "
          >
            {templates.map(
              (template) => (
                <div
                  key={template.id}
                  className="
                    group
                    flex
                    min-h-[320px]
                    flex-col
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-md
                  "
                >
                  {/* CARD HEADER */}

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                    "
                  >
                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-3
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
                          text-blue-600
                        "
                      >
                        <CategoryIcon
                          category={
                            template.category
                          }
                        />
                      </div>

                      <div
                        className="
                          min-w-0
                        "
                      >
                        <p
                          className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-wide
                            text-slate-400
                          "
                        >
                          {
                            CATEGORY_LABELS[
                              template.category
                            ]
                          }
                        </p>

                        <h3
                          className="
                            mt-1
                            truncate
                            font-semibold
                            text-slate-950
                          "
                        >
                          {template.name}
                        </h3>
                      </div>
                    </div>

                    <StatusBadge
                      status={
                        template.status
                      }
                    />
                  </div>

                  {/* DESCRIPTION */}

                  <div
                    className="
                      mt-5
                      flex-1
                    "
                  >
                    {template.subject && (
                      <div
                        className="
                          rounded-xl
                          border
                          border-slate-100
                          bg-slate-50
                          px-4
                          py-3
                        "
                      >
                        <p
                          className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-wide
                            text-slate-400
                          "
                        >
                          Subject
                        </p>

                        <p
                          className="
                            mt-1
                            line-clamp-2
                            text-sm
                            font-medium
                            text-slate-800
                          "
                        >
                          {template.subject}
                        </p>
                      </div>
                    )}

                    <p
                      className="
                        mt-4
                        line-clamp-3
                        text-sm
                        leading-6
                        text-slate-500
                      "
                    >
                      {template.description ||
                        "No description provided for this template."}
                    </p>
                  </div>

                  {/* META */}

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      justify-between
                      border-t
                      border-slate-100
                      pt-4
                      text-xs
                      text-slate-500
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <Copy
                        className="
                          h-3.5
                          w-3.5
                        "
                      />

                      Used{" "}
                      {template.usageCount}{" "}
                      time
                      {template.usageCount === 1
                        ? ""
                        : "s"}
                    </div>

                    <span>
                      Updated{" "}
                      {formatDate(
                        template.updatedAt
                      )}
                    </span>
                  </div>

                  {/* CREATOR */}

                  <div
                    className="
                      mt-3
                      text-xs
                      text-slate-400
                    "
                  >
                    Created by{" "}
                    <span
                      className="
                        font-medium
                        text-slate-600
                      "
                    >
                      {template.createdBy
                        ?.name ||
                        template.createdBy
                          ?.email ||
                        "Unknown"}
                    </span>
                  </div>

                  {/* ACTIONS */}

                  <div
                    className="
                      mt-5
                      grid
                      grid-cols-2
                      gap-3
                    "
                  >
                    <Link
                      href={`/admin/marketing/templates/${template.id}`}
                      className="
                        inline-flex
                        h-10
                        items-center
                        justify-center
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
                      View Template
                    </Link>

                    <Link
                      href={`/admin/marketing/templates/${template.id}/edit`}
                      className="
                        inline-flex
                        h-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-orange-500
                        px-4
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-orange-600
                      "
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          /* ===============================================
             EMPTY STATE
          =============================================== */

          <div
            className="
              mt-5
              rounded-3xl
              border
              border-dashed
              border-slate-300
              bg-white
              px-6
              py-20
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
              "
            >
              <LayoutTemplate
                className="
                  h-8
                  w-8
                  text-blue-600
                "
              />
            </div>

            <h3
              className="
                mt-5
                text-lg
                font-semibold
                text-slate-950
              "
            >
              No templates found
            </h3>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-500
              "
            >
              {search ||
              category ||
              status
                ? "No templates match the current filters. Clear the filters or try another search."
                : "Create your first reusable marketing template for campaigns, newsletters, demos or follow-ups."}
            </p>

            {search ||
            category ||
            status ? (
              <Link
                href="/admin/marketing/templates"
                className="
                  mt-6
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-600
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                "
              >
                Clear Filters
              </Link>
            ) : (
              <Link
                href="/admin/marketing/templates/new"
                className="
                  mt-6
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-green-600
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-green-700
                "
              >
                <Plus
                  className="h-4 w-4"
                />

                Create Template
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  label,
  value,
  description,
  icon,
  iconClassName
}: {
  label: string
  value: number
  description: string
  icon: React.ReactNode
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
            {label}
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
            ${iconClassName}
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}