import Link from "next/link"

import {
  ArrowLeft,
  CalendarClock,
  FileText,
  Mail,
  Send,
  Users,
} from "lucide-react"

import NewsletterForm from "../components/NewsletterForm"

/* =========================================================
   PAGE
========================================================= */

export default function NewMarketingNewsletterPage() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* =====================================================
          BACK LINK
      ===================================================== */}

      <Link
        href="/admin/marketing/newsletter"
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
        <ArrowLeft className="h-4 w-4" />

        Back to Newsletters
      </Link>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          xl:flex-row
          xl:items-start
          xl:justify-between
        "
      >
        <div>
          <p
            className="
              text-sm
              font-medium
              text-blue-600
            "
          >
            Marketing Newsletter
          </p>

          <h1
            className="
              mt-1
              text-3xl
              font-bold
              tracking-tight
              text-slate-950
            "
          >
            Create Newsletter
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-slate-500
            "
          >
            Create a newsletter, select the target audience,
            and either save it as a draft or schedule it for
            delivery.
          </p>
        </div>

        <div
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-blue-200
            bg-blue-50
            px-4
            py-2.5
            text-sm
            font-medium
            text-blue-700
          "
        >
          <Mail className="h-4 w-4" />

          Newsletter Composer
        </div>
      </div>

      {/* =====================================================
          WORKFLOW CARDS
      ===================================================== */}

      <div
        className="
          grid
          gap-4
          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        <WorkflowCard
          number="01"
          title="Compose"
          description="Write the newsletter subject and content."
          icon={FileText}
        />

        <WorkflowCard
          number="02"
          title="Audience"
          description="Choose which marketing segment receives it."
          icon={Users}
        />

        <WorkflowCard
          number="03"
          title="Schedule"
          description="Send immediately or select a future date."
          icon={CalendarClock}
        />

        <WorkflowCard
          number="04"
          title="Deliver"
          description="Queue delivery and track engagement."
          icon={Send}
        />
      </div>

      {/* =====================================================
          FORM SECTION
      ===================================================== */}

      <div
        className="
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
            px-6
            py-5
          "
        >
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
              <Mail className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h2
                className="
                  text-lg
                  font-bold
                  text-slate-950
                "
              >
                Newsletter Details
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Configure the newsletter content, audience,
                and delivery schedule.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <NewsletterForm />
        </div>
      </div>

      {/* =====================================================
          DELIVERY INFORMATION
      ===================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-orange-200
          bg-orange-50
          p-5
        "
      >
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
              bg-orange-100
            "
          >
            <Send className="h-5 w-5 text-orange-700" />
          </div>

          <div>
            <h3
              className="
                font-bold
                text-orange-950
              "
            >
              Delivery Architecture
            </h3>

            <p
              className="
                mt-1
                text-sm
                leading-6
                text-orange-800
              "
            >
              Newsletter creation should store the campaign
              first. Actual email delivery should be processed
              through your email queue and background worker,
              rather than sending every email inside the page
              request.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   WORKFLOW CARD
========================================================= */

function WorkflowCard({
  number,
  title,
  description,
  icon: Icon,
}: {
  number: string
  title: string
  description: string
  icon: React.ComponentType<{
    className?: string
  }>
}) {
  return (
    <div
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
          items-start
          justify-between
          gap-4
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
          <Icon className="h-5 w-5 text-blue-600" />
        </div>

        <span
          className="
            text-xs
            font-bold
            text-slate-300
          "
        >
          {number}
        </span>
      </div>

      <h3
        className="
          mt-4
          font-bold
          text-slate-950
        "
      >
        {title}
      </h3>

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
  )
}