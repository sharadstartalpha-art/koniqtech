"use client"

import Link from "next/link"

import {
  useActionState,
  useEffect,
  useState,
} from "react"

import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  Mail,
  Save,
  Send,
  Users,
} from "lucide-react"

import {
  createNewsletterAction,
  type NewsletterActionState,
} from "../actions"

/* =========================================================
   INITIAL STATE
========================================================= */

const INITIAL_STATE: NewsletterActionState = {
  success: false,
  message: "",
}

/* =========================================================
   OPTIONS
========================================================= */

const AUDIENCE_OPTIONS = [
  {
    value: "all",
    label: "All Marketing Contacts",
  },
  {
    value: "prospects",
    label: "Prospects",
  },
  {
    value: "demo_scheduled",
    label: "Demo Scheduled",
  },
  {
    value: "demo_completed",
    label: "Demo Completed",
  },
  {
    value: "trial",
    label: "Trial Users",
  },
  {
    value: "customers",
    label: "Customers",
  },
]

/* =========================================================
   COMPONENT
========================================================= */

export default function NewsletterForm() {
  const [state, formAction, pending] = useActionState(
    createNewsletterAction,
    INITIAL_STATE
  )

  const [deliveryMode, setDeliveryMode] = useState<
    "draft" | "schedule" | "send_now"
  >("draft")

  const [subject, setSubject] = useState("")
  const [previewText, setPreviewText] = useState("")
  const [content, setContent] = useState("")

  /* =======================================================
     SUCCESS MESSAGE CLEANUP
  ======================================================= */

  useEffect(() => {
    if (!state.success) {
      return
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [state.success])

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <form
      action={formAction}
      className="space-y-8"
    >
      {/* ===================================================
          ACTION STATE
      =================================================== */}

      {state.message && (
        <div
          className={`
            flex
            items-start
            gap-3
            rounded-xl
            border
            p-4
            ${
              state.success
                ? `
                  border-green-200
                  bg-green-50
                  text-green-800
                `
                : `
                  border-red-200
                  bg-red-50
                  text-red-800
                `
            }
          `}
        >
          {state.success ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          )}

          <div>
            <p className="font-semibold">
              {state.success
                ? "Newsletter saved"
                : "Unable to save newsletter"}
            </p>

            <p className="mt-1 text-sm">
              {state.message}
            </p>
          </div>
        </div>
      )}

      {/* ===================================================
          BASIC INFORMATION
      =================================================== */}

      <section className="space-y-5">
        <SectionHeading
          icon={FileText}
          title="Newsletter Information"
          description="Add the internal title and email subject line."
        />

        <div
          className="
            grid
            gap-5
            lg:grid-cols-2
          "
        >
          {/* TITLE */}

          <Field>
            <Label htmlFor="title">
              Newsletter Title
            </Label>

            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="July Product Update"
              className={INPUT_CLASS}
            />

            <HelpText>
              Internal name used in the admin dashboard.
            </HelpText>
          </Field>

          {/* SUBJECT */}

          <Field>
            <Label htmlFor="subject">
              Email Subject
            </Label>

            <input
              id="subject"
              name="subject"
              type="text"
              required
              value={subject}
              onChange={(event) =>
                setSubject(event.target.value)
              }
              placeholder="New tools to help grow your business"
              className={INPUT_CLASS}
            />

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <HelpText>
                Keep the subject concise and clear.
              </HelpText>

              <span className="text-xs text-slate-400">
                {subject.length} characters
              </span>
            </div>
          </Field>
        </div>

        {/* PREVIEW TEXT */}

        <Field>
          <Label htmlFor="previewText">
            Preview Text
          </Label>

          <input
            id="previewText"
            name="previewText"
            type="text"
            value={previewText}
            onChange={(event) =>
              setPreviewText(event.target.value)
            }
            placeholder="A quick preview of what is inside this newsletter..."
            className={INPUT_CLASS}
          />

          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <HelpText>
              Displayed next to the subject in supported email
              clients.
            </HelpText>

            <span className="text-xs text-slate-400">
              {previewText.length} characters
            </span>
          </div>
        </Field>
      </section>

      <Divider />

      {/* ===================================================
          AUDIENCE
      =================================================== */}

      <section className="space-y-5">
        <SectionHeading
          icon={Users}
          title="Audience"
          description="Select the marketing segment that should receive this newsletter."
        />

        <div
          className="
            grid
            gap-5
            lg:grid-cols-2
          "
        >
          <Field>
            <Label htmlFor="audience">
              Target Audience
            </Label>

            <select
              id="audience"
              name="audience"
              defaultValue="all"
              className={INPUT_CLASS}
            >
              {AUDIENCE_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <HelpText>
              Recipients should be resolved on the server before
              queue creation.
            </HelpText>
          </Field>

          <div
            className="
              rounded-xl
              border
              border-blue-200
              bg-blue-50
              p-4
            "
          >
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

              <div>
                <p className="font-semibold text-blue-950">
                  Audience Safety
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    leading-6
                    text-blue-800
                  "
                >
                  Final recipient filtering should exclude
                  unsubscribed, invalid, bounced, or suppressed
                  email addresses before messages enter the queue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ===================================================
          CONTENT
      =================================================== */}

      <section className="space-y-5">
        <SectionHeading
          icon={Mail}
          title="Newsletter Content"
          description="Write the HTML or text content for the newsletter."
        />

        <Field>
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <Label htmlFor="content">
              Email Content
            </Label>

            <span className="text-xs text-slate-400">
              {content.length} characters
            </span>
          </div>

          <textarea
            id="content"
            name="content"
            required
            rows={16}
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            placeholder={`<h1>Welcome to our newsletter</h1>

<p>Write your newsletter content here...</p>`}
            className={`
              ${INPUT_CLASS}
              min-h-[360px]
              resize-y
              font-mono
              text-sm
              leading-6
            `}
          />

          <HelpText>
            HTML content can be stored now and processed by your
            email worker before delivery.
          </HelpText>
        </Field>
      </section>

      <Divider />

      {/* ===================================================
          DELIVERY MODE
      =================================================== */}

      <section className="space-y-5">
        <SectionHeading
          icon={CalendarClock}
          title="Delivery"
          description="Choose how this newsletter should be processed."
        />

        <input
          type="hidden"
          name="deliveryMode"
          value={deliveryMode}
        />

        <div
          className="
            grid
            gap-4
            md:grid-cols-3
          "
        >
          <DeliveryOption
            active={deliveryMode === "draft"}
            icon={Save}
            title="Save Draft"
            description="Save without scheduling delivery."
            onClick={() =>
              setDeliveryMode("draft")
            }
          />

          <DeliveryOption
            active={deliveryMode === "schedule"}
            icon={Clock3}
            title="Schedule"
            description="Queue delivery for a future date."
            onClick={() =>
              setDeliveryMode("schedule")
            }
          />

          <DeliveryOption
            active={deliveryMode === "send_now"}
            icon={Send}
            title="Send Now"
            description="Queue the newsletter immediately."
            onClick={() =>
              setDeliveryMode("send_now")
            }
          />
        </div>

        {/* SCHEDULE DATE */}

        {deliveryMode === "schedule" && (
          <div
            className="
              rounded-xl
              border
              border-orange-200
              bg-orange-50
              p-5
            "
          >
            <Field>
              <Label htmlFor="scheduledAt">
                Schedule Date and Time
              </Label>

              <input
                id="scheduledAt"
                name="scheduledAt"
                type="datetime-local"
                required
                className={`
                  ${INPUT_CLASS}
                  max-w-md
                  bg-white
                `}
              />

              <HelpText>
                The server action should convert this value into
                a valid JavaScript Date before storing it.
              </HelpText>
            </Field>
          </div>
        )}
      </section>

      {/* ===================================================
          ACTIONS
      =================================================== */}

      <div
        className="
          flex
          flex-col-reverse
          gap-3
          border-t
          border-slate-200
          pt-6
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <Link
          href="/admin/marketing/newsletter"
          className="
            inline-flex
            min-h-11
            items-center
            justify-center
            rounded-xl
            bg-red-600
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-red-700
          "
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={pending}
          className={`
            inline-flex
            min-h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            px-6
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            disabled:cursor-not-allowed
            disabled:opacity-60
            ${
              deliveryMode === "draft"
                ? "bg-green-600 hover:bg-green-700"
                : deliveryMode === "schedule"
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : deliveryMode === "draft" ? (
            <>
              <Save className="h-4 w-4" />
              Save Draft
            </>
          ) : deliveryMode === "schedule" ? (
            <>
              <CalendarClock className="h-4 w-4" />
              Schedule Newsletter
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Queue Send
            </>
          )}
        </button>
      </div>
    </form>
  )
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{
    className?: string
  }>
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3">
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
        "
      >
        <Icon className="h-5 w-5 text-blue-600" />
      </div>

      <div>
        <h2
          className="
            font-bold
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

/* =========================================================
   DELIVERY OPTION
========================================================= */

function DeliveryOption({
  active,
  icon: Icon,
  title,
  description,
  onClick,
}: {
  active: boolean
  icon: React.ComponentType<{
    className?: string
  }>
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-xl
        border
        p-4
        text-left
        transition
        ${
          active
            ? `
              border-blue-500
              bg-blue-50
              ring-2
              ring-blue-100
            `
            : `
              border-slate-200
              bg-white
              hover:border-slate-300
              hover:bg-slate-50
            `
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            ${
              active
                ? "bg-blue-100"
                : "bg-slate-100"
            }
          `}
        >
          <Icon
            className={`
              h-4
              w-4
              ${
                active
                  ? "text-blue-700"
                  : "text-slate-600"
              }
            `}
          />
        </div>

        <div>
          <p
            className={`
              font-semibold
              ${
                active
                  ? "text-blue-950"
                  : "text-slate-950"
              }
            `}
          >
            {title}
          </p>

          <p
            className="
              mt-1
              text-sm
              leading-5
              text-slate-500
            "
          >
            {description}
          </p>
        </div>
      </div>
    </button>
  )
}

/* =========================================================
   SMALL UI HELPERS
========================================================= */

function Field({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      {children}
    </div>
  )
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="
        block
        text-sm
        font-semibold
        text-slate-700
      "
    >
      {children}
    </label>
  )
}

function HelpText({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <p
      className="
        text-xs
        leading-5
        text-slate-500
      "
    >
      {children}
    </p>
  )
}

function Divider() {
  return (
    <div className="border-t border-slate-200" />
  )
}

/* =========================================================
   SHARED INPUT CLASS
========================================================= */

const INPUT_CLASS = `
  w-full
  rounded-xl
  border
  border-slate-300
  bg-white
  px-4
  py-3
  text-sm
  text-slate-950
  outline-none
  transition
  placeholder:text-slate-400
  focus:border-blue-500
  focus:ring-4
  focus:ring-blue-100
`