import Link from "next/link"

import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Hash,
  MessageSquare,
  RefreshCcw,
  Send,
  Smartphone,
  XCircle
} from "lucide-react"

import {
  notFound,
  redirect
} from "next/navigation"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import SmsQueueActions from
  "../components/SmsQueueActions"

/* =========================================================
   TYPES
========================================================= */

type SmsQueueDetailPageProps = {
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
    return "—"
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  ).format(date)
}

function formatStatus(
  status: string
) {
  return status
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    )
}

function getStatusClasses(
  status: string
) {
  switch (
    status.toLowerCase()
  ) {
    case "sent":
    case "delivered":
      return `
        border-green-200
        bg-green-50
        text-green-700
      `

    case "pending":
    case "queued":
    case "scheduled":
      return `
        border-orange-200
        bg-orange-50
        text-orange-700
      `

    case "processing":
    case "sending":
      return `
        border-blue-200
        bg-blue-50
        text-blue-700
      `

    case "failed":
      return `
        border-red-200
        bg-red-50
        text-red-700
      `

    case "cancelled":
      return `
        border-slate-200
        bg-slate-100
        text-slate-600
      `

    default:
      return `
        border-slate-200
        bg-slate-50
        text-slate-700
      `
  }
}

function getStatusIcon(
  status: string
) {
  switch (
    status.toLowerCase()
  ) {
    case "sent":
    case "delivered":
      return (
        <CheckCircle2
          size={22}
          className="text-green-600"
        />
      )

    case "failed":
      return (
        <XCircle
          size={22}
          className="text-red-600"
        />
      )

    case "processing":
    case "sending":
      return (
        <RefreshCcw
          size={22}
          className="text-blue-600"
        />
      )

    case "cancelled":
      return (
        <XCircle
          size={22}
          className="text-slate-500"
        />
      )

    default:
      return (
        <Clock3
          size={22}
          className="text-orange-600"
        />
      )
  }
}

/* =========================================================
   PAGE
========================================================= */

export default async function SmsQueueDetailPage({
  params
}: SmsQueueDetailPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = String(
    (
      session.user as {
        orgId?: string
      }
    ).orgId ?? ""
  )

  if (!orgId) {
    redirect(
      "/admin/marketing/sms-queue"
    )
  }

  const { id } =
    await params

  /* =======================================================
     SMS RECORD
  ======================================================= */

  const sms =
    await prisma.smsQueue.findFirst({
      where: {
        id,
        orgId
      }
    })

  if (!sms) {
    notFound()
  }

  /* =======================================================
     STATUS CONDITIONS
  ======================================================= */

  const normalizedStatus =
    String(sms.status).toLowerCase()

  const isCompleted =
    normalizedStatus === "sent" ||
    normalizedStatus === "delivered"

  const canRetry =
    normalizedStatus === "failed" ||
    normalizedStatus === "cancelled"

  const canCancel = [
    "pending",
    "queued",
    "scheduled",
    "processing",
    "sending"
  ].includes(normalizedStatus)

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="
      min-h-screen
      bg-slate-50
    ">
      <div className="
        mx-auto
        max-w-[1400px]
        p-6
        lg:p-8
      ">
        {/* BACK */}

        <Link
          href="/admin/marketing/sms-queue"
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
          <ArrowLeft size={17} />

          Back to SMS Queue
        </Link>

        {/* HEADER */}

        <div className="
          mt-6
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-start
          lg:justify-between
        ">
          <div>
            <p className="
              text-sm
              font-medium
              text-blue-600
            ">
              Communication
            </p>

            <div className="
              mt-2
              flex
              flex-wrap
              items-center
              gap-3
            ">
              <h1 className="
                text-3xl
                font-bold
                tracking-tight
                text-slate-950
              ">
                SMS Details
              </h1>

              <span
                className={`
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  ${getStatusClasses(
                    sms.status
                  )}
                `}
              >
                {getStatusIcon(
                  sms.status
                )}

                {formatStatus(
                  sms.status
                )}
              </span>
            </div>

            <p className="
              mt-2
              text-slate-500
            ">
              Review internal SMS delivery
              information, provider processing,
              attempts, scheduling, and errors.
            </p>
          </div>

          {/* ACTIONS */}

          <SmsQueueActions
            smsId={sms.id}
            status={sms.status}
            redirectAfterDelete
          />
        </div>

        {/* SUMMARY */}

        <div className="
          mt-8
          grid
          gap-4
          md:grid-cols-2
          xl:grid-cols-4
        ">
          <SummaryCard
            title="Recipient"
            value={sms.phone}
            icon={
              <Smartphone size={21} />
            }
            iconClass="
              bg-blue-50
              text-blue-600
            "
          />

          <SummaryCard
            title="Status"
            value={formatStatus(
              sms.status
            )}
            icon={
              getStatusIcon(
                sms.status
              )
            }
            iconClass="bg-slate-50"
          />

          <SummaryCard
            title="Attempts"
            value={String(
              sms.attempts
            )}
            icon={
              <RefreshCcw size={21} />
            }
            iconClass="
              bg-orange-50
              text-orange-600
            "
          />

          <SummaryCard
            title="Provider"
            value={
              sms.provider ??
              "Not assigned"
            }
            icon={
              <Send size={21} />
            }
            iconClass="
              bg-green-50
              text-green-600
            "
          />
        </div>

        {/* CONTENT */}

        <div className="
          mt-7
          grid
          gap-6
          xl:grid-cols-[1.5fr_0.8fr]
        ">
          {/* LEFT */}

          <div className="space-y-6">
            {/* MESSAGE */}

            <section className="
              rounded-3xl
              border
              bg-white
              p-6
              shadow-sm
            ">
              <div className="
                flex
                items-center
                gap-3
              ">
                <div className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-blue-50
                  text-blue-600
                ">
                  <MessageSquare
                    size={21}
                  />
                </div>

                <div>
                  <h2 className="
                    font-bold
                    text-slate-950
                  ">
                    Message Content
                  </h2>

                  <p className="
                    mt-1
                    text-sm
                    text-slate-500
                  ">
                    SMS content queued for
                    internal marketing delivery.
                  </p>
                </div>
              </div>

              <div className="
                mt-6
                rounded-2xl
                border
                bg-slate-50
                p-5
              ">
                <p className="
                  whitespace-pre-wrap
                  break-words
                  text-sm
                  leading-7
                  text-slate-700
                ">
                  {sms.message}
                </p>
              </div>

              <div className="
                mt-4
                flex
                justify-end
              ">
                <p className="
                  text-xs
                  text-slate-400
                ">
                  {sms.message.length}
                  {" "}
                  characters
                </p>
              </div>
            </section>

            {/* ERROR */}

            {sms.errorMessage && (
              <section className="
                rounded-3xl
                border
                border-red-200
                bg-red-50
                p-6
              ">
                <div className="
                  flex
                  items-start
                  gap-4
                ">
                  <div className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-red-100
                    text-red-600
                  ">
                    <AlertCircle
                      size={22}
                    />
                  </div>

                  <div>
                    <h2 className="
                      font-bold
                      text-red-900
                    ">
                      Delivery Error
                    </h2>

                    <p className="
                      mt-2
                      whitespace-pre-wrap
                      break-words
                      text-sm
                      leading-6
                      text-red-700
                    ">
                      {sms.errorMessage}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* TIMELINE */}

            <section className="
              rounded-3xl
              border
              bg-white
              p-6
              shadow-sm
            ">
              <div className="
                flex
                items-center
                gap-3
              ">
                <div className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-green-50
                  text-green-600
                ">
                  <CalendarClock
                    size={21}
                  />
                </div>

                <div>
                  <h2 className="
                    font-bold
                    text-slate-950
                  ">
                    Delivery Timeline
                  </h2>

                  <p className="
                    mt-1
                    text-sm
                    text-slate-500
                  ">
                    Queue processing and
                    delivery timestamps.
                  </p>
                </div>
              </div>

              <div className="
                mt-6
                divide-y
              ">
                <TimelineRow
                  label="Created"
                  value={formatDate(
                    sms.createdAt
                  )}
                />

                <TimelineRow
                  label="Scheduled"
                  value={formatDate(
                    sms.scheduledAt
                  )}
                />

                <TimelineRow
                  label="Sent"
                  value={formatDate(
                    sms.sentAt
                  )}
                />

                <TimelineRow
                  label="Last Updated"
                  value={formatDate(
                    sms.updatedAt
                  )}
                />
              </div>
            </section>
          </div>

          {/* RIGHT */}

          <div className="space-y-6">
            {/* DELIVERY DETAILS */}

            <section className="
              rounded-3xl
              border
              bg-white
              p-6
              shadow-sm
            ">
              <h2 className="
                font-bold
                text-slate-950
              ">
                Delivery Details
              </h2>

              <div className="
                mt-5
                space-y-5
              ">
                <DetailRow
                  label="Phone Number"
                  value={sms.phone}
                />

                <DetailRow
                  label="Provider"
                  value={
                    sms.provider ??
                    "—"
                  }
                />

                <DetailRow
                  label="Provider Message ID"
                  value={
                    sms.providerMessageId ??
                    "—"
                  }
                  mono
                />

                <DetailRow
                  label="Status"
                  value={formatStatus(
                    sms.status
                  )}
                />

                <DetailRow
                  label="Delivery Attempts"
                  value={String(
                    sms.attempts
                  )}
                />

                <DetailRow
                  label="Queue ID"
                  value={sms.id}
                  mono
                />
              </div>
            </section>

            {/* PROVIDER TRACKING */}

            <section className="
              rounded-3xl
              border
              bg-white
              p-6
              shadow-sm
            ">
              <div className="
                flex
                items-center
                gap-3
              ">
                <div className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                ">
                  <Hash size={19} />
                </div>

                <div>
                  <h2 className="
                    font-bold
                    text-slate-950
                  ">
                    Provider Tracking
                  </h2>

                  <p className="
                    text-sm
                    text-slate-500
                  ">
                    External delivery reference.
                  </p>
                </div>
              </div>

              <div className="
                mt-5
                rounded-2xl
                bg-slate-50
                p-4
              ">
                <p className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-400
                ">
                  Provider Message ID
                </p>

                <p className="
                  mt-2
                  break-all
                  font-mono
                  text-xs
                  text-slate-700
                ">
                  {sms.providerMessageId ??
                    "Not available yet"}
                </p>
              </div>
            </section>

            {/* CURRENT STATE */}

            <section className="
              rounded-3xl
              border
              bg-white
              p-6
              shadow-sm
            ">
              <h2 className="
                font-bold
                text-slate-950
              ">
                Current State
              </h2>

              <div className="
                mt-5
                flex
                items-start
                gap-3
              ">
                {getStatusIcon(
                  sms.status
                )}

                <div>
                  <p className="
                    font-semibold
                    text-slate-900
                  ">
                    {formatStatus(
                      sms.status
                    )}
                  </p>

                  <p className="
                    mt-1
                    text-sm
                    leading-6
                    text-slate-500
                  ">
                    {isCompleted
                      ? "This SMS has completed its delivery workflow."
                      : canRetry
                        ? "This SMS can be returned to the internal delivery queue."
                        : canCancel
                          ? "This SMS is currently awaiting or undergoing processing."
                          : "Review the current queue status before taking further action."}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  icon,
  iconClass
}: {
  title: string
  value: string
  icon: React.ReactNode
  iconClass: string
}) {
  return (
    <div className="
      rounded-3xl
      border
      bg-white
      p-5
      shadow-sm
    ">
      <div className="
        flex
        items-start
        justify-between
        gap-4
      ">
        <div className="min-w-0">
          <p className="
            text-sm
            text-slate-500
          ">
            {title}
          </p>

          <p className="
            mt-2
            truncate
            text-xl
            font-bold
            text-slate-950
          ">
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
            rounded-2xl
            ${iconClass}
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   TIMELINE ROW
========================================================= */

function TimelineRow({
  label,
  value
}: {
  label: string
  value: string
}) {
  return (
    <div className="
      flex
      items-center
      justify-between
      gap-6
      py-4
      first:pt-0
      last:pb-0
    ">
      <span className="
        text-sm
        text-slate-500
      ">
        {label}
      </span>

      <span className="
        text-right
        text-sm
        font-medium
        text-slate-900
      ">
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
  mono = false
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <p className="
        text-xs
        font-semibold
        uppercase
        tracking-wide
        text-slate-400
      ">
        {label}
      </p>

      <p
        className={`
          mt-1
          break-all
          text-sm
          text-slate-800
          ${
            mono
              ? "font-mono text-xs"
              : "font-medium"
          }
        `}
      >
        {value}
      </p>
    </div>
  )
}