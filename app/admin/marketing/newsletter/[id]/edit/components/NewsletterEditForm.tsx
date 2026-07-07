"use client"

import {
  useState,
  useTransition,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Eye,
  FileText,
  Loader2,
  Mail,
  Save,
  Send,
  Users,
} from "lucide-react"

import {
  NewsletterAudience,
  NewsletterStatus,
} from "@prisma/client"

import {
  updateNewsletterAction,
} from "../../../actions"

/* =========================================================
   TYPES
========================================================= */

type NewsletterFormData = {
  id: string

  title: string

  subject: string

  previewText: string

  content: string

  audience: NewsletterAudience

  status: NewsletterStatus

  scheduledAt: string
}

type NewsletterEditFormProps = {
  newsletter: NewsletterFormData

  disabled?: boolean
}

/* =========================================================
   AUDIENCE OPTIONS
========================================================= */

const AUDIENCE_OPTIONS: {
  value: NewsletterAudience
  label: string
  description: string
}[] = [
  {
    value: "all",
    label: "All Contacts",
    description:
      "Send to every eligible contact.",
  },
  {
    value: "prospects",
    label: "Prospects",
    description:
      "Companies and leads still in the sales pipeline.",
  },
  {
    value: "customers",
    label: "Customers",
    description:
      "Active customer organizations.",
  },
  {
    value: "trial",
    label: "Trial Customers",
    description:
      "Organizations currently evaluating the platform.",
  },
  {
    value: "inactive",
    label: "Inactive Customers",
    description:
      "Inactive or previously engaged customers.",
  },
]

/* =========================================================
   HELPERS
========================================================= */

function getContentText(
  html: string
) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function formatStatus(
  status: NewsletterStatus
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
  status: NewsletterStatus
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
   COMPONENT
========================================================= */

export default function NewsletterEditForm({
  newsletter,
  disabled = false,
}: NewsletterEditFormProps) {
  const router = useRouter()

  const [
    isPending,
    startTransition,
  ] = useTransition()

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [
    title,
    setTitle,
  ] = useState(
    newsletter.title
  )

  const [
    subject,
    setSubject,
  ] = useState(
    newsletter.subject
  )

  const [
    previewText,
    setPreviewText,
  ] = useState(
    newsletter.previewText
  )

  const [
    content,
    setContent,
  ] = useState(
    newsletter.content
  )

  const [
    audience,
    setAudience,
  ] =
    useState<NewsletterAudience>(
      newsletter.audience
    )

  const [
    scheduledAt,
    setScheduledAt,
  ] = useState(
    newsletter.scheduledAt
  )

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null)

  const [
    success,
    setSuccess,
  ] = useState<
    string | null
  >(null)

  const [
    showPreview,
    setShowPreview,
  ] = useState(false)

  /* =======================================================
     DERIVED VALUES
  ======================================================= */

  const contentText =
    getContentText(content)

  const wordCount =
    contentText.length === 0
      ? 0
      : contentText.split(/\s+/).length

  const characterCount =
    content.length

  const canEdit =
    !disabled &&
    !isPending

  /* =======================================================
     VALIDATION
  ======================================================= */

  function validate() {
    if (!title.trim()) {
      return "Newsletter title is required."
    }

    if (!subject.trim()) {
      return "Email subject is required."
    }

    if (!content.trim()) {
      return "Newsletter content is required."
    }

    if (
      newsletter.status ===
        "scheduled" &&
      !scheduledAt
    ) {
      return "Scheduled newsletters require a delivery date."
    }

    return null
  }

  /* =======================================================
     SAVE
  ======================================================= */

  function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError(null)
    setSuccess(null)

    const validationError =
      validate()

    if (validationError) {
      setError(
        validationError
      )

      return
    }

    startTransition(
      async () => {
        const formData =
          new FormData()

        formData.set(
          "title",
          title.trim()
        )

        formData.set(
          "subject",
          subject.trim()
        )

        formData.set(
          "previewText",
          previewText.trim()
        )

        formData.set(
          "content",
          content
        )

        formData.set(
          "audience",
          audience
        )

        if (scheduledAt) {
          formData.set(
            "scheduledAt",
            scheduledAt
          )
        }

        const response =
          await updateNewsletterAction(
            newsletter.id,
            formData
          )

        if (
          !response ||
          !response.success
        ) {
          setError(
            response?.message ??
              "Unable to update newsletter."
          )

          return
        }

        setSuccess(
          response.message ??
            "Newsletter updated successfully."
        )

        router.refresh()
      }
    )
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* =================================================
          MESSAGES
      ================================================= */}

      {error && (
        <div
          className="
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4
          "
        >
          <AlertCircle
            className="
              mt-0.5
              h-5
              w-5
              shrink-0
              text-red-600
            "
          />

          <div>
            <p
              className="
                text-sm
                font-semibold
                text-red-900
              "
            >
              Unable to save newsletter
            </p>

            <p
              className="
                mt-1
                text-sm
                text-red-700
              "
            >
              {error}
            </p>
          </div>
        </div>
      )}

      {success && (
        <div
          className="
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-green-200
            bg-green-50
            p-4
          "
        >
          <CheckCircle2
            className="
              mt-0.5
              h-5
              w-5
              shrink-0
              text-green-600
            "
          />

          <div>
            <p
              className="
                text-sm
                font-semibold
                text-green-900
              "
            >
              Changes saved
            </p>

            <p
              className="
                mt-1
                text-sm
                text-green-700
              "
            >
              {success}
            </p>
          </div>
        </div>
      )}

      {disabled && (
        <div
          className="
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-orange-200
            bg-orange-50
            p-4
          "
        >
          <AlertCircle
            className="
              mt-0.5
              h-5
              w-5
              shrink-0
              text-orange-600
            "
          />

          <div>
            <p
              className="
                text-sm
                font-semibold
                text-orange-950
              "
            >
              Editing is disabled
            </p>

            <p
              className="
                mt-1
                text-sm
                text-orange-800
              "
            >
              A newsletter that is
              sending or already sent
              cannot be modified.
            </p>
          </div>
        </div>
      )}

      {/* =================================================
          STATUS
      ================================================= */}

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-3
        "
      >
        <span
          className="
            text-sm
            font-semibold
            text-slate-700
          "
        >
          Current status
        </span>

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

      {/* =================================================
          BASIC INFORMATION
      ================================================= */}

      <section
        className="
          space-y-5
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
              bg-blue-50
            "
          >
            <FileText
              className="
                h-5
                w-5
                text-blue-600
              "
            />
          </div>

          <div>
            <h3
              className="
                font-bold
                text-slate-950
              "
            >
              Newsletter Information
            </h3>

            <p
              className="
                text-sm
                text-slate-500
              "
            >
              Internal title and email
              presentation settings.
            </p>
          </div>
        </div>

        <div
          className="
            grid
            gap-5
            lg:grid-cols-2
          "
        >
          {/* TITLE */}

          <div className="space-y-2">
            <label
              htmlFor="newsletter-title"
              className="
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Newsletter Title
            </label>

            <input
              id="newsletter-title"
              type="text"
              value={title}
              onChange={(
                event
              ) =>
                setTitle(
                  event.target.value
                )
              }
              disabled={!canEdit}
              placeholder="Monthly Product Update"
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-3
                text-sm
                text-slate-950
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
                disabled:cursor-not-allowed
                disabled:bg-slate-100
                disabled:text-slate-500
              "
            />
          </div>

          {/* SUBJECT */}

          <div className="space-y-2">
            <label
              htmlFor="newsletter-subject"
              className="
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Email Subject
            </label>

            <div className="relative">
              <Mail
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                id="newsletter-subject"
                type="text"
                value={subject}
                onChange={(
                  event
                ) =>
                  setSubject(
                    event.target.value
                  )
                }
                disabled={!canEdit}
                placeholder="See what's new this month"
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  pl-10
                  pr-3
                  text-sm
                  text-slate-950
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                  disabled:cursor-not-allowed
                  disabled:bg-slate-100
                  disabled:text-slate-500
                "
              />
            </div>

            <p
              className="
                text-right
                text-xs
                text-slate-400
              "
            >
              {subject.length}/150
            </p>
          </div>
        </div>

        {/* PREVIEW TEXT */}

        <div className="space-y-2">
          <label
            htmlFor="preview-text"
            className="
              text-sm
              font-semibold
              text-slate-700
            "
          >
            Preview Text
          </label>

          <textarea
            id="preview-text"
            value={previewText}
            onChange={(
              event
            ) =>
              setPreviewText(
                event.target.value
              )
            }
            disabled={!canEdit}
            rows={3}
            maxLength={250}
            placeholder="Short inbox preview shown beside the subject line..."
            className="
              w-full
              resize-y
              rounded-xl
              border
              border-slate-300
              bg-white
              px-3
              py-3
              text-sm
              text-slate-950
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
              disabled:cursor-not-allowed
              disabled:bg-slate-100
              disabled:text-slate-500
            "
          />

          <p
            className="
              text-right
              text-xs
              text-slate-400
            "
          >
            {previewText.length}/250
          </p>
        </div>
      </section>

      <div
        className="
          border-t
          border-slate-200
        "
      />

      {/* =================================================
          AUDIENCE
      ================================================= */}

      <section className="space-y-5">
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
            "
          >
            <Users
              className="
                h-5
                w-5
                text-green-600
              "
            />
          </div>

          <div>
            <h3
              className="
                font-bold
                text-slate-950
              "
            >
              Newsletter Audience
            </h3>

            <p
              className="
                text-sm
                text-slate-500
              "
            >
              Select the audience segment
              for this newsletter.
            </p>
          </div>
        </div>

        <div
          className="
            grid
            gap-3
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {AUDIENCE_OPTIONS.map(
            (option) => {
              const selected =
                audience ===
                option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={!canEdit}
                  onClick={() =>
                    setAudience(
                      option.value
                    )
                  }
                  className={`
                    rounded-xl
                    border
                    p-4
                    text-left
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    ${
                      selected
                        ? `
                          border-blue-300
                          bg-blue-50
                          ring-2
                          ring-blue-100
                        `
                        : `
                          border-slate-200
                          bg-white
                          hover:border-blue-200
                          hover:bg-blue-50/40
                        `
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >
                    <div>
                      <p
                        className="
                          text-sm
                          font-bold
                          text-slate-950
                        "
                      >
                        {option.label}
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          leading-5
                          text-slate-500
                        "
                      >
                        {
                          option.description
                        }
                      </p>
                    </div>

                    <div
                      className={`
                        mt-0.5
                        flex
                        h-5
                        w-5
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        ${
                          selected
                            ? `
                              border-blue-600
                              bg-blue-600
                            `
                            : `
                              border-slate-300
                              bg-white
                            `
                        }
                      `}
                    >
                      {selected && (
                        <CheckCircle2
                          className="
                            h-4
                            w-4
                            text-white
                          "
                        />
                      )}
                    </div>
                  </div>
                </button>
              )
            }
          )}
        </div>
      </section>

      <div
        className="
          border-t
          border-slate-200
        "
      />

      {/* =================================================
          CONTENT
      ================================================= */}

      <section className="space-y-5">
        <div
          className="
            flex
            flex-col
            gap-3
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
                bg-orange-50
              "
            >
              <Mail
                className="
                  h-5
                  w-5
                  text-orange-600
                "
              />
            </div>

            <div>
              <h3
                className="
                  font-bold
                  text-slate-950
                "
              >
                Email Content
              </h3>

              <p
                className="
                  text-sm
                  text-slate-500
                "
              >
                Write or edit the newsletter
                body.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowPreview(
                (current) =>
                  !current
              )
            }
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
              py-2
              text-sm
              font-semibold
              text-blue-700
              transition
              hover:bg-blue-100
            "
          >
            <Eye className="h-4 w-4" />

            {showPreview
              ? "Hide Preview"
              : "Preview"}
          </button>
        </div>

        {!showPreview ? (
          <div className="space-y-2">
            <textarea
              value={content}
              onChange={(
                event
              ) =>
                setContent(
                  event.target.value
                )
              }
              disabled={!canEdit}
              rows={18}
              placeholder="Write your newsletter content..."
              className="
                w-full
                resize-y
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                py-4
                font-mono
                text-sm
                leading-6
                text-slate-950
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
                disabled:cursor-not-allowed
                disabled:bg-slate-100
                disabled:text-slate-500
              "
            />

            <div
              className="
                flex
                items-center
                justify-between
                text-xs
                text-slate-400
              "
            >
              <span>
                {wordCount} words
              </span>

              <span>
                {characterCount} characters
              </span>
            </div>
          </div>
        ) : (
          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-slate-100
              p-4
              sm:p-8
            "
          >
            <div
              className="
                mx-auto
                max-w-2xl
                rounded-xl
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

                <h4
                  className="
                    mt-1
                    text-lg
                    font-bold
                    text-slate-950
                  "
                >
                  {subject ||
                    "Newsletter Subject"}
                </h4>

                {previewText && (
                  <p
                    className="
                      mt-2
                      text-sm
                      text-slate-500
                    "
                  >
                    {previewText}
                  </p>
                )}
              </div>

              <div
                className="
                  px-6
                  py-6
                "
              >
                <div
                  className="
                    whitespace-pre-wrap
                    text-sm
                    leading-7
                    text-slate-700
                  "
                >
                  {content ||
                    "Newsletter content preview will appear here."}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <div
        className="
          border-t
          border-slate-200
        "
      />

      {/* =================================================
          SCHEDULE
      ================================================= */}

      <section className="space-y-5">
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
              bg-blue-50
            "
          >
            <CalendarClock
              className="
                h-5
                w-5
                text-blue-600
              "
            />
          </div>

          <div>
            <h3
              className="
                font-bold
                text-slate-950
              "
            >
              Delivery Schedule
            </h3>

            <p
              className="
                text-sm
                text-slate-500
              "
            >
              Change the scheduled delivery
              date when applicable.
            </p>
          </div>
        </div>

        <div
          className="
            max-w-md
            space-y-2
          "
        >
          <label
            htmlFor="scheduled-at"
            className="
              text-sm
              font-semibold
              text-slate-700
            "
          >
            Scheduled Date & Time
          </label>

          <input
            id="scheduled-at"
            type="datetime-local"
            value={scheduledAt}
            onChange={(
              event
            ) =>
              setScheduledAt(
                event.target.value
              )
            }
            disabled={!canEdit}
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              px-3
              text-sm
              text-slate-950
              outline-none
              transition
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
              disabled:cursor-not-allowed
              disabled:bg-slate-100
              disabled:text-slate-500
            "
          />
        </div>
      </section>

      {/* =================================================
          ACTION BAR
      ================================================= */}

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
        <button
          type="button"
          onClick={() =>
            router.back()
          }
          className="
            inline-flex
            h-11
            items-center
            justify-center
            rounded-xl
            border
            border-slate-300
            bg-white
            px-5
            text-sm
            font-semibold
            text-slate-700
            transition
            hover:bg-slate-50
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!canEdit}
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
            transition
            hover:bg-green-700
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isPending ? (
            <>
              <Loader2
                className="
                  h-4
                  w-4
                  animate-spin
                "
              />

              Saving Changes...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />

              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  )
}