import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  Database,
  FileText,
  Globe2,
  Mail,
  MapPin,
  MessageSquareText,
  Paperclip,
  Phone,
  Tag,
  UserRound,
  Users
} from "lucide-react"

import {
  LeadStatus
} from "@prisma/client"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"

import LeadActions from "../components/LeadActions"

import {
  addLeadNoteAction
} from "../actions"


// ============================================================
// TYPES
// ============================================================

type LeadDetailPageProps = {

  params: Promise<{
    id: string
  }>

}


// ============================================================
// STATUS CONFIG
// ============================================================

const STATUS_CONFIG: Record<
  LeadStatus,
  {
    label: string
    className: string
  }
> = {

  new: {
    label: "New",
    className:
      "border-blue-200 bg-blue-50 text-blue-700"
  },

  contacted: {
    label: "Contacted",
    className:
      "border-orange-200 bg-orange-50 text-orange-700"
  },

  estimate: {
    label: "Estimate",
    className:
      "border-violet-200 bg-violet-50 text-violet-700"
  },

  won: {
    label: "Won",
    className:
      "border-green-200 bg-green-50 text-green-700"
  },

  lost: {
    label: "Lost",
    className:
      "border-red-200 bg-red-50 text-red-700"
  },

  converted: {
    label: "Converted",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700"
  }

}


// ============================================================
// PRIORITY STYLES
// ============================================================

const PRIORITY_STYLES:
  Record<string, string> = {

  Low:
    "border-slate-200 bg-slate-50 text-slate-600",

  Medium:
    "border-blue-200 bg-blue-50 text-blue-700",

  High:
    "border-orange-200 bg-orange-50 text-orange-700",

  Urgent:
    "border-red-200 bg-red-50 text-red-700"

}


// ============================================================
// PAGE
// ============================================================

export default async function LeadDetailPage({
  params
}: LeadDetailPageProps) {

  // ----------------------------------------------------------
  // AUTH
  // ----------------------------------------------------------

  const session =
    await auth()


  if (
    !session?.user?.id ||
    !session.user.orgId
  ) {

    redirect(
      "/login"
    )

  }


  const orgId =
    session.user.orgId


  // ----------------------------------------------------------
  // PARAMS
  // ----------------------------------------------------------

  const {
    id
  } =
    await params


  if (!id) {
    notFound()
  }


  // ----------------------------------------------------------
  // LOAD LEAD
  //
  // findFirst is intentional because orgId is part of the
  // tenant-isolation condition.
  // ----------------------------------------------------------

  const lead =
    await prisma.lead.findFirst({

      where: {

        id,

        orgId

      },

      select: {

        id: true,

        source: true,

        firstName: true,

        lastName: true,

        phone: true,

        email: true,

        companyName: true,

        address: true,

        budget: true,

        priority: true,

        tags: true,

        attachment: true,

        industry: true,

        status: true,

        assignedTo: true,

        createdAt: true,


        assignee: {

          select: {

            id: true,

            name: true,

            email: true,

            phone: true,

            avatar: true,

            status: true

          }

        },


        notes: {

  orderBy: {
    createdAt:
      "desc"
  },

  select: {

    id: true,

    content: true,

    createdAt: true,

    author: {

      select: {

        id: true,

        name: true,

        email: true

      }

    }

  }

},


        activities: {

          orderBy: {

            createdAt:
              "desc"

          },

          select: {

            id: true,

            type: true,

            title: true,

            createdAt: true

          }

        }

      }

    })


  if (!lead) {
    notFound()
  }


  // ----------------------------------------------------------
  // DISPLAY VALUES
  // ----------------------------------------------------------

  const leadName =
    [
      lead.firstName,
      lead.lastName
    ]
      .filter(Boolean)
      .join(" ")
      .trim()


  const priority =
    lead.priority ??
    "Medium"


  const submitLeadNote =
  async (
    formData: FormData
  ): Promise<void> => {

    "use server"

    await addLeadNoteAction(
      lead.id,
      formData
    )
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================== */}
      {/* BACK */}
      {/* ==================================================== */}

      <div>

        <Link
          href="/admin/data-entry"
          className="
            inline-flex
            items-center gap-2
            text-sm font-medium
            text-blue-600
            transition
            hover:text-blue-700
          "
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Data Entry
        </Link>

      </div>


      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <div
        className="
          flex flex-col gap-5
          xl:flex-row
          xl:items-start
          xl:justify-between
        "
      >

        <div
          className="
            flex items-start gap-4
          "
        >

          <div
            className="
              flex h-14 w-14
              shrink-0
              items-center justify-center
              rounded-xl
              bg-blue-50
              text-lg font-semibold
              text-blue-700
            "
          >
            {lead.firstName
              .charAt(0)
              .toUpperCase()}

            {lead.lastName
              ?.charAt(0)
              .toUpperCase() ?? ""}
          </div>


          <div>

            <div
              className="
                flex flex-wrap
                items-center gap-2
              "
            >

              <h1
                className="
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-slate-900
                "
              >
                {leadName}
              </h1>


              <span
                className={`
                  inline-flex
                  rounded-full
                  border
                  px-2.5 py-1
                  text-xs font-medium
                  ${STATUS_CONFIG[lead.status].className}
                `}
              >
                {STATUS_CONFIG[lead.status].label}
              </span>


              <span
                className={`
                  inline-flex
                  rounded-full
                  border
                  px-2.5 py-1
                  text-xs font-medium
                  ${
                    PRIORITY_STYLES[
                      priority
                    ] ??
                    PRIORITY_STYLES.Medium
                  }
                `}
              >
                {priority} Priority
              </span>

            </div>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {lead.companyName ||
                "Individual Lead"}
            </p>


            <div
              className="
                mt-2
                flex flex-wrap
                items-center gap-x-4 gap-y-1
                text-xs
                text-slate-400
              "
            >

              <span
                className="
                  inline-flex
                  items-center gap-1.5
                "
              >
                <CalendarDays className="h-3.5 w-3.5" />

                Created{" "}
                {formatDate(
                  lead.createdAt
                )}
              </span>


              <span
                className="
                  inline-flex
                  items-center gap-1.5
                "
              >
                <Database className="h-3.5 w-3.5" />

                Lead Record
              </span>

            </div>

          </div>

        </div>


        <LeadActions
          leadId={
            lead.id
          }
          leadName={
            leadName
          }
          status={
            lead.status
          }
          canEdit
          canDelete
          canChangeStatus
        />

      </div>


      {/* ==================================================== */}
      {/* MAIN GRID */}
      {/* ==================================================== */}

      <div
        className="
          grid gap-6
          xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]
        "
      >

        {/* ================================================== */}
        {/* LEFT COLUMN */}
        {/* ================================================== */}

        <div className="space-y-6">

          {/* ================================================= */}
          {/* CONTACT INFORMATION */}
          {/* ================================================= */}

          <DetailSection
            title="Contact Information"
            description="Primary contact details for this lead."
            icon={UserRound}
          >

            <div
              className="
                grid gap-5
                sm:grid-cols-2
              "
            >

              <DetailItem
                icon={UserRound}
                label="Full Name"
                value={
                  leadName
                }
              />


              <DetailItem
                icon={Building2}
                label="Company"
                value={
                  lead.companyName ||
                  "Not provided"
                }
              />


              <DetailItem
                icon={Mail}
                label="Email Address"
                value={
                  lead.email ||
                  "Not provided"
                }
                href={
                  lead.email
                    ? `mailto:${lead.email}`
                    : undefined
                }
              />


              <DetailItem
                icon={Phone}
                label="Phone Number"
                value={
                  lead.phone ||
                  "Not provided"
                }
                href={
                  lead.phone
                    ? `tel:${lead.phone}`
                    : undefined
                }
              />


              <div className="sm:col-span-2">

                <DetailItem
                  icon={MapPin}
                  label="Address"
                  value={
                    lead.address ||
                    "Not provided"
                  }
                />

              </div>

            </div>

          </DetailSection>


          {/* ================================================= */}
          {/* CLASSIFICATION */}
          {/* ================================================= */}

          <DetailSection
            title="Lead Classification"
            description="Source, industry, opportunity value, and classification data."
            icon={Tag}
          >

            <div
              className="
                grid gap-5
                sm:grid-cols-2
              "
            >

              <DetailItem
                icon={Globe2}
                label="Lead Source"
                value={
                  lead.source ||
                  "Not specified"
                }
              />


              <DetailItem
                icon={Building2}
                label="Industry"
                value={
                  lead.industry
                    ? formatLabel(
                        lead.industry
                      )
                    : "Not specified"
                }
              />


              <DetailItem
                icon={CircleDollarSign}
                label="Estimated Budget"
                value={
                  formatCurrency(
                    lead.budget
                  )
                }
              />


              <DetailItem
                icon={Tag}
                label="Priority"
                value={
                  priority
                }
              />


              <div className="sm:col-span-2">

                <div>

                  <p
                    className="
                      text-xs font-medium
                      uppercase tracking-wide
                      text-slate-400
                    "
                  >
                    Tags
                  </p>


                  {lead.tags ? (

                    <div
                      className="
                        mt-2
                        flex flex-wrap gap-2
                      "
                    >

                      {lead.tags
                        .split(",")
                        .map(
                          (tag) =>
                            tag.trim()
                        )
                        .filter(Boolean)
                        .map(
                          (tag) => (

                            <span
                              key={
                                tag
                              }
                              className="
                                inline-flex
                                rounded-full
                                border border-blue-200
                                bg-blue-50
                                px-2.5 py-1
                                text-xs font-medium
                                text-blue-700
                              "
                            >
                              {tag}
                            </span>

                          )
                        )}

                    </div>

                  ) : (

                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                      "
                    >
                      No tags added
                    </p>

                  )}

                </div>

              </div>

            </div>

          </DetailSection>


          {/* ================================================= */}
          {/* NOTES */}
          {/* ================================================= */}

          <DetailSection
            title="Lead Notes"
            description={`${lead.notes.length} ${
              lead.notes.length === 1
                ? "note"
                : "notes"
            } recorded for this lead.`}
            icon={MessageSquareText}
          >

            {/* ADD NOTE */}

            <form
  action={
    submitLeadNote
  }
  className="
    rounded-xl
    border border-blue-200
    bg-blue-50/50
    p-4
  "
>

              <label
                htmlFor="content"
                className="
                  block
                  text-sm font-medium
                  text-slate-700
                "
              >
                Add Note
              </label>


              <textarea
                id="content"
                name="content"
                rows={4}
                required
                maxLength={5000}
                placeholder="Enter a note about this lead..."
                className="
                  mt-2
                  w-full
                  resize-y
                  rounded-lg
                  border border-slate-300
                  bg-white
                  px-3 py-3
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />


              <div
                className="
                  mt-3
                  flex justify-end
                "
              >

                <button
                  type="submit"
                  className="
                    inline-flex h-10
                    items-center justify-center
                    gap-2
                    rounded-lg
                    bg-green-600
                    px-4
                    text-sm font-medium
                    text-white
                    transition
                    hover:bg-green-700
                  "
                >
                  <MessageSquareText className="h-4 w-4" />

                  Add Note
                </button>

              </div>

            </form>


            {/* NOTES LIST */}

            <div className="mt-5">

              {lead.notes.length === 0 ? (

                <EmptyContent
                  icon={MessageSquareText}
                  title="No notes yet"
                  description="Add the first note to keep important lead information in one place."
                />

              ) : (

                <div className="space-y-3">

                  {lead.notes.map(
                    (note) => (

                      <article
                        key={
                          note.id
                        }
                        className="
                          rounded-xl
                          border border-slate-200
                          bg-slate-50/60
                          p-4
                        "
                      >

                        <p
                          className="
                            whitespace-pre-wrap
                            text-sm leading-6
                            text-slate-700
                          "
                        >
                          {note.content}
                        </p>


                        <div
  className="
    mt-3
    flex flex-wrap
    items-center
    justify-between
    gap-2
  "
>

  <p
    className="
      text-xs font-medium
      text-slate-500
    "
  >
    Added by{" "}
    <span className="text-slate-700">
      {note.author.name}
    </span>
  </p>


  <div
    className="
      flex items-center gap-1.5
      text-xs
      text-slate-400
    "
  >
    <Clock3 className="h-3.5 w-3.5" />

    {formatDateTime(
      note.createdAt
    )}
  </div>

</div>

                      </article>

                    )
                  )}

                </div>

              )}

            </div>

          </DetailSection>

        </div>


        {/* ================================================== */}
        {/* RIGHT COLUMN */}
        {/* ================================================== */}

        <div className="space-y-6">

          {/* ================================================= */}
          {/* ASSIGNMENT */}
          {/* ================================================= */}

          <DetailSection
            title="Assignment"
            description="Current lead ownership."
            icon={Users}
          >

            {lead.assignee ? (

              <div
                className="
                  flex items-start gap-3
                "
              >

                <div
                  className="
                    flex h-11 w-11
                    shrink-0
                    items-center justify-center
                    rounded-full
                    bg-blue-50
                    font-semibold
                    text-blue-700
                  "
                >
                  {getInitials(
                    lead.assignee.name
                  )}
                </div>


                <div className="min-w-0">

                  <p
                    className="
                      font-medium
                      text-slate-900
                    "
                  >
                    {lead.assignee.name}
                  </p>


                  <p
                    className="
                      mt-0.5
                      truncate
                      text-sm
                      text-slate-500
                    "
                  >
                    {lead.assignee.email}
                  </p>


                  {lead.assignee.phone && (

                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                      "
                    >
                      {lead.assignee.phone}
                    </p>

                  )}


                  <span
                    className={`
                      mt-2
                      inline-flex
                      rounded-full
                      border
                      px-2 py-0.5
                      text-xs font-medium
                      ${
                        lead.assignee.status ===
                        "active"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-orange-200 bg-orange-50 text-orange-700"
                      }
                    `}
                  >
                    {formatLabel(
                      lead.assignee.status
                    )}
                  </span>

                </div>

              </div>

            ) : (

              <div
                className="
                  rounded-lg
                  border border-orange-200
                  bg-orange-50
                  px-4 py-3
                "
              >

                <p
                  className="
                    text-sm font-medium
                    text-orange-800
                  "
                >
                  Lead is unassigned
                </p>


                <p
                  className="
                    mt-1
                    text-xs leading-5
                    text-orange-700
                  "
                >
                  Edit the lead to assign it to an
                  organization user.
                </p>

              </div>

            )}

          </DetailSection>


          {/* ================================================= */}
          {/* ATTACHMENT */}
          {/* ================================================= */}

          <DetailSection
            title="Attachment"
            description="Document associated with this lead."
            icon={Paperclip}
          >

            {lead.attachment ? (

              <div
                className="
                  flex items-start gap-3
                  rounded-lg
                  border border-blue-200
                  bg-blue-50
                  p-3
                "
              >

                <FileText
                  className="
                    mt-0.5
                    h-5 w-5
                    shrink-0
                    text-blue-600
                  "
                />


                <div className="min-w-0">

                  <p
                    className="
                      text-sm font-medium
                      text-blue-900
                    "
                  >
                    Lead Attachment
                  </p>


                  <p
                    className="
                      mt-1
                      break-all
                      text-xs leading-5
                      text-blue-700
                    "
                  >
                    {lead.attachment}
                  </p>

                </div>

              </div>

            ) : (

              <p
                className="
                  text-sm
                  text-slate-500
                "
              >
                No attachment added.
              </p>

            )}

          </DetailSection>


          {/* ================================================= */}
          {/* ACTIVITY TIMELINE */}
          {/* ================================================= */}

          <DetailSection
            title="Activity Timeline"
            description={`${lead.activities.length} recorded activities.`}
            icon={Clock3}
          >

            {lead.activities.length === 0 ? (

              <EmptyContent
                icon={Clock3}
                title="No activity"
                description="Lead activity will appear here as the record changes."
              />

            ) : (

              <div className="relative">

                <div
                  className="
                    absolute
                    bottom-2 left-[7px] top-2
                    w-px
                    bg-slate-200
                  "
                />


                <div className="space-y-5">

                  {lead.activities.map(
                    (activity) => (

                      <div
                        key={
                          activity.id
                        }
                        className="
                          relative
                          flex gap-3
                        "
                      >

                        <div
                          className="
                            relative z-10
                            mt-1
                            h-[15px] w-[15px]
                            shrink-0
                            rounded-full
                            border-4
                            border-white
                            bg-blue-500
                            ring-1
                            ring-blue-200
                          "
                        />


                        <div className="min-w-0">

                          <p
                            className="
                              text-sm font-medium
                              text-slate-700
                            "
                          >
                            {activity.title}
                          </p>


                          <div
                            className="
                              mt-1
                              flex flex-wrap
                              items-center gap-2
                            "
                          >

                            <span
                              className="
                                rounded-full
                                bg-blue-50
                                px-2 py-0.5
                                text-[11px]
                                font-medium
                                text-blue-700
                              "
                            >
                              {formatLabel(
                                activity.type
                              )}
                            </span>


                            <span
                              className="
                                text-xs
                                text-slate-400
                              "
                            >
                              {formatDateTime(
                                activity.createdAt
                              )}
                            </span>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

          </DetailSection>

        </div>

      </div>

    </div>
  )
}


// ============================================================
// DETAIL SECTION
// ============================================================

type DetailSectionProps = {

  title: string

  description: string

  icon: React.ComponentType<{
    className?: string
  }>

  children: React.ReactNode

}


function DetailSection({
  title,
  description,
  icon: Icon,
  children
}: DetailSectionProps) {

  return (
    <section
      className="
        overflow-hidden
        rounded-xl
        border border-slate-200
        bg-white
        shadow-sm
      "
    >

      <div
        className="
          flex items-start gap-3
          border-b border-slate-200
          bg-slate-50/70
          px-5 py-4
        "
      >

        <div
          className="
            flex h-10 w-10
            shrink-0
            items-center justify-center
            rounded-lg
            bg-blue-50
            text-blue-600
          "
        >
          <Icon className="h-5 w-5" />
        </div>


        <div>

          <h2
            className="
              font-semibold
              text-slate-900
            "
          >
            {title}
          </h2>


          <p
            className="
              mt-0.5
              text-sm leading-5
              text-slate-500
            "
          >
            {description}
          </p>

        </div>

      </div>


      <div className="p-5">
        {children}
      </div>

    </section>
  )
}


// ============================================================
// DETAIL ITEM
// ============================================================

type DetailItemProps = {

  icon: React.ComponentType<{
    className?: string
  }>

  label: string

  value: string

  href?: string

}


function DetailItem({
  icon: Icon,
  label,
  value,
  href
}: DetailItemProps) {

  return (
    <div
      className="
        flex items-start gap-3
      "
    >

      <div
        className="
          flex h-9 w-9
          shrink-0
          items-center justify-center
          rounded-lg
          bg-slate-100
          text-slate-500
        "
      >
        <Icon className="h-4 w-4" />
      </div>


      <div className="min-w-0">

        <p
          className="
            text-xs font-medium
            uppercase tracking-wide
            text-slate-400
          "
        >
          {label}
        </p>


        {href ? (

          <a
            href={
              href
            }
            className="
              mt-1
              block
              break-words
              text-sm font-medium
              text-blue-600
              transition
              hover:text-blue-700
            "
          >
            {value}
          </a>

        ) : (

          <p
            className="
              mt-1
              break-words
              text-sm font-medium
              text-slate-700
            "
          >
            {value}
          </p>

        )}

      </div>

    </div>
  )
}


// ============================================================
// EMPTY CONTENT
// ============================================================

function EmptyContent({
  icon: Icon,
  title,
  description
}: {

  icon: React.ComponentType<{
    className?: string
  }>

  title: string

  description: string

}) {

  return (
    <div
      className="
        flex flex-col
        items-center
        px-4 py-8
        text-center
      "
    >

      <div
        className="
          flex h-11 w-11
          items-center justify-center
          rounded-lg
          bg-slate-100
          text-slate-500
        "
      >
        <Icon className="h-5 w-5" />
      </div>


      <p
        className="
          mt-3
          text-sm font-medium
          text-slate-700
        "
      >
        {title}
      </p>


      <p
        className="
          mt-1
          max-w-xs
          text-xs leading-5
          text-slate-500
        "
      >
        {description}
      </p>

    </div>
  )
}


// ============================================================
// FORMAT CURRENCY
// ============================================================

function formatCurrency(
  value: number | null
) {

  if (
    value === null ||
    value === undefined
  ) {
    return "Not specified"
  }


  return new Intl.NumberFormat(
    "en-US",
    {
      style:
        "currency",

      currency:
        "USD",

      maximumFractionDigits:
        2
    }
  ).format(value)
}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(
  date: Date
) {

  return new Intl.DateTimeFormat(
    "en-US",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric"
    }
  ).format(date)
}


// ============================================================
// FORMAT DATE TIME
// ============================================================

function formatDateTime(
  date: Date
) {

  return new Intl.DateTimeFormat(
    "en-US",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",

      hour:
        "2-digit",

      minute:
        "2-digit"
    }
  ).format(date)
}


// ============================================================
// FORMAT LABEL
// ============================================================

function formatLabel(
  value: string
) {

  return value
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    )
}


// ============================================================
// INITIALS
// ============================================================

function getInitials(
  name: string
) {

  const parts =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)


  if (parts.length === 0) {
    return "U"
  }


  if (parts.length === 1) {

    return parts[0]
      .charAt(0)
      .toUpperCase()

  }


  return (
    parts[0]
      .charAt(0) +
    parts[
      parts.length - 1
    ].charAt(0)
  ).toUpperCase()
}