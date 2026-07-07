"use client"

import {
  useMemo,
  useState,
  useTransition,
} from "react"

import {
  AlertCircle,
  Check,
  ChevronDown,
  Eye,
  Loader2,
  Mail,
  Megaphone,
  Search,
  Send,
  UserRound,
  Users,
  X,
} from "lucide-react"

import {
  queueMarketingEmailAction,
} from "../actions"

/* =========================================================
   TYPES
========================================================= */

type CampaignOption = {
  id: string
  title: string
  channel: string
  status: string
  storedLeads: number
  conversions: number
  attributedLeads: number
}

type RecipientOption = {
  id: string
  companyName: string
  ownerName: string | null
  email: string
  industry: string | null
  country: string | null
  status: string
  campaignIds: string[]
  converted: boolean
}

type SenderOption = {
  id: string
  name: string
  email: string
}

type EmailComposerProps = {
  campaigns: CampaignOption[]
  recipients: RecipientOption[]
  sender: SenderOption
}

type AudienceMode =
  | "all"
  | "campaign"
  | "manual"

/* =========================================================
   COMPONENT
========================================================= */

export default function EmailComposer({
  campaigns,
  recipients,
  sender,
}: EmailComposerProps) {
  const [
    isPending,
    startTransition,
  ] = useTransition()

  const [
    audienceMode,
    setAudienceMode,
  ] = useState<AudienceMode>("manual")

  const [
    campaignId,
    setCampaignId,
  ] = useState("")

  const [
    selectedRecipientIds,
    setSelectedRecipientIds,
  ] = useState<string[]>([])

  const [
    search,
    setSearch,
  ] = useState("")

  const [
    subject,
    setSubject,
  ] = useState("")

  const [
    message,
    setMessage,
  ] = useState("")

  const [
    previewOpen,
    setPreviewOpen,
  ] = useState(false)

  const [
    recipientPanelOpen,
    setRecipientPanelOpen,
  ] = useState(true)

  const [
    result,
    setResult,
  ] = useState<{
    success?: boolean
    message?: string
  } | null>(null)

  /* =======================================================
     FILTERED RECIPIENTS
  ======================================================= */

  const campaignRecipients = useMemo(() => {
    if (!campaignId) {
      return []
    }

    return recipients.filter((recipient) =>
      recipient.campaignIds.includes(
        campaignId
      )
    )
  }, [
    campaignId,
    recipients,
  ])

  const searchedRecipients = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase()

    if (!normalizedSearch) {
      return recipients
    }

    return recipients.filter((recipient) => {
      const searchableText = [
        recipient.companyName,
        recipient.ownerName,
        recipient.email,
        recipient.industry,
        recipient.country,
        recipient.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return searchableText.includes(
        normalizedSearch
      )
    })
  }, [
    recipients,
    search,
  ])

  /* =======================================================
     EFFECTIVE RECIPIENT IDS
  ======================================================= */

  const effectiveRecipientIds =
    useMemo(() => {
      if (audienceMode === "all") {
        return recipients.map(
          (recipient) => recipient.id
        )
      }

      if (audienceMode === "campaign") {
        return campaignRecipients.map(
          (recipient) => recipient.id
        )
      }

      return selectedRecipientIds
    }, [
      audienceMode,
      recipients,
      campaignRecipients,
      selectedRecipientIds,
    ])

  const effectiveRecipients =
    useMemo(() => {
      const selectedSet = new Set(
        effectiveRecipientIds
      )

      return recipients.filter(
        (recipient) =>
          selectedSet.has(recipient.id)
      )
    }, [
      recipients,
      effectiveRecipientIds,
    ])

  /* =======================================================
     SELECTED CAMPAIGN
  ======================================================= */

  const selectedCampaign =
    campaigns.find(
      (campaign) =>
        campaign.id === campaignId
    ) ?? null

  /* =======================================================
     HELPERS
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

  function selectAllVisible() {
    const visibleIds =
      searchedRecipients.map(
        (recipient) => recipient.id
      )

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

  function clearRecipients() {
    setSelectedRecipientIds([])
  }

  function handleAudienceMode(
    mode: AudienceMode
  ) {
    setAudienceMode(mode)
    setResult(null)

    if (mode === "campaign") {
      setRecipientPanelOpen(false)
    }

    if (mode === "manual") {
      setRecipientPanelOpen(true)
    }
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  function handleSubmit() {
    setResult(null)

    if (!subject.trim()) {
      setResult({
        success: false,
        message:
          "Email subject is required.",
      })

      return
    }

    if (!message.trim()) {
      setResult({
        success: false,
        message:
          "Email message is required.",
      })

      return
    }

    if (
      audienceMode === "campaign" &&
      !campaignId
    ) {
      setResult({
        success: false,
        message:
          "Select a campaign first.",
      })

      return
    }

    if (
      effectiveRecipientIds.length === 0
    ) {
      setResult({
        success: false,
        message:
          "Select at least one recipient.",
      })

      return
    }

    startTransition(async () => {
      const response =
        await queueMarketingEmailAction({
          campaignId:
            campaignId || null,

          recipientIds:
            effectiveRecipientIds,

          subject:
            subject.trim(),

          message:
            message.trim(),
        })

      setResult(response)

      if (response.success) {
        setSubject("")
        setMessage("")
        setSelectedRecipientIds([])
        setCampaignId("")
        setAudienceMode("manual")
      }
    })
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <div
        className="
          grid
          gap-6
          xl:grid-cols-[minmax(0,1fr)_380px]
        "
      >
        {/* ===============================================
            LEFT COLUMN
        =============================================== */}

        <div className="space-y-6">
          {/* =============================================
              CAMPAIGN
          ============================================= */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
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
                  bg-orange-50
                "
              >
                <Megaphone
                  className="
                    h-5
                    w-5
                    text-orange-600
                  "
                />
              </div>

              <div>
                <h2
                  className="
                    font-bold
                    text-slate-950
                  "
                >
                  Campaign
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  Optionally associate this
                  email with a marketing
                  campaign.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="campaign"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Marketing campaign
              </label>

              <div className="relative">
                <select
                  id="campaign"
                  value={campaignId}
                  onChange={(event) => {
                    setCampaignId(
                      event.target.value
                    )
                    setResult(null)
                  }}
                  className="
                    h-12
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    pr-10
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-50
                  "
                >
                  <option value="">
                    No campaign selected
                  </option>

                  {campaigns.map(
                    (campaign) => (
                      <option
                        key={campaign.id}
                        value={campaign.id}
                      >
                        {campaign.title} ·{" "}
                        {campaign.channel} ·{" "}
                        {campaign.status}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  className="
                    pointer-events-none
                    absolute
                    right-4
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-slate-400
                  "
                />
              </div>

              {selectedCampaign && (
                <div
                  className="
                    mt-4
                    grid
                    gap-3
                    sm:grid-cols-3
                  "
                >
                  <MiniStat
                    label="Attributed leads"
                    value={
                      selectedCampaign
                        .attributedLeads
                    }
                  />

                  <MiniStat
                    label="Stored leads"
                    value={
                      selectedCampaign
                        .storedLeads
                    }
                  />

                  <MiniStat
                    label="Conversions"
                    value={
                      selectedCampaign
                        .conversions
                    }
                  />
                </div>
              )}
            </div>
          </section>

          {/* =============================================
              AUDIENCE
          ============================================= */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
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
                <h2
                  className="
                    font-bold
                    text-slate-950
                  "
                >
                  Audience
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  Choose who should receive
                  this email.
                </p>
              </div>

              <div
                className="
                  rounded-full
                  bg-blue-50
                  px-3
                  py-1
                  text-xs
                  font-bold
                  text-blue-700
                "
              >
                {
                  effectiveRecipientIds.length
                }{" "}
                selected
              </div>
            </div>

            {/* MODE CARDS */}

            <div
              className="
                mt-5
                grid
                gap-3
                md:grid-cols-3
              "
            >
              <AudienceCard
                active={
                  audienceMode === "all"
                }
                title="All recipients"
                description={`${recipients.length} available`}
                icon={
                  <Users className="h-5 w-5" />
                }
                onClick={() =>
                  handleAudienceMode("all")
                }
              />

              <AudienceCard
                active={
                  audienceMode ===
                  "campaign"
                }
                title="Campaign leads"
                description={
                  campaignId
                    ? `${campaignRecipients.length} attributed`
                    : "Select campaign"
                }
                icon={
                  <Megaphone className="h-5 w-5" />
                }
                onClick={() =>
                  handleAudienceMode(
                    "campaign"
                  )
                }
              />

              <AudienceCard
                active={
                  audienceMode === "manual"
                }
                title="Manual selection"
                description={`${selectedRecipientIds.length} selected`}
                icon={
                  <UserRound className="h-5 w-5" />
                }
                onClick={() =>
                  handleAudienceMode(
                    "manual"
                  )
                }
              />
            </div>

            {/* CAMPAIGN WARNING */}

            {audienceMode === "campaign" &&
              !campaignId && (
                <div
                  className="
                    mt-4
                    flex
                    items-start
                    gap-2
                    rounded-xl
                    border
                    border-orange-200
                    bg-orange-50
                    p-4
                    text-sm
                    text-orange-800
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

                  Select a campaign above to
                  load its attributed leads.
                </div>
              )}

            {/* MANUAL RECIPIENT PANEL */}

            {audienceMode === "manual" && (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() =>
                    setRecipientPanelOpen(
                      (current) => !current
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-semibold
                    text-slate-800
                  "
                >
                  <span>
                    Select recipients
                  </span>

                  <ChevronDown
                    className={`
                      h-4
                      w-4
                      transition-transform
                      ${
                        recipientPanelOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                </button>

                {recipientPanelOpen && (
                  <div
                    className="
                      mt-3
                      overflow-hidden
                      rounded-xl
                      border
                      border-slate-200
                    "
                  >
                    {/* SEARCH */}

                    <div
                      className="
                        border-b
                        border-slate-200
                        p-3
                      "
                    >
                      <div className="relative">
                        <Search
                          className="
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
                          value={search}
                          onChange={(
                            event
                          ) =>
                            setSearch(
                              event.target
                                .value
                            )
                          }
                          placeholder="Search company, contact, email, industry..."
                          className="
                            h-10
                            w-full
                            rounded-lg
                            border
                            border-slate-200
                            pl-9
                            pr-4
                            text-sm
                            outline-none
                            focus:border-blue-500
                          "
                        />
                      </div>

                      <div
                        className="
                          mt-3
                          flex
                          items-center
                          justify-between
                          gap-3
                        "
                      >
                        <span
                          className="
                            text-xs
                            text-slate-500
                          "
                        >
                          {
                            searchedRecipients.length
                          }{" "}
                          recipients shown
                        </span>

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >
                          <button
                            type="button"
                            onClick={
                              clearRecipients
                            }
                            className="
                              text-xs
                              font-semibold
                              text-red-600
                              hover:text-red-700
                            "
                          >
                            Clear
                          </button>

                          <button
                            type="button"
                            onClick={
                              selectAllVisible
                            }
                            className="
                              text-xs
                              font-semibold
                              text-blue-600
                              hover:text-blue-700
                            "
                          >
                            Select visible
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* RECIPIENT LIST */}

                    <div
                      className="
                        max-h-[320px]
                        overflow-y-auto
                      "
                    >
                      {searchedRecipients.length ===
                      0 ? (
                        <div
                          className="
                            p-8
                            text-center
                            text-sm
                            text-slate-500
                          "
                        >
                          No matching recipients
                          found.
                        </div>
                      ) : (
                        searchedRecipients.map(
                          (recipient) => {
                            const selected =
                              selectedRecipientIds.includes(
                                recipient.id
                              )

                            return (
                              <button
                                key={
                                  recipient.id
                                }
                                type="button"
                                onClick={() =>
                                  toggleRecipient(
                                    recipient.id
                                  )
                                }
                                className="
                                  flex
                                  w-full
                                  items-center
                                  gap-3
                                  border-b
                                  border-slate-100
                                  px-4
                                  py-3
                                  text-left
                                  transition
                                  last:border-b-0
                                  hover:bg-slate-50
                                "
                              >
                                <div
                                  className={`
                                    flex
                                    h-5
                                    w-5
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded
                                    border
                                    ${
                                      selected
                                        ? "border-blue-600 bg-blue-600 text-white"
                                        : "border-slate-300 bg-white"
                                    }
                                  `}
                                >
                                  {selected && (
                                    <Check className="h-3.5 w-3.5" />
                                  )}
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
                                      flex-wrap
                                      items-center
                                      gap-2
                                    "
                                  >
                                    <p
                                      className="
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-slate-900
                                      "
                                    >
                                      {
                                        recipient.companyName
                                      }
                                    </p>

                                    {recipient.converted && (
                                      <span
                                        className="
                                          rounded-full
                                          bg-green-50
                                          px-2
                                          py-0.5
                                          text-[10px]
                                          font-bold
                                          text-green-700
                                        "
                                      >
                                        Converted
                                      </span>
                                    )}
                                  </div>

                                  <p
                                    className="
                                      mt-0.5
                                      truncate
                                      text-xs
                                      text-slate-500
                                    "
                                  >
                                    {
                                      recipient.email
                                    }
                                  </p>
                                </div>

                                <div
                                  className="
                                    hidden
                                    text-right
                                    sm:block
                                  "
                                >
                                  <p
                                    className="
                                      text-xs
                                      font-medium
                                      text-slate-600
                                    "
                                  >
                                    {recipient.industry ??
                                      "General"}
                                  </p>

                                  <p
                                    className="
                                      mt-0.5
                                      text-[11px]
                                      text-slate-400
                                    "
                                  >
                                    {recipient.country ??
                                      "—"}
                                  </p>
                                </div>
                              </button>
                            )
                          }
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* =============================================
              EMAIL CONTENT
          ============================================= */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
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
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                "
              >
                <Mail
                  className="
                    h-5
                    w-5
                    text-blue-600
                  "
                />
              </div>

              <div>
                <h2
                  className="
                    font-bold
                    text-slate-950
                  "
                >
                  Email Content
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  Write the subject and
                  message that recipients
                  will receive.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {/* SUBJECT */}

              <div>
                <label
                  htmlFor="subject"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Subject
                </label>

                <input
                  id="subject"
                  value={subject}
                  onChange={(event) =>
                    setSubject(
                      event.target.value
                    )
                  }
                  maxLength={180}
                  placeholder="Enter email subject..."
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    text-sm
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-50
                  "
                />

                <div
                  className="
                    mt-1
                    text-right
                    text-xs
                    text-slate-400
                  "
                >
                  {subject.length}/180
                </div>
              </div>

              {/* MESSAGE */}

              <div>
                <label
                  htmlFor="message"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Message
                </label>

                <textarea
                  id="message"
                  value={message}
                  onChange={(event) =>
                    setMessage(
                      event.target.value
                    )
                  }
                  rows={14}
                  placeholder={`Hi {{ownerName}},

We would love to show you how KoniqTech can help {{companyName}} streamline operations, follow-ups, and customer management.

Best regards,
KoniqTech Team`}
                  className="
                    w-full
                    resize-y
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    text-sm
                    leading-6
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-50
                  "
                />

                <div
                  className="
                    mt-2
                    flex
                    flex-wrap
                    gap-2
                  "
                >
                  <VariableButton
                    label="{{ownerName}}"
                    onClick={() =>
                      setMessage(
                        (current) =>
                          current +
                          "{{ownerName}}"
                      )
                    }
                  />

                  <VariableButton
                    label="{{companyName}}"
                    onClick={() =>
                      setMessage(
                        (current) =>
                          current +
                          "{{companyName}}"
                      )
                    }
                  />

                  <VariableButton
                    label="{{industry}}"
                    onClick={() =>
                      setMessage(
                        (current) =>
                          current +
                          "{{industry}}"
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =============================================
              RESULT
          ============================================= */}

          {result?.message && (
            <div
              className={`
                flex
                items-start
                gap-3
                rounded-xl
                border
                p-4
                text-sm
                ${
                  result.success
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }
              `}
            >
              {result.success ? (
                <Check
                  className="
                    mt-0.5
                    h-4
                    w-4
                    shrink-0
                  "
                />
              ) : (
                <AlertCircle
                  className="
                    mt-0.5
                    h-4
                    w-4
                    shrink-0
                  "
                />
              )}

              {result.message}
            </div>
          )}
        </div>

        {/* ===============================================
            RIGHT SUMMARY
        =============================================== */}

        <aside className="space-y-5">
          <div
            className="
              sticky
              top-6
              space-y-5
            "
          >
            <section
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
              "
            >
              <h2
                className="
                  font-bold
                  text-slate-950
                "
              >
                Delivery Summary
              </h2>

              <div className="mt-5 space-y-4">
                <SummaryRow
                  label="Sender"
                  value={sender.name}
                />

                <SummaryRow
                  label="Sender email"
                  value={
                    sender.email || "—"
                  }
                />

                <SummaryRow
                  label="Audience"
                  value={
                    audienceMode === "all"
                      ? "All recipients"
                      : audienceMode ===
                          "campaign"
                        ? "Campaign leads"
                        : "Manual selection"
                  }
                />

                <SummaryRow
                  label="Recipients"
                  value={String(
                    effectiveRecipientIds.length
                  )}
                />

                <SummaryRow
                  label="Campaign"
                  value={
                    selectedCampaign?.title ??
                    "Not assigned"
                  }
                />
              </div>

              <div
                className="
                  mt-5
                  border-t
                  border-slate-100
                  pt-5
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setPreviewOpen(true)
                  }
                  disabled={
                    !subject.trim() &&
                    !message.trim()
                  }
                  className="
                    flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-blue-200
                    bg-blue-50
                    text-sm
                    font-bold
                    text-blue-700
                    transition
                    hover:bg-blue-100
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <Eye className="h-4 w-4" />

                  Preview Email
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="
                    mt-3
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-green-600
                    text-sm
                    font-bold
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

                      Queueing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />

                      Queue Email
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* RECIPIENT PREVIEW */}

            <section
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <h2
                  className="
                    font-bold
                    text-slate-950
                  "
                >
                  Recipients
                </h2>

                <span
                  className="
                    text-xs
                    font-bold
                    text-slate-500
                  "
                >
                  {
                    effectiveRecipients.length
                  }
                </span>
              </div>

              <div
                className="
                  mt-4
                  max-h-[300px]
                  space-y-2
                  overflow-y-auto
                "
              >
                {effectiveRecipients.length ===
                0 ? (
                  <div
                    className="
                      rounded-xl
                      bg-slate-50
                      p-5
                      text-center
                      text-sm
                      text-slate-500
                    "
                  >
                    No recipients selected.
                  </div>
                ) : (
                  effectiveRecipients
                    .slice(0, 20)
                    .map((recipient) => (
                      <div
                        key={recipient.id}
                        className="
                          rounded-xl
                          bg-slate-50
                          p-3
                        "
                      >
                        <p
                          className="
                            truncate
                            text-sm
                            font-semibold
                            text-slate-900
                          "
                        >
                          {
                            recipient.companyName
                          }
                        </p>

                        <p
                          className="
                            mt-0.5
                            truncate
                            text-xs
                            text-slate-500
                          "
                        >
                          {recipient.email}
                        </p>
                      </div>
                    ))
                )}

                {effectiveRecipients.length >
                  20 && (
                  <p
                    className="
                      py-2
                      text-center
                      text-xs
                      font-semibold
                      text-slate-500
                    "
                  >
                    +
                    {effectiveRecipients.length -
                      20}{" "}
                    more recipients
                  </p>
                )}
              </div>
            </section>
          </div>
        </aside>
      </div>

      {/* =================================================
          PREVIEW MODAL
      ================================================= */}

      {previewOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-950/50
            p-4
          "
        >
          <div
            className="
              max-h-[90vh]
              w-full
              max-w-3xl
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-200
                px-6
                py-4
              "
            >
              <div>
                <h2
                  className="
                    font-bold
                    text-slate-950
                  "
                >
                  Email Preview
                </h2>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-slate-500
                  "
                >
                  Preview before queueing
                  delivery
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPreviewOpen(false)
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-500
                  transition
                  hover:bg-red-50
                  hover:text-red-600
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="
                max-h-[calc(90vh-80px)]
                overflow-y-auto
                p-6
              "
            >
              <div
                className="
                  rounded-xl
                  border
                  border-slate-200
                "
              >
                <div
                  className="
                    space-y-2
                    border-b
                    border-slate-200
                    bg-slate-50
                    p-4
                    text-sm
                  "
                >
                  <div>
                    <span
                      className="
                        font-semibold
                        text-slate-500
                      "
                    >
                      From:
                    </span>{" "}
                    <span className="text-slate-900">
                      {sender.name} &lt;
                      {sender.email}&gt;
                    </span>
                  </div>

                  <div>
                    <span
                      className="
                        font-semibold
                        text-slate-500
                      "
                    >
                      To:
                    </span>{" "}
                    <span className="text-slate-900">
                      {
                        effectiveRecipientIds.length
                      }{" "}
                      recipient
                      {effectiveRecipientIds.length ===
                      1
                        ? ""
                        : "s"}
                    </span>
                  </div>

                  <div>
                    <span
                      className="
                        font-semibold
                        text-slate-500
                      "
                    >
                      Subject:
                    </span>{" "}
                    <span
                      className="
                        font-semibold
                        text-slate-950
                      "
                    >
                      {subject ||
                        "(No subject)"}
                    </span>
                  </div>
                </div>

                <div
                  className="
                    min-h-[300px]
                    whitespace-pre-wrap
                    p-6
                    text-sm
                    leading-7
                    text-slate-700
                  "
                >
                  {message ||
                    "No message content."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* =========================================================
   AUDIENCE CARD
========================================================= */

function AudienceCard({
  active,
  title,
  description,
  icon,
  onClick,
}: {
  active: boolean
  title: string
  description: string
  icon: React.ReactNode
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
            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
            : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40"
        }
      `}
    >
      <div
        className={`
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          ${
            active
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-100 text-slate-600"
          }
        `}
      >
        {icon}
      </div>

      <p
        className="
          mt-3
          text-sm
          font-bold
          text-slate-900
        "
      >
        {title}
      </p>

      <p
        className="
          mt-1
          text-xs
          text-slate-500
        "
      >
        {description}
      </p>
    </button>
  )
}

/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div
      className="
        rounded-xl
        bg-slate-50
        p-3
      "
    >
      <p
        className="
          text-xs
          text-slate-500
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-lg
          font-bold
          text-slate-950
        "
      >
        {value}
      </p>
    </div>
  )
}

/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-4
      "
    >
      <span
        className="
          text-sm
          text-slate-500
        "
      >
        {label}
      </span>

      <span
        className="
          max-w-[190px]
          break-words
          text-right
          text-sm
          font-semibold
          text-slate-900
        "
      >
        {value}
      </span>
    </div>
  )
}

/* =========================================================
   VARIABLE BUTTON
========================================================= */

function VariableButton({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        rounded-lg
        border
        border-slate-200
        bg-slate-50
        px-2.5
        py-1.5
        font-mono
        text-xs
        font-semibold
        text-slate-600
        transition
        hover:border-blue-200
        hover:bg-blue-50
        hover:text-blue-700
      "
    >
      {label}
    </button>
  )
}