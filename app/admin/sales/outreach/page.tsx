// app/admin/sales/outreach/page.tsx

import Link from "next/link"

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Target,
  UserRound,
} from "lucide-react"

import {
  getSalesOutreachLeads,
} from "./actions"


/* ==========================================================
   HELPERS
========================================================== */

function formatDate(
  value: Date
) {

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }
  ).format(
    new Date(value)
  )
}


function formatStatus(
  value: string
) {

  return value
    .replaceAll(
      "_",
      " "
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    )
}


function getInitials(
  firstName: string,
  lastName?: string | null
) {

  const first =
    firstName
      ?.charAt(0)
      .toUpperCase() ?? ""


  const last =
    lastName
      ?.charAt(0)
      .toUpperCase() ?? ""


  return (
    `${first}${last}` ||
    "L"
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
        border-violet-200
        bg-violet-50
        text-violet-700
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
  priority?: string | null
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

    case "medium":
      return `
        border-orange-200
        bg-orange-50
        text-orange-700
      `

    case "low":
      return `
        border-green-200
        bg-green-50
        text-green-700
      `

    default:
      return `
        border-slate-200
        bg-slate-50
        text-slate-600
      `
  }
}


/* ==========================================================
   PAGE
========================================================== */

export default async function SalesOutreachPage() {

  const leads =
    await getSalesOutreachLeads()


  /* --------------------------------------------------------
     STATISTICS
  --------------------------------------------------------- */

  const totalLeads =
    leads.length


  const emailReady =
    leads.filter(
      (lead) =>
        Boolean(
          lead.email
        )
    ).length


  const phoneReady =
    leads.filter(
      (lead) =>
        Boolean(
          lead.phone
        )
    ).length


  const contacted =
    leads.filter(
      (lead) =>
        lead.status ===
        "contacted"
    ).length


  const interested =
    leads.filter(
      (lead) =>
        lead.status ===
        "estimate"
    ).length


  return (

    <div
      className="
        mx-auto
        w-full
        max-w-[1600px]
        space-y-6
      "
    >

      {/* ====================================================
          PAGE HEADER
      ===================================================== */}

      <section
        className="
          flex
          flex-col
          gap-4
          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >

        <div>

          <div
            className="
              mb-2
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-blue-600
            "
          >
            <Send
              className="h-4 w-4"
            />

            Sales Operations
          </div>


          <h1
            className="
              text-3xl
              font-bold
              tracking-tight
              text-slate-950
            "
          >
            Lead Outreach
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
            Contact assigned leads through email,
            phone, WhatsApp, and social channels.
            Record every interaction and move
            interested prospects toward a demo.
          </p>

        </div>


        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
          "
        >

          <Link
            href="/admin/sales/leads"
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-blue-200
              bg-blue-50
              px-4
              text-sm
              font-semibold
              text-blue-700
              transition
              hover:bg-blue-100
            "
          >
            <Target
              className="h-4 w-4"
            />

            View Leads
          </Link>


          <Link
            href="/admin/sales/demo-requests"
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-green-600
              px-4
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-green-700
            "
          >
            <CheckCircle2
              className="h-4 w-4"
            />

            Demo Requests
          </Link>

        </div>

      </section>


      {/* ====================================================
          STATS
      ===================================================== */}

      <section
        className="
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-5
        "
      >

        <StatCard
          label="Assigned Leads"
          value={totalLeads}
          description="Active sales prospects"
          icon={
            <Target
              className="h-5 w-5"
            />
          }
          iconClass="
            bg-blue-50
            text-blue-600
          "
        />


        <StatCard
          label="Email Ready"
          value={emailReady}
          description="Leads with email address"
          icon={
            <Mail
              className="h-5 w-5"
            />
          }
          iconClass="
            bg-green-50
            text-green-600
          "
        />


        <StatCard
          label="Phone Ready"
          value={phoneReady}
          description="Leads with phone number"
          icon={
            <Phone
              className="h-5 w-5"
            />
          }
          iconClass="
            bg-orange-50
            text-orange-600
          "
        />


        <StatCard
          label="Contacted"
          value={contacted}
          description="Initial outreach completed"
          icon={
            <MessageCircle
              className="h-5 w-5"
            />
          }
          iconClass="
            bg-violet-50
            text-violet-600
          "
        />


        <StatCard
          label="Interested"
          value={interested}
          description="Ready for demo process"
          icon={
            <CheckCircle2
              className="h-5 w-5"
            />
          }
          iconClass="
            bg-green-50
            text-green-600
          "
        />

      </section>


      {/* ====================================================
          WORKFLOW INFO
      ===================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-blue-200
          bg-blue-50/60
          p-5
        "
      >

        <div
          className="
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
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
                bg-blue-100
                text-blue-600
              "
            >
              <Send
                className="h-5 w-5"
              />
            </div>


            <div>

              <h2
                className="
                  font-semibold
                  text-slate-950
                "
              >
                Sales Outreach Workflow
              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-slate-600
                "
              >
                Contact the lead, record the outcome,
                follow up when required, and send
                qualified prospects to the demo
                scheduling process.
              </p>

            </div>

          </div>


          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
              text-xs
              font-semibold
            "
          >

            <WorkflowBadge>
              Contact
            </WorkflowBadge>

            <ArrowRight
              className="
                h-4
                w-4
                text-slate-400
              "
            />

            <WorkflowBadge>
              Follow Up
            </WorkflowBadge>

            <ArrowRight
              className="
                h-4
                w-4
                text-slate-400
              "
            />

            <WorkflowBadge>
              Interested
            </WorkflowBadge>

            <ArrowRight
              className="
                h-4
                w-4
                text-slate-400
              "
            />

            <WorkflowBadge>
              Demo Request
            </WorkflowBadge>

          </div>

        </div>

      </section>


      {/* ====================================================
          LEAD OUTREACH TABLE
      ===================================================== */}

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

        {/* TABLE HEADER */}

        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-slate-200
            px-5
            py-5
            lg:flex-row
            lg:items-center
            lg:justify-between
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
              Outreach Queue
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {totalLeads} active assigned{" "}
              {totalLeads === 1
                ? "lead"
                : "leads"}
            </p>

          </div>


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
                gap-2
                rounded-lg
                border
                border-green-200
                bg-green-50
                px-3
                py-2
                text-xs
                font-semibold
                text-green-700
              "
            >
              <Mail
                className="h-4 w-4"
              />

              {emailReady} email ready
            </span>


            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                border
                border-orange-200
                bg-orange-50
                px-3
                py-2
                text-xs
                font-semibold
                text-orange-700
              "
            >
              <Phone
                className="h-4 w-4"
              />

              {phoneReady} phone ready
            </span>

          </div>

        </div>


        {/* EMPTY STATE */}

        {leads.length === 0 ? (

          <div
            className="
              flex
              min-h-[380px]
              flex-col
              items-center
              justify-center
              px-6
              text-center
            "
          >

            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
                text-blue-600
              "
            >
              <Target
                className="h-7 w-7"
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
              No leads in your outreach queue
            </h3>


            <p
              className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-500
              "
            >
              Leads assigned to your Platform Sales
              account will appear here automatically.
            </p>


            <Link
              href="/admin/sales/leads"
              className="
                mt-5
                inline-flex
                items-center
                gap-2
                rounded-xl
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
              View Sales Leads

              <ArrowRight
                className="h-4 w-4"
              />
            </Link>

          </div>

        ) : (

          /* TABLE */

          <div
            className="
              overflow-x-auto
            "
          >

            <table
              className="
                min-w-full
                divide-y
                divide-slate-200
              "
            >

              <thead
                className="
                  bg-slate-50
                "
              >

                <tr>

                  <TableHeading>
                    Lead
                  </TableHeading>

                  <TableHeading>
                    Contact
                  </TableHeading>

                  <TableHeading>
                    Priority
                  </TableHeading>

                  <TableHeading>
                    Status
                  </TableHeading>

                  <TableHeading>
                    Last Activity
                  </TableHeading>

                  <TableHeading>
                    Added
                  </TableHeading>

                  <TableHeading
                    align="right"
                  >
                    Action
                  </TableHeading>

                </tr>

              </thead>


              <tbody
                className="
                  divide-y
                  divide-slate-100
                  bg-white
                "
              >

                {leads.map(
                  (lead) => {

                    const latestActivity =
                      lead.activities[0]


                    return (

                      <tr
                        key={lead.id}
                        className="
                          transition
                          hover:bg-slate-50/70
                        "
                      >

                        {/* LEAD */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5
                            py-4
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
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-50
                                text-sm
                                font-bold
                                text-blue-600
                              "
                            >
                              {getInitials(
                                lead.firstName,
                                lead.lastName
                              )}
                            </div>


                            <div>

                              <Link
                                href={
                                  `/admin/sales/leads/${lead.id}`
                                }
                                className="
                                  font-semibold
                                  text-slate-950
                                  hover:text-blue-600
                                "
                              >
                                {lead.firstName}

                                {lead.lastName
                                  ? ` ${lead.lastName}`
                                  : ""}
                              </Link>


                              <div
                                className="
                                  mt-1
                                  flex
                                  items-center
                                  gap-1.5
                                  text-xs
                                  text-slate-500
                                "
                              >
                                <Building2
                                  className="h-3.5 w-3.5"
                                />

                                {lead.companyName ||
                                  "No company"}
                              </div>

                            </div>

                          </div>

                        </td>


                        {/* CONTACT */}

                        <td
                          className="
                            px-5
                            py-4
                          "
                        >

                          <div
                            className="
                              space-y-1.5
                              text-sm
                            "
                          >

                            {lead.email ? (

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-2
                                  text-slate-700
                                "
                              >
                                <Mail
                                  className="
                                    h-4
                                    w-4
                                    text-green-600
                                  "
                                />

                                <span
                                  className="
                                    max-w-[220px]
                                    truncate
                                  "
                                >
                                  {lead.email}
                                </span>
                              </div>

                            ) : (

                              <div
                                className="
                                  text-xs
                                  text-slate-400
                                "
                              >
                                No email
                              </div>

                            )}


                            {lead.phone && (

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-2
                                  text-slate-600
                                "
                              >
                                <Phone
                                  className="
                                    h-4
                                    w-4
                                    text-orange-600
                                  "
                                />

                                {lead.phone}
                              </div>

                            )}

                          </div>

                        </td>


                        {/* PRIORITY */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5
                            py-4
                          "
                        >

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              border
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              ${priorityClass(
                                lead.priority
                              )}
                            `}
                          >
                            {lead.priority ||
                              "Normal"}
                          </span>

                        </td>


                        {/* STATUS */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5
                            py-4
                          "
                        >

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              border
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              ${statusClass(
                                lead.status
                              )}
                            `}
                          >
                            {formatStatus(
                              lead.status
                            )}
                          </span>

                        </td>


                        {/* LAST ACTIVITY */}

                        <td
                          className="
                            min-w-[220px]
                            px-5
                            py-4
                          "
                        >

                          {latestActivity ? (

                            <div>

                              <div
                                className="
                                  max-w-[260px]
                                  truncate
                                  text-sm
                                  font-medium
                                  text-slate-700
                                "
                              >
                                {latestActivity.title}
                              </div>


                              <div
                                className="
                                  mt-1
                                  flex
                                  items-center
                                  gap-1.5
                                  text-xs
                                  text-slate-400
                                "
                              >
                                <Clock3
                                  className="h-3.5 w-3.5"
                                />

                                {formatDate(
                                  latestActivity.createdAt
                                )}
                              </div>

                            </div>

                          ) : (

                            <span
                              className="
                                text-sm
                                text-slate-400
                              "
                            >
                              No activity yet
                            </span>

                          )}

                        </td>


                        {/* CREATED */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5
                            py-4
                            text-sm
                            text-slate-500
                          "
                        >
                          {formatDate(
                            lead.createdAt
                          )}
                        </td>


                        {/* ACTION */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5
                            py-4
                            text-right
                          "
                        >

                          <Link
                            href={
                              `/admin/sales/leads/${lead.id}`
                            }
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-lg
                              bg-blue-50
                              px-3
                              py-2
                              text-sm
                              font-semibold
                              text-blue-700
                              transition
                              hover:bg-blue-100
                            "
                          >
                            Outreach

                            <ArrowRight
                              className="h-4 w-4"
                            />
                          </Link>

                        </td>

                      </tr>

                    )
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* ====================================================
          CHANNEL SUMMARY
      ===================================================== */}

      <section
        className="
          grid
          gap-4
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        <ChannelCard
          title="Email Outreach"
          description="Send personalized sales emails and automatically record the interaction."
          icon={
            <Mail
              className="h-5 w-5"
            />
          }
          iconClass="
            bg-green-50
            text-green-600
          "
        />


        <ChannelCard
          title="Phone Calls"
          description="Call prospects directly and record the outcome and follow-up notes."
          icon={
            <Phone
              className="h-5 w-5"
            />
          }
          iconClass="
            bg-orange-50
            text-orange-600
          "
        />


        <ChannelCard
          title="Social Outreach"
          description="Track WhatsApp, LinkedIn, Facebook, Instagram, and other conversations."
          icon={
            <MessageCircle
              className="h-5 w-5"
            />
          }
          iconClass="
            bg-blue-50
            text-blue-600
          "
        />


        <ChannelCard
          title="Demo Qualification"
          description="Move interested prospects into the demo request and handoff workflow."
          icon={
            <UserRound
              className="h-5 w-5"
            />
          }
          iconClass="
            bg-violet-50
            text-violet-600
          "
        />

      </section>

    </div>
  )
}


/* ==========================================================
   STAT CARD
========================================================== */

function StatCard({
  label,
  value,
  description,
  icon,
  iconClass,
}: {
  label: string
  value: number
  description: string
  icon: React.ReactNode
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
          {icon}
        </div>

      </div>


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
  )
}


/* ==========================================================
   TABLE HEADING
========================================================== */

function TableHeading({
  children,
  align = "left",
}: {
  children: React.ReactNode
  align?: "left" | "right"
}) {

  return (

    <th
      className={`
        whitespace-nowrap
        px-5
        py-3.5
        text-xs
        font-semibold
        uppercase
        tracking-wide
        text-slate-500

        ${
          align === "right"
            ? "text-right"
            : "text-left"
        }
      `}
    >
      {children}
    </th>
  )
}


/* ==========================================================
   WORKFLOW BADGE
========================================================== */

function WorkflowBadge({
  children,
}: {
  children: React.ReactNode
}) {

  return (

    <span
      className="
        rounded-lg
        border
        border-blue-200
        bg-white
        px-3
        py-2
        text-blue-700
      "
    >
      {children}
    </span>
  )
}


/* ==========================================================
   CHANNEL CARD
========================================================== */

function ChannelCard({
  title,
  description,
  icon,
  iconClass,
}: {
  title: string
  description: string
  icon: React.ReactNode
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
        className={`
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          ${iconClass}
        `}
      >
        {icon}
      </div>


      <h3
        className="
          mt-4
          font-semibold
          text-slate-950
        "
      >
        {title}
      </h3>


      <p
        className="
          mt-2
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