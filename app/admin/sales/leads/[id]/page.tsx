// app/admin/sales/leads/[id]/page.tsx

import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  ExternalLink,
  FileText,
  Globe2,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
  Tag,
  Target,
  UserRound,
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import OutreachForm from "../../outreach/components/OutreachForm"

/* ==========================================================
   TYPES
========================================================== */

type PageProps = {
  params: Promise<{
    id: string
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


function formatDateTime(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

export default async function SalesLeadDetailPage({
  params,
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
     PARAMS
  --------------------------------------------------------- */

  const { id } =
    await params


  /* --------------------------------------------------------
     LEAD
  --------------------------------------------------------- */

  const lead =
    await prisma.lead.findFirst({

      where: {
        id,

        assignedTo:
          userId,
      },

      select: {

        id: true,

        firstName: true,

        lastName: true,

        email: true,

        phone: true,

        companyName: true,

        address: true,

        source: true,

        budget: true,

        priority: true,

        tags: true,

        attachment: true,

        industry: true,

        status: true,

        createdAt: true,

        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        notes: {
          orderBy: {
            createdAt:
              "desc",
          },

          select: {
            id: true,
            content: true,
            createdAt: true,

            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },

        activities: {
          orderBy: {
            createdAt:
              "desc",
          },

          select: {
            id: true,
            type: true,
            title: true,
            createdAt: true,
          },
        },
      },
    })


  if (!lead) {
    notFound()
  }


  /* --------------------------------------------------------
     COMPUTED VALUES
  --------------------------------------------------------- */

  const fullName =
    [
      lead.firstName,
      lead.lastName,
    ]
      .filter(Boolean)
      .join(" ")


  const tags =
    lead.tags
      ?.split(",")
      .map(
        (tag) =>
          tag.trim()
      )
      .filter(Boolean) ??
    []


  const totalActivities =
    lead.activities.length


  const totalNotes =
    lead.notes.length


  /* ========================================================
     UI
  ======================================================== */

  return (

    <div className="space-y-6">

      {/* ====================================================
          BACK
      ==================================================== */}

      <Link
        href="/admin/sales/leads"
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-medium
          text-blue-600
          transition
          hover:text-blue-700
        "
      >
        <ArrowLeft size={17} />

        Back to My Leads
      </Link>


      {/* ====================================================
          HEADER
      ==================================================== */}

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
              bg-blue-50
              text-lg
              font-bold
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

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
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
                {fullName}
              </h1>


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
                  "Medium"}{" "}
                Priority
              </span>

            </div>


            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              {lead.companyName ||
                "Individual prospect"}

              {" • "}

              Added{" "}

              {formatDate(
                lead.createdAt
              )}
            </p>

          </div>

        </div>


        {/* --------------------------------------------------
            HEADER ACTIONS
        --------------------------------------------------- */}

        <div
          className="
            flex
            flex-wrap
            gap-2
          "
        >

          {lead.email && (

            <Link
              href={
                `/admin/sales/outreach?leadId=${lead.id}&channel=email`
              }
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

              Send Email
            </Link>

          )}


          {lead.phone && (

            <a
              href={`tel:${lead.phone}`}
              className="
                inline-flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-blue-600
                px-4
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-700
              "
            >
              <Phone size={17} />

              Call Lead
            </a>

          )}


          <Link
            href={
              `/admin/sales/demo-requests/new?leadId=${lead.id}`
            }
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-orange-500
              px-4
              text-sm
              font-medium
              text-white
              transition
              hover:bg-orange-600
            "
          >
            <CalendarDays size={17} />

            Request Demo
          </Link>

        </div>

      </div>


{/* ========================================================
    SALES OUTREACH WORKSPACE
======================================================== */}

<OutreachForm
  lead={{
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    companyName: lead.companyName,
  }}
/>

      {/* ====================================================
          SUMMARY CARDS
      ==================================================== */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        <SummaryCard
          label="Current Status"
          value={
            formatStatus(
              lead.status
            )
          }
          description="Sales pipeline stage"
          icon={Target}
          iconClass="bg-blue-50 text-blue-600"
        />


        <SummaryCard
          label="Activities"
          value={
            String(
              totalActivities
            )
          }
          description="Recorded interactions"
          icon={Clock3}
          iconClass="bg-orange-50 text-orange-600"
        />


        <SummaryCard
          label="Notes"
          value={
            String(
              totalNotes
            )
          }
          description="Sales notes recorded"
          icon={MessageSquareText}
          iconClass="bg-purple-50 text-purple-600"
        />


        <SummaryCard
          label="Budget"
          value={
            lead.budget != null
              ? `$${lead.budget.toLocaleString(
                  "en-US"
                )}`
              : "Not Set"
          }
          description="Estimated prospect budget"
          icon={DollarSign}
          iconClass="bg-green-50 text-green-600"
        />

      </div>


      {/* ====================================================
          MAIN GRID
      ==================================================== */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.7fr)]
        "
      >

        {/* ==================================================
            LEFT COLUMN
        ================================================== */}

        <div className="space-y-6">

          {/* ================================================
              CONTACT DETAILS
          ================================================ */}

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

            <SectionHeader
              title="Lead Information"
              description="Contact and business information for this prospect."
              icon={UserRound}
            />


            <div
              className="
                grid
                gap-x-8
                gap-y-6
                p-5
                md:grid-cols-2
              "
            >

              <InfoItem
                icon={Mail}
                label="Email Address"
                value={
                  lead.email ||
                  "Not provided"
                }
              />


              <InfoItem
                icon={Phone}
                label="Phone Number"
                value={
                  lead.phone ||
                  "Not provided"
                }
              />


              <InfoItem
                icon={Building2}
                label="Company"
                value={
                  lead.companyName ||
                  "Not provided"
                }
              />


              <InfoItem
                icon={Globe2}
                label="Industry"
                value={
                  lead.industry
                    ? formatStatus(
                        lead.industry
                      )
                    : "Not selected"
                }
              />


              <InfoItem
                icon={Target}
                label="Lead Source"
                value={
                  lead.source ||
                  "Not specified"
                }
              />


              <InfoItem
                icon={DollarSign}
                label="Budget"
                value={
                  lead.budget != null
                    ? `$${lead.budget.toLocaleString(
                        "en-US"
                      )}`
                    : "Not specified"
                }
              />


              <div className="md:col-span-2">

                <InfoItem
                  icon={MapPin}
                  label="Address"
                  value={
                    lead.address ||
                    "Not provided"
                  }
                />

              </div>

            </div>

          </section>


          {/* ================================================
              TAGS AND ATTACHMENT
          ================================================ */}

          {(tags.length > 0 ||
            lead.attachment) && (

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

              <SectionHeader
                title="Lead Resources"
                description="Tags and supporting files attached to this lead."
                icon={Tag}
              />


              <div
                className="
                  space-y-5
                  p-5
                "
              >

                {tags.length > 0 && (

                  <div>

                    <p
                      className="
                        mb-3
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-400
                      "
                    >
                      Tags
                    </p>


                    <div
                      className="
                        flex
                        flex-wrap
                        gap-2
                      "
                    >

                      {tags.map(
                        (tag) => (

                          <span
                            key={tag}
                            className="
                              rounded-full
                              border
                              border-blue-200
                              bg-blue-50
                              px-3
                              py-1.5
                              text-xs
                              font-medium
                              text-blue-700
                            "
                          >
                            {tag}
                          </span>

                        )
                      )}

                    </div>

                  </div>

                )}


                {lead.attachment && (

                  <div>

                    <p
                      className="
                        mb-3
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-400
                      "
                    >
                      Attachment
                    </p>


                    <a
                      href={
                        lead.attachment
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        bg-blue-50
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-blue-700
                        transition
                        hover:bg-blue-100
                      "
                    >
                      <FileText
                        size={17}
                      />

                      Open Attachment

                      <ExternalLink
                        size={14}
                      />
                    </a>

                  </div>

                )}

              </div>

            </section>

          )}


          {/* ================================================
              ACTIVITY TIMELINE
          ================================================ */}

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

            <SectionHeader
              title="Activity Timeline"
              description="Recorded sales activity and outreach history."
              icon={Clock3}
            />


            {lead.activities.length ===
            0 ? (

              <EmptyState
                icon={Clock3}
                title="No activity yet"
                description="Sales outreach activity for this lead will appear here."
              />

            ) : (

              <div
                className="
                  divide-y
                  divide-slate-100
                "
              >

                {lead.activities.map(
                  (activity) => (

                    <div
                      key={
                        activity.id
                      }
                      className="
                        flex
                        gap-4
                        px-5
                        py-4
                      "
                    >

                      <div
                        className="
                          mt-0.5
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-blue-50
                          text-blue-600
                        "
                      >
                        <CheckCircle2
                          size={17}
                        />
                      </div>


                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >

                        <div
                          className="
                            flex
                            flex-col
                            gap-1
                            sm:flex-row
                            sm:items-start
                            sm:justify-between
                          "
                        >

                          <div>

                            <p
                              className="
                                font-medium
                                text-slate-900
                              "
                            >
                              {
                                activity.title
                              }
                            </p>


                            <p
                              className="
                                mt-1
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-blue-600
                              "
                            >
                              {formatStatus(
                                activity.type
                              )}
                            </p>

                          </div>


                          <p
                            className="
                              whitespace-nowrap
                              text-xs
                              text-slate-400
                            "
                          >
                            {formatDateTime(
                              activity.createdAt
                            )}
                          </p>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        </div>


        {/* ==================================================
            RIGHT COLUMN
        ================================================== */}

        <div className="space-y-6">

          {/* ================================================
              SALES OWNER
          ================================================ */}

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

            <SectionHeader
              title="Sales Owner"
              description="Person responsible for this lead."
              icon={UserRound}
            />


            <div className="p-5">

              {lead.assignee ? (

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
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      bg-blue-50
                      font-semibold
                      text-blue-700
                    "
                  >
                    {lead.assignee.name
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>


                  <div>

                    <p
                      className="
                        font-medium
                        text-slate-900
                      "
                    >
                      {
                        lead.assignee
                          .name
                      }
                    </p>


                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                      "
                    >
                      {
                        lead.assignee
                          .email
                      }
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
                  No sales owner assigned.
                </p>

              )}

            </div>

          </section>


          {/* ================================================
              QUICK ACTIONS
          ================================================ */}

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

            <SectionHeader
              title="Quick Actions"
              description="Continue the sales workflow."
              icon={Send}
            />


            <div
              className="
                space-y-3
                p-5
              "
            >

              {lead.email && (

                <Link
                  href={
                    `/admin/sales/outreach?leadId=${lead.id}&channel=email`
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-green-200
                    bg-green-50
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-green-700
                    transition
                    hover:bg-green-100
                  "
                >
                  <Mail size={18} />

                  Send Email Outreach
                </Link>

              )}


              {lead.phone && (

                <a
                  href={`tel:${lead.phone}`}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-blue-200
                    bg-blue-50
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-blue-700
                    transition
                    hover:bg-blue-100
                  "
                >
                  <Phone size={18} />

                  Call Prospect
                </a>

              )}


              <Link
                href={
                  `/admin/sales/demo-requests/new?leadId=${lead.id}`
                }
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-orange-200
                  bg-orange-50
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-orange-700
                  transition
                  hover:bg-orange-100
                "
              >
                <CalendarDays
                  size={18}
                />

                Request Product Demo
              </Link>

            </div>

          </section>


          {/* ================================================
              SALES NOTES
          ================================================ */}

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

            <SectionHeader
              title="Sales Notes"
              description="Recent notes about this prospect."
              icon={MessageSquareText}
            />


            {lead.notes.length ===
            0 ? (

              <EmptyState
                icon={
                  MessageSquareText
                }
                title="No notes yet"
                description="Lead notes will appear here as the sales conversation progresses."
              />

            ) : (

              <div
                className="
                  divide-y
                  divide-slate-100
                "
              >

                {lead.notes.map(
                  (note) => (

                    <div
                      key={note.id}
                      className="
                        px-5
                        py-4
                      "
                    >

                      <p
                        className="
                          whitespace-pre-wrap
                          text-sm
                          leading-6
                          text-slate-700
                        "
                      >
                        {note.content}
                      </p>


                      <div
                        className="
                          mt-3
                          flex
                          items-center
                          justify-between
                          gap-3
                        "
                      >

                        <p
                          className="
                            text-xs
                            font-medium
                            text-slate-500
                          "
                        >
                          {
                            note.author
                              .name
                          }
                        </p>


                        <p
                          className="
                            text-xs
                            text-slate-400
                          "
                        >
                          {formatDateTime(
                            note.createdAt
                          )}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        </div>

      </div>

    </div>

  )
}


/* ==========================================================
   SUMMARY CARD
========================================================== */

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass,
}: {
  label: string
  value: string
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

        <div className="min-w-0">

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
              truncate
              text-2xl
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
            shrink-0
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
   SECTION HEADER
========================================================== */

function SectionHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: React.ElementType
}) {

  return (

    <div
      className="
        flex
        items-center
        gap-3
        border-b
        border-slate-200
        bg-slate-50/60
        px-5
        py-4
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
          bg-blue-50
          text-blue-600
        "
      >
        <Icon size={19} />
      </div>


      <div>

        <h2
          className="
            font-semibold
            text-slate-950
          "
        >
          {title}
        </h2>


        <p
          className="
            mt-1
            text-sm
            text-slate-500
          "
        >
          {description}
        </p>

      </div>

    </div>

  )
}


/* ==========================================================
   INFO ITEM
========================================================== */

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
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

      <div
        className="
          mt-0.5
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-slate-50
          text-slate-500
        "
      >
        <Icon size={17} />
      </div>


      <div className="min-w-0">

        <p
          className="
            text-xs
            font-medium
            uppercase
            tracking-wide
            text-slate-400
          "
        >
          {label}
        </p>


        <p
          className="
            mt-1
            break-words
            text-sm
            font-medium
            text-slate-800
          "
        >
          {value}
        </p>

      </div>

    </div>

  )
}


/* ==========================================================
   EMPTY STATE
========================================================== */

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {

  return (

    <div
      className="
        flex
        min-h-48
        flex-col
        items-center
        justify-center
        px-6
        py-8
        text-center
      "
    >

      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-xl
          bg-slate-50
          text-slate-400
        "
      >
        <Icon size={21} />
      </div>


      <h3
        className="
          mt-3
          font-semibold
          text-slate-900
        "
      >
        {title}
      </h3>


      <p
        className="
          mt-1
          max-w-sm
          text-sm
          leading-6
          text-slate-500
        "
      >
        {description}
      </p>

    </div>

  )
}