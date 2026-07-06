// app/admin/sales/outreach/components/OutreachForm.tsx

"use client"

import {
  useActionState,
  useEffect,
  useState,
} from "react"

import {
  CheckCircle2,
  FileText,
  Globe2,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Save,
  Send,
} from "lucide-react"

import {
  addSalesNoteAction,
  recordOutreachAction,
  sendOutreachEmailAction,
  type OutreachActionState,
} from "../actions"


/* ==========================================================
   TYPES
========================================================== */

type OutreachFormProps = {
  lead: {
    id: string

    firstName: string

    lastName?: string | null

    email?: string | null

    phone?: string | null

    companyName?: string | null
  }
}


type OutreachChannel =
  | "email"
  | "phone"
  | "whatsapp"
  | "linkedin"
  | "facebook"
  | "instagram"
  | "other"


/* ==========================================================
   INITIAL STATE
========================================================== */

const initialState: OutreachActionState = {
  success: false,
  message: "",
}


/* ==========================================================
   CHANNELS
========================================================== */

const CHANNELS: {
  value: OutreachChannel
  label: string
  description: string
  icon: React.ReactNode
}[] = [

  {
    value: "email",
    label: "Email",
    description: "Send email",
    icon: (
      <Mail className="h-4 w-4" />
    ),
  },

  {
    value: "phone",
    label: "Phone",
    description: "Record call",
    icon: (
      <Phone className="h-4 w-4" />
    ),
  },

  {
    value: "whatsapp",
    label: "WhatsApp",
    description: "Record chat",
    icon: (
      <MessageCircle className="h-4 w-4" />
    ),
  },

  {
  value: "linkedin",
  label: "LinkedIn",
  description: "Record contact",
  icon: <Globe2 className="h-4 w-4" />,
},

 {
  value: "facebook",
  label: "Facebook",
  description: "Record contact",
  icon: <Globe2 className="h-4 w-4" />,
},
  {
  value: "instagram",
  label: "Instagram",
  description: "Record contact",
  icon: <Globe2 className="h-4 w-4" />,
},

  {
    value: "other",
    label: "Other",
    description: "Other channel",
    icon: (
      <Send className="h-4 w-4" />
    ),
  },
]


/* ==========================================================
   MAIN COMPONENT
========================================================== */

export default function OutreachForm({
  lead,
}: OutreachFormProps) {

  const [channel, setChannel] =
    useState<OutreachChannel>(
      "email"
    )


  return (

    <div className="space-y-6">

      {/* ====================================================
          LEAD CONTACT SUMMARY
      ===================================================== */}

      <section
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
            flex-col
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div>

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-blue-600
              "
            >
              Current Prospect
            </p>


            <h2
              className="
                mt-1
                text-xl
                font-bold
                text-slate-950
              "
            >
              {lead.firstName}

              {lead.lastName
                ? ` ${lead.lastName}`
                : ""}
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {lead.companyName ||
                "Individual prospect"}
            </p>

          </div>


          <div
            className="
              flex
              flex-wrap
              gap-2
            "
          >

            {lead.email && (

              <a
                href={`mailto:${lead.email}`}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-green-200
                  bg-green-50
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-green-700
                  transition
                  hover:bg-green-100
                "
              >
                <Mail className="h-4 w-4" />

                {lead.email}
              </a>

            )}


            {lead.phone && (

              <a
                href={`tel:${lead.phone}`}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-orange-200
                  bg-orange-50
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-orange-700
                  transition
                  hover:bg-orange-100
                "
              >
                <Phone className="h-4 w-4" />

                {lead.phone}
              </a>

            )}

          </div>

        </div>

      </section>


      {/* ====================================================
          CHANNEL SELECTOR
      ===================================================== */}

      <section
        className="
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
            px-5
            py-5
          "
        >

          <h2
            className="
              text-lg
              font-semibold
              text-slate-950
            "
          >
            Choose Outreach Channel
          </h2>


          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Send an email or record communication
            completed through another channel.
          </p>

        </div>


        <div className="p-5">

          <div
            className="
              grid
              gap-3
              sm:grid-cols-2
              md:grid-cols-3
              xl:grid-cols-4
            "
          >

            {CHANNELS.map(
              (item) => {

                const active =
                  channel ===
                  item.value


                return (

                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setChannel(
                        item.value
                      )
                    }
                    className={`
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      border
                      p-3
                      text-left
                      transition

                      ${
                        active
                          ? `
                            border-blue-300
                            bg-blue-50
                            ring-1
                            ring-blue-200
                          `
                          : `
                            border-slate-200
                            bg-white
                            hover:border-blue-200
                            hover:bg-slate-50
                          `
                      }
                    `}
                  >

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
                            ? `
                              bg-blue-100
                              text-blue-600
                            `
                            : `
                              bg-slate-100
                              text-slate-500
                            `
                        }
                      `}
                    >
                      {item.icon}
                    </div>


                    <div>

                      <div
                        className="
                          text-sm
                          font-semibold
                          text-slate-900
                        "
                      >
                        {item.label}
                      </div>


                      <div
                        className="
                          mt-0.5
                          text-xs
                          text-slate-500
                        "
                      >
                        {item.description}
                      </div>

                    </div>

                  </button>

                )
              }
            )}

          </div>

        </div>

      </section>


      {/* ====================================================
          EMAIL FORM
      ===================================================== */}

      {channel === "email" ? (

        <EmailOutreachForm
          lead={lead}
        />

      ) : (

        <ManualOutreachForm
          leadId={lead.id}
          channel={channel}
        />

      )}


      {/* ====================================================
          SALES NOTE
      ===================================================== */}

      <SalesNoteForm
        leadId={lead.id}
      />

    </div>
  )
}


/* ==========================================================
   EMAIL OUTREACH FORM
========================================================== */

function EmailOutreachForm({
  lead,
}: {
  lead: OutreachFormProps["lead"]
}) {

  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    sendOutreachEmailAction,
    initialState
  )


  const defaultSubject =
    lead.companyName
      ? `Helping ${lead.companyName} streamline operations`
      : "A better way to manage your field service operations"


  return (

    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-green-200
        bg-white
        shadow-sm
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-start
          gap-3
          border-b
          border-green-100
          bg-green-50/60
          px-5
          py-5
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
            bg-green-100
            text-green-600
          "
        >
          <Mail className="h-5 w-5" />
        </div>


        <div>

          <h2
            className="
              font-semibold
              text-slate-950
            "
          >
            Send Sales Email
          </h2>


          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Send a personalized email directly
            to this prospect.
          </p>

        </div>

      </div>


      <form
        action={formAction}
        className="
          space-y-5
          p-5
        "
      >

        <input
          type="hidden"
          name="leadId"
          value={lead.id}
        />


        {/* RECIPIENT */}

        <div>

          <label
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-700
            "
          >
            Recipient
          </label>


          <div
            className="
              flex
              min-h-11
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-3
              text-sm
              text-slate-600
            "
          >
            <Mail
              className="
                h-4
                w-4
                text-slate-400
              "
            />

            {lead.email ||
              "No email address available"}
          </div>

        </div>


        {/* SUBJECT */}

        <div>

          <label
            htmlFor="subject"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-700
            "
          >
            Subject
          </label>


          <input
            id="subject"
            name="subject"
            type="text"
            required
            defaultValue={
              defaultSubject
            }
            placeholder="Enter email subject"
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              px-3
              text-sm
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-blue-400
              focus:ring-2
              focus:ring-blue-100
            "
          />

        </div>


        {/* MESSAGE */}

        <div>

          <label
            htmlFor="message"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-700
            "
          >
            Message
          </label>


          <textarea
            id="message"
            name="message"
            required
            rows={10}
            defaultValue={
`I wanted to reach out because KoniqTech helps field service businesses manage leads, customers, scheduling, jobs, teams, communication, and business operations from one platform.

I would be happy to arrange a short product demo to show how the platform could support your business.

Would you be available for a quick demonstration?`
            }
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
              leading-6
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-blue-400
              focus:ring-2
              focus:ring-blue-100
            "
          />

        </div>


        {/* RESULT MESSAGE */}

        <ActionMessage
          state={state}
        />


        {/* SUBMIT */}

        <div
          className="
            flex
            justify-end
          "
        >

          <button
            type="submit"
            disabled={
              pending ||
              !lead.email
            }
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
              shadow-sm
              transition
              hover:bg-green-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            {pending ? (

              <>
                <Loader2
                  className="
                    h-4
                    w-4
                    animate-spin
                  "
                />

                Sending...
              </>

            ) : (

              <>
                <Send className="h-4 w-4" />

                Send Email
              </>

            )}

          </button>

        </div>

      </form>

    </section>
  )
}


/* ==========================================================
   MANUAL OUTREACH FORM
========================================================== */

function ManualOutreachForm({
  leadId,
  channel,
}: {
  leadId: string
  channel: Exclude<
    OutreachChannel,
    "email"
  >
}) {

  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    recordOutreachAction,
    initialState
  )


  const channelLabel =
    formatChannel(
      channel
    )


  return (

    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-orange-200
        bg-white
        shadow-sm
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-start
          gap-3
          border-b
          border-orange-100
          bg-orange-50/60
          px-5
          py-5
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
            bg-orange-100
            text-orange-600
          "
        >
          <MessageCircle
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
            Record {channelLabel} Outreach
          </h2>


          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Record the result of your
            communication with this prospect.
          </p>

        </div>

      </div>


      <form
        action={formAction}
        className="
          space-y-5
          p-5
        "
      >

        <input
          type="hidden"
          name="leadId"
          value={leadId}
        />


        <input
          type="hidden"
          name="channel"
          value={channel}
        />


        {/* OUTCOME */}

        <div>

          <label
            htmlFor={`outcome-${channel}`}
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-700
            "
          >
            Contact Outcome
          </label>


          <select
            id={`outcome-${channel}`}
            name="outcome"
            required
            defaultValue=""
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              px-3
              text-sm
              text-slate-900
              outline-none
              transition
              focus:border-blue-400
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="">
              Select outcome
            </option>

            <option value="No response">
              No response
            </option>

            <option value="Follow-up required">
              Follow-up required
            </option>

            <option value="Interested">
              Interested
            </option>

            <option value="Demo requested">
              Demo requested
            </option>

            <option value="Not interested">
              Not interested
            </option>

            <option value="Wrong contact information">
              Wrong contact information
            </option>

          </select>

        </div>


        {/* NOTES */}

        <div>

          <label
            htmlFor={`notes-${channel}`}
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-700
            "
          >
            Conversation Notes
          </label>


          <textarea
            id={`notes-${channel}`}
            name="notes"
            rows={6}
            placeholder={
              `Record details from the ${channelLabel.toLowerCase()} conversation...`
            }
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
              leading-6
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-blue-400
              focus:ring-2
              focus:ring-blue-100
            "
          />

        </div>


        <ActionMessage
          state={state}
        />


        <div
          className="
            flex
            justify-end
          "
        >

          <button
            type="submit"
            disabled={pending}
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-orange-500
              px-5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-orange-600
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            {pending ? (

              <>
                <Loader2
                  className="
                    h-4
                    w-4
                    animate-spin
                  "
                />

                Saving...
              </>

            ) : (

              <>
                <Save className="h-4 w-4" />

                Record Outreach
              </>

            )}

          </button>

        </div>

      </form>

    </section>
  )
}


/* ==========================================================
   SALES NOTE FORM
========================================================== */

function SalesNoteForm({
  leadId,
}: {
  leadId: string
}) {

  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    addSalesNoteAction,
    initialState
  )


  const [
    content,
    setContent,
  ] = useState("")


  useEffect(() => {

    if (
      state.success
    ) {
      setContent("")
    }

  }, [
    state.success,
    state.message,
  ])


  return (

    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-violet-200
        bg-white
        shadow-sm
      "
    >

      <div
        className="
          flex
          items-start
          gap-3
          border-b
          border-violet-100
          bg-violet-50/60
          px-5
          py-5
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
            bg-violet-100
            text-violet-600
          "
        >
          <FileText
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
            Internal Sales Note
          </h2>


          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Save internal observations,
            follow-up reminders, or qualification
            information.
          </p>

        </div>

      </div>


      <form
        action={formAction}
        className="
          space-y-4
          p-5
        "
      >

        <input
          type="hidden"
          name="leadId"
          value={leadId}
        />


        <textarea
          name="content"
          value={content}
          onChange={(event) =>
            setContent(
              event.target.value
            )
          }
          required
          rows={4}
          placeholder="Add an internal sales note..."
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
            leading-6
            text-slate-900
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-violet-400
            focus:ring-2
            focus:ring-violet-100
          "
        />


        <ActionMessage
          state={state}
        />


        <div
          className="
            flex
            justify-end
          "
        >

          <button
            type="submit"
            disabled={
              pending ||
              !content.trim()
            }
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-violet-600
              px-5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-violet-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            {pending ? (

              <>
                <Loader2
                  className="
                    h-4
                    w-4
                    animate-spin
                  "
                />

                Saving...
              </>

            ) : (

              <>
                <Save className="h-4 w-4" />

                Save Note
              </>

            )}

          </button>

        </div>

      </form>

    </section>
  )
}


/* ==========================================================
   ACTION MESSAGE
========================================================== */

function ActionMessage({
  state,
}: {
  state: OutreachActionState
}) {

  if (!state.message) {
    return null
  }


  return (

    <div
      className={`
        flex
        items-start
        gap-2
        rounded-xl
        border
        px-4
        py-3
        text-sm

        ${
          state.success
            ? `
              border-green-200
              bg-green-50
              text-green-700
            `
            : `
              border-red-200
              bg-red-50
              text-red-700
            `
        }
      `}
    >

      {state.success ? (

        <CheckCircle2
          className="
            mt-0.5
            h-4
            w-4
            shrink-0
          "
        />

      ) : (

        <MessageCircle
          className="
            mt-0.5
            h-4
            w-4
            shrink-0
          "
        />

      )}


      <span>
        {state.message}
      </span>

    </div>
  )
}


/* ==========================================================
   HELPER
========================================================== */

function formatChannel(
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