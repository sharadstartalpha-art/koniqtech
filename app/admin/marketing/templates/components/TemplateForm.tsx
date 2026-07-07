"use client"

import {
  FormEvent,
  useMemo,
  useState,
  useTransition,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  FileText,
  Loader2,
  Mail,
  Save,
  Sparkles,
} from "lucide-react"

import {
  MarketingTemplateCategory,
  MarketingTemplateStatus,
} from "@prisma/client"

import {
  createMarketingTemplateAction,
} from "../actions"

/* =========================================================
   CATEGORY OPTIONS
========================================================= */

const CATEGORY_OPTIONS: Array<{
  value: MarketingTemplateCategory
  label: string
}> = [
  {
    value:
      MarketingTemplateCategory.campaign,
    label:
      "Campaign",
  },
  {
    value:
      MarketingTemplateCategory.newsletter,
    label:
      "Newsletter",
  },
  {
    value:
      MarketingTemplateCategory.demo_invitation,
    label:
      "Demo Invitation",
  },
  {
    value:
      MarketingTemplateCategory.demo_reminder,
    label:
      "Demo Reminder",
  },
  {
    value:
      MarketingTemplateCategory.follow_up,
    label:
      "Follow-up",
  },
  {
    value:
      MarketingTemplateCategory.sales_outreach,
    label:
      "Sales Outreach",
  },
  {
    value:
      MarketingTemplateCategory.trial,
    label:
      "Trial",
  },
  {
    value:
      MarketingTemplateCategory.onboarding,
    label:
      "Onboarding",
  },
  {
    value:
      MarketingTemplateCategory.re_engagement,
    label:
      "Re-engagement",
  },
  {
    value:
      MarketingTemplateCategory.custom,
    label:
      "Custom",
  },
]

/* =========================================================
   STATUS OPTIONS
========================================================= */

const STATUS_OPTIONS: Array<{
  value: MarketingTemplateStatus
  label: string
  description: string
}> = [
  {
    value:
      MarketingTemplateStatus.active,

    label:
      "Active",

    description:
      "Available for use immediately.",
  },

  {
    value:
      MarketingTemplateStatus.inactive,

    label:
      "Inactive",

    description:
      "Saved but unavailable for normal use.",
  },

  {
    value:
      MarketingTemplateStatus.archived,

    label:
      "Archived",

    description:
      "Stored for historical reference.",
  },
]

/* =========================================================
   PLACEHOLDERS
========================================================= */

const PLACEHOLDERS = [
  "{{firstName}}",
  "{{companyName}}",
  "{{industry}}",
  "{{demoDate}}",
  "{{meetingLink}}",
  "{{senderName}}",
]

/* =========================================================
   COMPONENT
========================================================= */

export default function TemplateForm() {
  const router =
    useRouter()

  const [
    isPending,
    startTransition,
  ] = useTransition()

  const [
    name,
    setName,
  ] = useState("")

  const [
    description,
    setDescription,
  ] = useState("")

  const [
    category,
    setCategory,
  ] =
    useState<MarketingTemplateCategory>(
      MarketingTemplateCategory.campaign
    )

  const [
    subject,
    setSubject,
  ] = useState("")

  const [
    previewText,
    setPreviewText,
  ] = useState("")

  const [
    content,
    setContent,
  ] = useState("")

  const [
    status,
    setStatus,
  ] =
    useState<MarketingTemplateStatus>(
      MarketingTemplateStatus.active
    )

  const [
    showPreview,
    setShowPreview,
  ] = useState(false)

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    )

  const [
    success,
    setSuccess,
  ] =
    useState<string | null>(
      null
    )

  /* =======================================================
     CHARACTER COUNTS
  ======================================================= */

  const subjectLength =
    subject.length

  const previewLength =
    previewText.length

  const contentLength =
    content.length

  /* =======================================================
     VALIDATION
  ======================================================= */

  const canSubmit =
    useMemo(() => {
      return (
        name.trim().length > 0 &&
        content.trim().length > 0
      )
    }, [
      name,
      content,
    ])

  /* =======================================================
     INSERT PLACEHOLDER
  ======================================================= */

  function insertPlaceholder(
    placeholder: string
  ) {
    setContent(
      (current) =>
        `${current}${current ? " " : ""}${placeholder}`
    )
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError(null)
    setSuccess(null)

    if (!name.trim()) {
      setError(
        "Template name is required."
      )

      return
    }

    if (!content.trim()) {
      setError(
        "Template content is required."
      )

      return
    }

    startTransition(
      async () => {
        try {
          const result =
            await createMarketingTemplateAction({
              name,
              description,
              category,
              subject,
              previewText,
              content,
              status,
            })

          if (!result.success) {
            setError(
              result.message
            )

            return
          }

          setSuccess(
            result.message
          )

          if (
            result.templateId
          ) {
            router.push(
              `/admin/marketing/templates/${result.templateId}`
            )

            router.refresh()

            return
          }

          router.push(
            "/admin/marketing/templates"
          )

          router.refresh()
        } catch (
          actionError
        ) {
          console.error(
            "Create template error:",
            actionError
          )

          setError(
            "Unable to create template."
          )
        }
      }
    )
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* =================================================
          FEEDBACK
      ================================================= */}

      {error && (
        <div
          role="alert"
          className="
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-700
          "
        >
          <AlertCircle
            className="
              mt-0.5
              h-4
              w-4
              shrink-0
            "
          />

          <span>
            {error}
          </span>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-green-200
            bg-green-50
            px-4
            py-3
            text-sm
            text-green-700
          "
        >
          <CheckCircle2
            className="
              mt-0.5
              h-4
              w-4
              shrink-0
            "
          />

          <span>
            {success}
          </span>
        </div>
      )}

      {/* =================================================
          BASIC INFORMATION
      ================================================= */}

      <section className="space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <FileText
              className="
                h-5
                w-5
                text-blue-600
              "
            />

            <h3
              className="
                font-bold
                text-slate-950
              "
            >
              Basic Information
            </h3>
          </div>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Give the template a clear
            internal name and category.
          </p>
        </div>

        <div
          className="
            grid
            gap-5
            lg:grid-cols-2
          "
        >
          {/* NAME */}

          <Field>
            <Label
              htmlFor="template-name"
              required
            >
              Template Name
            </Label>

            <input
              id="template-name"
              type="text"
              value={name}
              disabled={isPending}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="Example: Demo Follow-up Email"
              className={inputClassName}
            />
          </Field>

          {/* CATEGORY */}

          <Field>
            <Label
              htmlFor="template-category"
              required
            >
              Category
            </Label>

            <select
              id="template-category"
              value={category}
              disabled={isPending}
              onChange={(event) =>
                setCategory(
                  event.target
                    .value as MarketingTemplateCategory
                )
              }
              className={inputClassName}
            >
              {CATEGORY_OPTIONS.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>
          </Field>
        </div>

        {/* DESCRIPTION */}

        <Field>
          <Label htmlFor="template-description">
            Description
          </Label>

          <textarea
            id="template-description"
            value={description}
            disabled={isPending}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            placeholder="Describe when and how this template should be used..."
            rows={3}
            className={textareaClassName}
          />
        </Field>
      </section>

      <Divider />

      {/* =================================================
          EMAIL INFORMATION
      ================================================= */}

      <section className="space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <Mail
              className="
                h-5
                w-5
                text-orange-500
              "
            />

            <h3
              className="
                font-bold
                text-slate-950
              "
            >
              Message Information
            </h3>
          </div>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Configure the subject and
            inbox preview text.
          </p>
        </div>

        {/* SUBJECT */}

        <Field>
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <Label htmlFor="template-subject">
              Subject
            </Label>

            <span
              className={`
                text-xs
                ${
                  subjectLength >
                  100
                    ? "text-red-600"
                    : "text-slate-400"
                }
              `}
            >
              {subjectLength}/100
            </span>
          </div>

          <input
            id="template-subject"
            type="text"
            value={subject}
            disabled={isPending}
            maxLength={150}
            onChange={(event) =>
              setSubject(
                event.target.value
              )
            }
            placeholder="Example: Ready to see how KoniqTech can help {{companyName}}?"
            className={inputClassName}
          />
        </Field>

        {/* PREVIEW TEXT */}

        <Field>
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <Label htmlFor="template-preview">
              Preview Text
            </Label>

            <span
              className={`
                text-xs
                ${
                  previewLength >
                  140
                    ? "text-red-600"
                    : "text-slate-400"
                }
              `}
            >
              {previewLength}/140
            </span>
          </div>

          <textarea
            id="template-preview"
            value={previewText}
            disabled={isPending}
            maxLength={200}
            onChange={(event) =>
              setPreviewText(
                event.target.value
              )
            }
            placeholder="Short inbox preview text..."
            rows={2}
            className={textareaClassName}
          />
        </Field>
      </section>

      <Divider />

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
            sm:items-start
            sm:justify-between
          "
        >
          <div>
            <div className="flex items-center gap-2">
              <Sparkles
                className="
                  h-5
                  w-5
                  text-green-600
                "
              />

              <h3
                className="
                  font-bold
                  text-slate-950
                "
              >
                Template Content
              </h3>
            </div>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Write reusable message
              content and insert variables
              where personalization is needed.
            </p>
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
            <Eye className="h-4 w-4" />

            {showPreview
              ? "Hide Preview"
              : "Preview"}
          </button>
        </div>

        {/* PLACEHOLDERS */}

        <div
          className="
            rounded-xl
            border
            border-blue-200
            bg-blue-50/60
            p-4
          "
        >
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-blue-700
            "
          >
            Insert Placeholder
          </p>

          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-2
            "
          >
            {PLACEHOLDERS.map(
              (placeholder) => (
                <button
                  key={placeholder}
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    insertPlaceholder(
                      placeholder
                    )
                  }
                  className="
                    rounded-lg
                    border
                    border-blue-200
                    bg-white
                    px-3
                    py-2
                    text-xs
                    font-semibold
                    text-blue-700
                    transition
                    hover:bg-blue-100
                    disabled:opacity-50
                  "
                >
                  {placeholder}
                </button>
              )
            )}
          </div>
        </div>

        {/* CONTENT EDITOR */}

        {!showPreview ? (
          <Field>
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <Label
                htmlFor="template-content"
                required
              >
                Content
              </Label>

              <span
                className="
                  text-xs
                  text-slate-400
                "
              >
                {contentLength} characters
              </span>
            </div>

            <textarea
              id="template-content"
              value={content}
              disabled={isPending}
              onChange={(event) =>
                setContent(
                  event.target.value
                )
              }
              placeholder={`Hi {{firstName}},

I wanted to follow up regarding {{companyName}}.

We would be happy to show you how KoniqTech can help streamline your workflow.

Would you be available for a short demo?

Best regards,
{{senderName}}`}
              rows={16}
              className="
                w-full
                resize-y
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-4
                font-mono
                text-sm
                leading-7
                text-slate-800
                outline-none
                transition
                focus:border-blue-400
                focus:bg-white
                focus:ring-4
                focus:ring-blue-50
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />
          </Field>
        ) : (
          /* =============================================
             PREVIEW
          ============================================= */

          <div
            className="
              overflow-hidden
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
                bg-slate-50
                px-5
                py-4
              "
            >
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >
                Email Preview
              </p>

              <p
                className="
                  mt-3
                  font-semibold
                  text-slate-950
                "
              >
                {subject ||
                  "No subject entered"}
              </p>

              {previewText && (
                <p
                  className="
                    mt-1
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
                min-h-[320px]
                whitespace-pre-wrap
                px-6
                py-6
                text-sm
                leading-7
                text-slate-700
              "
            >
              {content ||
                "Your template content preview will appear here."}
            </div>
          </div>
        )}
      </section>

      <Divider />

      {/* =================================================
          STATUS
      ================================================= */}

      <section className="space-y-4">
        <div>
          <h3
            className="
              font-bold
              text-slate-950
            "
          >
            Template Status
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Choose whether the template
            should be available immediately.
          </p>
        </div>

        <div
          className="
            grid
            gap-3
            md:grid-cols-3
          "
        >
          {STATUS_OPTIONS.map(
            (option) => {
              const selected =
                status ===
                option.value

              return (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    setStatus(
                      option.value
                    )
                  }
                  className={`
                    rounded-xl
                    border
                    p-4
                    text-left
                    transition
                    disabled:opacity-50
                    ${
                      selected
                        ? option.value ===
                          MarketingTemplateStatus.active
                          ? "border-green-300 bg-green-50 ring-2 ring-green-100"
                          : option.value ===
                              MarketingTemplateStatus.inactive
                            ? "border-orange-300 bg-orange-50 ring-2 ring-orange-100"
                            : "border-blue-300 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }
                  `}
                >
                  <p
                    className={`
                      text-sm
                      font-bold
                      ${
                        selected
                          ? option.value ===
                            MarketingTemplateStatus.active
                            ? "text-green-800"
                            : option.value ===
                                MarketingTemplateStatus.inactive
                              ? "text-orange-800"
                              : "text-blue-800"
                          : "text-slate-800"
                      }
                    `}
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
                    {option.description}
                  </p>
                </button>
              )
            }
          )}
        </div>
      </section>

      {/* =================================================
          FOOTER ACTIONS
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
          sm:justify-end
        "
      >
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            router.push(
              "/admin/marketing/templates"
            )
          }
          className="
            inline-flex
            h-11
            items-center
            justify-center
            rounded-xl
            bg-orange-50
            px-5
            text-sm
            font-semibold
            text-orange-700
            transition
            hover:bg-orange-100
            disabled:opacity-50
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            isPending ||
            !canSubmit
          }
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-green-600
            px-6
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-green-700
            disabled:cursor-not-allowed
            disabled:opacity-50
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

              Creating Template...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />

              Create Template
            </>
          )}
        </button>
      </div>
    </form>
  )
}

/* =========================================================
   SHARED UI
========================================================= */

const inputClassName = `
  h-11
  w-full
  rounded-xl
  border
  border-slate-200
  bg-slate-50
  px-4
  text-sm
  text-slate-900
  outline-none
  transition
  placeholder:text-slate-400
  focus:border-blue-400
  focus:bg-white
  focus:ring-4
  focus:ring-blue-50
  disabled:cursor-not-allowed
  disabled:opacity-60
`

const textareaClassName = `
  w-full
  resize-y
  rounded-xl
  border
  border-slate-200
  bg-slate-50
  px-4
  py-3
  text-sm
  leading-6
  text-slate-900
  outline-none
  transition
  placeholder:text-slate-400
  focus:border-blue-400
  focus:bg-white
  focus:ring-4
  focus:ring-blue-50
  disabled:cursor-not-allowed
  disabled:opacity-60
`

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
  required = false,
  children,
}: {
  htmlFor: string
  required?: boolean
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

      {required && (
        <span className="ml-1 text-red-500">
          *
        </span>
      )}
    </label>
  )
}

function Divider() {
  return (
    <div className="border-t border-slate-200" />
  )
}