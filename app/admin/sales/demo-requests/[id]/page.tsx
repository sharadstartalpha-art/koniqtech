import Link from "next/link"

import {
  notFound,
} from "next/navigation"

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Mail,
  Presentation,
  UserRound,
  XCircle,
} from "lucide-react"

import prisma from "@/shared/lib/prisma"

import {
  updateDemoStatusAction,
} from "../actions"


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

function formatDateTime(
  value: Date
) {

  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "long",
      timeStyle: "short",
    }
  ).format(value)

}


function formatSimpleDate(
  value: Date
) {

  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
    }
  ).format(value)

}


/* ==========================================================
   STATUS BADGE
========================================================== */

function StatusBadge({
  status,
}: {
  status: string
}) {

  const styles: Record<
    string,
    string
  > = {

    scheduled:
      "border-blue-200 bg-blue-50 text-blue-700",

    confirmed:
      "border-green-200 bg-green-50 text-green-700",

    completed:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    cancelled:
      "border-red-200 bg-red-50 text-red-700",

    rescheduled:
      "border-orange-200 bg-orange-50 text-orange-700",

    no_show:
      "border-slate-300 bg-slate-100 text-slate-700",

  }


  return (

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
        capitalize

        ${
          styles[status] ??
          styles.scheduled
        }
      `}
    >
      {status.replaceAll("_", " ")}
    </span>

  )
}


/* ==========================================================
   PAGE
========================================================== */

export default async function DemoRequestDetailPage({
  params,
}: PageProps) {

  const {
    id,
  } = await params


  /* --------------------------------------------------------
     FETCH DEMO
  --------------------------------------------------------- */

  const demo =
    await prisma.demoSchedule.findUnique({

      where: {
        id,
      },

      include: {

        company: true,

        marketer: {
          select: {
            id: true,
            employeeCode: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            designation: true,
          },
        },

        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

      },

    })


  if (!demo) {
    notFound()
  }


  /*
   * CompanyLead field names may differ across your schema.
   * We normalize them here so the UI remains simple.
   */

  const company =
    demo.company as any


  const companyName =
    company.companyName ??
    company.name ??
    company.businessName ??
    "Prospect Company"


  const companyEmail =
    company.email ??
    company.contactEmail ??
    null


  const companyPhone =
    company.phone ??
    company.contactPhone ??
    null


  const contactName =
    company.contactName ??
    company.ownerName ??
    company.firstName ??
    null


  const marketerName =
    `${demo.marketer.firstName} ${demo.marketer.lastName}`


  return (

    <div
      className="
        mx-auto
        max-w-7xl
        space-y-6
      "
    >

      {/* ====================================================
          BACK LINK
      ===================================================== */}

      <Link
        href="/admin/sales/demo-requests"
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
        <ArrowLeft className="h-4 w-4" />

        Back to Demo Requests
      </Link>


      {/* ====================================================
          PAGE HEADER
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-center
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
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-blue-50
              text-blue-600
            "
          >
            <Presentation className="h-6 w-6" />
          </div>


          <div>

            <div
              className="
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
                {companyName}
              </h1>


              <StatusBadge
                status={demo.status}
              />

            </div>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Demo request details and Marketing handoff information.
            </p>

          </div>

        </div>


        {/* MEETING BUTTON */}

        {demo.meetingLink && (

          <a
            href={demo.meetingLink}
            target="_blank"
            rel="noreferrer"
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
            <ExternalLink className="h-4 w-4" />

            Open Meeting
          </a>

        )}

      </div>


      {/* ====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div
        className="
          grid
          gap-4
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        {/* COMPANY */}

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
              justify-between
            "
          >

            <span
              className="
                text-sm
                text-slate-500
              "
            >
              Prospect
            </span>


            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-blue-600
              "
            >
              <Building2 className="h-4 w-4" />
            </div>

          </div>


          <p
            className="
              mt-4
              truncate
              text-lg
              font-bold
              text-slate-950
            "
          >
            {companyName}
          </p>

        </div>


        {/* MARKETER */}

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
              justify-between
            "
          >

            <span
              className="
                text-sm
                text-slate-500
              "
            >
              Marketing Owner
            </span>


            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-green-50
                text-green-600
              "
            >
              <UserRound className="h-4 w-4" />
            </div>

          </div>


          <p
            className="
              mt-4
              truncate
              text-lg
              font-bold
              text-slate-950
            "
          >
            {marketerName}
          </p>

        </div>


        {/* MEETING DATE */}

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
              justify-between
            "
          >

            <span
              className="
                text-sm
                text-slate-500
              "
            >
              Meeting Date
            </span>


            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-orange-50
                text-orange-600
              "
            >
              <CalendarDays className="h-4 w-4" />
            </div>

          </div>


          <p
            className="
              mt-4
              text-lg
              font-bold
              text-slate-950
            "
          >
            {formatSimpleDate(
              demo.meetingDate
            )}
          </p>

        </div>


        {/* STATUS */}

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
              justify-between
            "
          >

            <span
              className="
                text-sm
                text-slate-500
              "
            >
              Current Status
            </span>


            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-violet-50
                text-violet-600
              "
            >
              <CheckCircle2 className="h-4 w-4" />
            </div>

          </div>


          <div className="mt-4">

            <StatusBadge
              status={demo.status}
            />

          </div>

        </div>

      </div>


      {/* ====================================================
          MAIN GRID
      ===================================================== */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-[1.4fr_0.8fr]
        "
      >

        {/* ==================================================
            LEFT COLUMN
        =================================================== */}

        <div className="space-y-6">


          {/* MEETING INFORMATION */}

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
                bg-slate-50
                px-6
                py-5
              "
            >

              <CalendarDays
                className="
                  h-5
                  w-5
                  text-blue-600
                "
              />


              <div>

                <h2
                  className="
                    font-semibold
                    text-slate-950
                  "
                >
                  Meeting Information
                </h2>


                <p
                  className="
                    mt-0.5
                    text-sm
                    text-slate-500
                  "
                >
                  Scheduled demo date and connection details.
                </p>

              </div>

            </div>


            <div
              className="
                grid
                gap-6
                p-6
                md:grid-cols-2
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-400
                  "
                >
                  Date & Time
                </p>


                <div
                  className="
                    mt-2
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-slate-900
                  "
                >
                  <Clock3
                    className="
                      h-4
                      w-4
                      text-blue-600
                    "
                  />

                  {formatDateTime(
                    demo.meetingDate
                  )}
                </div>

              </div>


              <div>

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-400
                  "
                >
                  Meeting Link
                </p>


                {demo.meetingLink ? (

                  <a
                    href={demo.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      mt-2
                      inline-flex
                      items-center
                      gap-2
                      text-sm
                      font-medium
                      text-blue-600
                      hover:text-blue-700
                    "
                  >
                    Open meeting room

                    <ExternalLink className="h-4 w-4" />
                  </a>

                ) : (

                  <p
                    className="
                      mt-2
                      text-sm
                      text-slate-500
                    "
                  >
                    No meeting link added
                  </p>

                )}

              </div>

            </div>

          </section>


          {/* SALES HANDOFF */}

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
                bg-slate-50
                px-6
                py-5
              "
            >

              <FileText
                className="
                  h-5
                  w-5
                  text-violet-600
                "
              />


              <div>

                <h2
                  className="
                    font-semibold
                    text-slate-950
                  "
                >
                  Sales Handoff Notes
                </h2>


                <p
                  className="
                    mt-0.5
                    text-sm
                    text-slate-500
                  "
                >
                  Context collected by Sales before the demo.
                </p>

              </div>

            </div>


            <div className="p-6">

              {demo.notes ? (

                <p
                  className="
                    whitespace-pre-wrap
                    text-sm
                    leading-7
                    text-slate-700
                  "
                >
                  {demo.notes}
                </p>

              ) : (

                <div
                  className="
                    rounded-xl
                    border
                    border-dashed
                    border-slate-300
                    bg-slate-50
                    px-5
                    py-8
                    text-center
                  "
                >

                  <FileText
                    className="
                      mx-auto
                      h-6
                      w-6
                      text-slate-400
                    "
                  />


                  <p
                    className="
                      mt-2
                      text-sm
                      text-slate-500
                    "
                  >
                    No handoff notes were added.
                  </p>

                </div>

              )}

            </div>

          </section>


          {/* PROSPECT CONTACT */}

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
                bg-slate-50
                px-6
                py-5
              "
            >

              <Building2
                className="
                  h-5
                  w-5
                  text-blue-600
                "
              />


              <div>

                <h2
                  className="
                    font-semibold
                    text-slate-950
                  "
                >
                  Prospect Information
                </h2>


                <p
                  className="
                    mt-0.5
                    text-sm
                    text-slate-500
                  "
                >
                  Contact details available for this prospect.
                </p>

              </div>

            </div>


            <div
              className="
                grid
                gap-6
                p-6
                md:grid-cols-2
              "
            >

              <InfoItem
                label="Company"
                value={companyName}
              />


              <InfoItem
                label="Contact Person"
                value={contactName ?? "Not provided"}
              />


              <InfoItem
                label="Email"
                value={companyEmail ?? "Not provided"}
                icon="mail"
              />


              <InfoItem
                label="Phone"
                value={companyPhone ?? "Not provided"}
              />

            </div>

          </section>

        </div>


        {/* ==================================================
            RIGHT COLUMN
        =================================================== */}

        <div className="space-y-6">


          {/* MARKETING OWNER */}

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
                border-b
                border-slate-200
                bg-slate-50
                px-6
                py-5
              "
            >

              <h2
                className="
                  font-semibold
                  text-slate-950
                "
              >
                Marketing Owner
              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Employee responsible for the demo.
              </p>

            </div>


            <div className="p-6">

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
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-green-50
                    text-lg
                    font-bold
                    text-green-700
                  "
                >
                  {demo.marketer.firstName
                    .charAt(0)
                    .toUpperCase()}
                </div>


                <div className="min-w-0">

                  <p
                    className="
                      truncate
                      font-semibold
                      text-slate-950
                    "
                  >
                    {marketerName}
                  </p>


                  <p
                    className="
                      mt-0.5
                      truncate
                      text-sm
                      text-slate-500
                    "
                  >
                    {demo.marketer.designation ??
                      "Marketing"}
                  </p>

                </div>

              </div>


              <div
                className="
                  mt-5
                  space-y-3
                  border-t
                  border-slate-100
                  pt-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-slate-600
                  "
                >
                  <Mail className="h-4 w-4" />

                  {demo.marketer.email}
                </div>


                {demo.marketer.phone && (

                  <div
                    className="
                      text-sm
                      text-slate-600
                    "
                  >
                    {demo.marketer.phone}
                  </div>

                )}


                <p
                  className="
                    text-xs
                    text-slate-400
                  "
                >
                  Employee Code:{" "}
                  {demo.marketer.employeeCode}
                </p>

              </div>

            </div>

          </section>


          {/* CREATED BY */}

          <section
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
                font-semibold
                text-slate-950
              "
            >
              Request Created By
            </h2>


            <div className="mt-4">

              {demo.createdBy ? (

                <>
                  <p
                    className="
                      font-medium
                      text-slate-900
                    "
                  >
                    {demo.createdBy.name}
                  </p>


                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    {demo.createdBy.email}
                  </p>
                </>

              ) : (

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  Creator information unavailable
                </p>

              )}


              <p
                className="
                  mt-4
                  text-xs
                  text-slate-400
                "
              >
                Created{" "}
                {formatDateTime(
                  demo.createdAt
                )}
              </p>

            </div>

          </section>


          {/* STATUS MANAGEMENT */}

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
                border-b
                border-slate-200
                bg-slate-50
                px-6
                py-5
              "
            >

              <h2
                className="
                  font-semibold
                  text-slate-950
                "
              >
                Demo Status
              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Update the current demo stage.
              </p>

            </div>


            <div className="p-6">

              <form
                action={updateDemoStatusAction}
                className="space-y-4"
              >

                <input
                  type="hidden"
                  name="id"
                  value={demo.id}
                />


                <select
                  name="status"
                  defaultValue={demo.status}
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                >
                  <option value="scheduled">
                    Scheduled
                  </option>

                  <option value="confirmed">
                    Confirmed
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="rescheduled">
                    Rescheduled
                  </option>

                  <option value="no_show">
                    No Show
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>


                <button
                  type="submit"
                  className="
                    inline-flex
                    h-11
                    w-full
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
                  <CheckCircle2 className="h-4 w-4" />

                  Update Status
                </button>

              </form>

            </div>

          </section>

        </div>

      </div>

    </div>
  )
}


/* ==========================================================
   INFO ITEM
========================================================== */

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: "mail"
}) {

  return (

    <div>

      <p
        className="
          text-xs
          font-semibold
          uppercase
          tracking-wide
          text-slate-400
        "
      >
        {label}
      </p>


      <div
        className="
          mt-2
          flex
          items-center
          gap-2
          text-sm
          font-medium
          text-slate-900
        "
      >

        {icon === "mail" && (
          <Mail
            className="
              h-4
              w-4
              text-slate-400
            "
          />
        )}

        {value}

      </div>

    </div>
  )
}