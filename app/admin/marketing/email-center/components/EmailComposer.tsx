"use client"

import {
  useMemo,
  useState,
  useTransition,
} from "react"

import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Mail,
  Megaphone,
  Send,
  Users,
  XCircle,
} from "lucide-react"

import {
  queueMarketingEmailAction,
  type QueueMarketingEmailInput,
} from "../actions"

/* =========================================================
   TYPES
========================================================= */

type Recipient = {
  id: string
  companyName: string
  ownerName: string | null
  primaryEmail: string
  industry: string | null
  city: string | null
  state: string | null
  country: string | null
}

type Campaign = {
  id: string
  title: string
}

type EmailComposerProps = {
  recipients: Recipient[]
  campaigns: Campaign[]
}

/* =========================================================
   CONSTANTS
========================================================= */

const PERSONALIZATION_TOKENS = [
  "{{companyName}}",
  "{{ownerName}}",
  "{{industry}}",
  "{{city}}",
  "{{state}}",
  "{{country}}",
]

/* =========================================================
   COMPONENT
========================================================= */

export default function EmailComposer({
  recipients,
  campaigns,
}: EmailComposerProps) {
  const [isPending, startTransition] =
    useTransition()

  const [campaignId, setCampaignId] =
    useState("")

  const [
    selectedRecipientIds,
    setSelectedRecipientIds,
  ] = useState<string[]>([])

  const [subject, setSubject] =
    useState("")

  const [message, setMessage] =
    useState("")

  const [template, setTemplate] =
    useState("")

  const [deliveryMode, setDeliveryMode] =
    useState<"send_now" | "schedule">(
      "send_now"
    )

  const [scheduledAt, setScheduledAt] =
    useState("")

  const [search, setSearch] =
    useState("")

  const [result, setResult] =
    useState<{
      success: boolean
      message: string
    } | null>(null)

  /* =======================================================
     FILTERED RECIPIENTS
  ======================================================= */

  const filteredRecipients =
    useMemo(() => {
      const query =
        search.trim().toLowerCase()

      if (!query) {
        return recipients
      }

      return recipients.filter(
        (recipient) => {
          return (
            recipient.companyName
              .toLowerCase()
              .includes(query) ||
            recipient.ownerName
              ?.toLowerCase()
              .includes(query) ||
            recipient.primaryEmail
              .toLowerCase()
              .includes(query) ||
            recipient.industry
              ?.toLowerCase()
              .includes(query) ||
            recipient.city
              ?.toLowerCase()
              .includes(query) ||
            recipient.country
              ?.toLowerCase()
              .includes(query)
          )
        }
      )
    }, [recipients, search])

  /* =======================================================
     SELECT ALL STATE
  ======================================================= */

  const allVisibleSelected =
    filteredRecipients.length > 0 &&
    filteredRecipients.every(
      (recipient) =>
        selectedRecipientIds.includes(
          recipient.id
        )
    )

  /* =======================================================
     TOGGLE RECIPIENT
  ======================================================= */

  function toggleRecipient(
    recipientId: string
  ) {
    setSelectedRecipientIds(
      (current) => {
        if (
          current.includes(recipientId)
        ) {
          return current.filter(
            (id) => id !== recipientId
          )
        }

        return [
          ...current,
          recipientId,
        ]
      }
    )
  }

  /* =======================================================
     SELECT / DESELECT ALL VISIBLE
  ======================================================= */

  function toggleAllVisible() {
    const visibleIds =
      filteredRecipients.map(
        (recipient) => recipient.id
      )

    if (allVisibleSelected) {
      setSelectedRecipientIds(
        (current) =>
          current.filter(
            (id) =>
              !visibleIds.includes(id)
          )
      )

      return
    }

    setSelectedRecipientIds(
      (current) =>
        Array.from(
          new Set([
            ...current,
            ...visibleIds,
          ])
        )
    )
  }

  /* =======================================================
     INSERT TOKEN
  ======================================================= */

  function insertToken(
    token: string
  ) {
    setMessage(
      (current) =>
        `${current}${current ? " " : ""}${token}`
    )
  }

  /* =======================================================
     VALIDATION
  ======================================================= */

  function validateForm() {
    if (
      selectedRecipientIds.length === 0
    ) {
      return "Select at least one recipient."
    }

    if (!subject.trim()) {
      return "Email subject is required."
    }

    if (!message.trim()) {
      return "Email message is required."
    }

    if (
      deliveryMode === "schedule" &&
      !scheduledAt
    ) {
      return "Select a scheduled date and time."
    }

    return null
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  function handleSubmit() {
    setResult(null)

    const validationError =
      validateForm()

    if (validationError) {
      setResult({
        success: false,
        message: validationError,
      })

      return
    }

    startTransition(async () => {
      const input: QueueMarketingEmailInput =
        {
          campaignId:
            campaignId || null,

          recipientIds:
            selectedRecipientIds,

          subject:
            subject.trim(),

          message:
            message.trim(),

          template:
            template.trim() || null,

          deliveryMode,

          scheduledAt:
            deliveryMode === "schedule"
              ? scheduledAt
              : null,
        }

      /*
       * The action accepts:
       *
       * queueMarketingEmailAction(
       *   input,
       *   formData
       * )
       */

      

     const response =
  await queueMarketingEmailAction(input)

      setResult(response)

      if (response.success) {
        setSubject("")
        setMessage("")
        setTemplate("")
        setCampaignId("")
        setScheduledAt("")
        setDeliveryMode(
          "send_now"
        )
        setSelectedRecipientIds([])
      }
    })
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      {/* ===============================================
          RECIPIENT PANEL
      =============================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-950">
                Recipients
              </h2>

              <p className="text-sm text-slate-500">
                {
                  selectedRecipientIds.length
                }{" "}
                selected
              </p>
            </div>
          </div>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search companies or emails..."
            className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="button"
            onClick={toggleAllVisible}
            className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {allVisibleSelected
              ? "Deselect visible recipients"
              : "Select all visible recipients"}
          </button>
        </div>

        <div className="max-h-[650px] overflow-y-auto p-3">
          {filteredRecipients.length ===
          0 ? (
            <div className="px-4 py-12 text-center">
              <Users className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-700">
                No recipients found
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredRecipients.map(
                (recipient) => {
                  const checked =
                    selectedRecipientIds.includes(
                      recipient.id
                    )

                  return (
                    <label
                      key={
                        recipient.id
                      }
                      className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition ${
                        checked
                          ? "border-blue-300 bg-blue-50"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={
                          checked
                        }
                        onChange={() =>
                          toggleRecipient(
                            recipient.id
                          )
                        }
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {
                            recipient.companyName
                          }
                        </p>

                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {
                            recipient.primaryEmail
                          }
                        </p>

                        {(recipient.industry ||
                          recipient.city) && (
                          <p className="mt-1 text-xs text-slate-400">
                            {[
                              recipient.industry,
                              recipient.city,
                              recipient.state,
                            ]
                              .filter(
                                Boolean
                              )
                              .join(
                                " • "
                              )}
                          </p>
                        )}
                      </div>
                    </label>
                  )
                }
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===============================================
          COMPOSER PANEL
      =============================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <Mail className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Compose Email
              </h2>

              <p className="text-sm text-slate-500">
                Create and queue personalized
                marketing emails
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* CAMPAIGN */}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Megaphone className="h-4 w-4" />
              Marketing campaign
            </label>

            <select
              value={campaignId}
              onChange={(event) =>
                setCampaignId(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                No campaign
              </option>

              {campaigns.map(
                (campaign) => (
                  <option
                    key={
                      campaign.id
                    }
                    value={
                      campaign.id
                    }
                  >
                    {
                      campaign.title
                    }
                  </option>
                )
              )}
            </select>
          </div>

          {/* SUBJECT */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Subject
            </label>

            <input
              type="text"
              value={subject}
              onChange={(event) =>
                setSubject(
                  event.target.value
                )
              }
              placeholder="Enter email subject"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* TEMPLATE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Template name
              <span className="ml-1 font-normal text-slate-400">
                optional
              </span>
            </label>

            <input
              type="text"
              value={template}
              onChange={(event) =>
                setTemplate(
                  event.target.value
                )
              }
              placeholder="Example: demo-follow-up"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* MESSAGE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Message
            </label>

            <textarea
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              rows={14}
              placeholder="Write your marketing email..."
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                Personalization tokens
              </p>

              <div className="flex flex-wrap gap-2">
                {PERSONALIZATION_TOKENS.map(
                  (token) => (
                    <button
                      key={token}
                      type="button"
                      onClick={() =>
                        insertToken(
                          token
                        )
                      }
                      className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                      {token}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* DELIVERY MODE */}

          <div>
            <label className="mb-3 block text-sm font-medium text-slate-700">
              Delivery
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  setDeliveryMode(
                    "send_now"
                  )
                }
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  deliveryMode ===
                  "send_now"
                    ? "border-green-300 bg-green-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Send className="h-5 w-5 text-green-600" />

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Send now
                  </p>

                  <p className="text-xs text-slate-500">
                    Add emails to the queue
                    immediately
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setDeliveryMode(
                    "schedule"
                  )
                }
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  deliveryMode ===
                  "schedule"
                    ? "border-orange-300 bg-orange-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <CalendarClock className="h-5 w-5 text-orange-600" />

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Schedule
                  </p>

                  <p className="text-xs text-slate-500">
                    Queue for a future date
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* SCHEDULE DATE */}

          {deliveryMode ===
            "schedule" && (
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-orange-900">
                <Clock3 className="h-4 w-4" />
                Scheduled date and time
              </label>

              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(event) =>
                  setScheduledAt(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-orange-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          )}

          {/* RESULT */}

          {result && (
            <div
              className={`flex items-start gap-3 rounded-xl border p-4 ${
                result.success
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              ) : (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
              )}

              <p className="text-sm font-medium">
                {result.message}
              </p>
            </div>
          )}

          {/* SUBMIT */}

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">
              <span className="font-semibold text-slate-900">
                {
                  selectedRecipientIds.length
                }
              </span>{" "}
              recipient
              {selectedRecipientIds.length ===
              1
                ? ""
                : "s"}{" "}
              selected
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                deliveryMode ===
                "schedule"
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {deliveryMode ===
              "schedule" ? (
                <CalendarClock className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}

              {isPending
                ? "Processing..."
                : deliveryMode ===
                    "schedule"
                  ? "Schedule Emails"
                  : "Queue Emails"}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}