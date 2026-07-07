import Link from "next/link"

import {
  redirect,
} from "next/navigation"

import {
  ArrowLeft,
  FileText,
  LayoutTemplate,
  Lightbulb,
  Mail,
  Sparkles,
} from "lucide-react"

import { auth } from "@/auth"

import TemplateForm from "../components/TemplateForm"

/* =========================================================
   PAGE
========================================================= */

export default async function NewMarketingTemplatePage() {
  /* =======================================================
     AUTH
  ======================================================= */

  const session =
    await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const orgId =
    session.user.orgId

  if (!orgId) {
    redirect("/login")
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50">
      <div
        className="
          mx-auto
          max-w-[1500px]
          space-y-7
          px-6
          py-8
          lg:px-8
        "
      >
        {/* ===============================================
            BACK
        =============================================== */}

        <Link
          href="/admin/marketing/templates"
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

          Back to Templates
        </Link>

        {/* ===============================================
            HEADER
        =============================================== */}

        <div
          className="
            flex
            flex-col
            gap-5
            xl:flex-row
            xl:items-start
            xl:justify-between
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
                text-blue-600
              "
            >
              <LayoutTemplate className="h-7 w-7" />
            </div>

            <div>
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-blue-600
                "
              >
                <Sparkles className="h-4 w-4" />

                Marketing Template Library
              </div>

              <h1
                className="
                  mt-2
                  text-3xl
                  font-bold
                  tracking-tight
                  text-slate-950
                "
              >
                Create Marketing Template
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
                Create reusable content for campaigns,
                newsletters, demo invitations, reminders,
                follow-ups, sales outreach, onboarding,
                and re-engagement workflows.
              </p>
            </div>
          </div>
        </div>

        {/* ===============================================
            MAIN GRID
        =============================================== */}

        <div
          className="
            grid
            gap-6
            xl:grid-cols-[minmax(0,1fr)_340px]
          "
        >
          {/* =============================================
              FORM
          ============================================= */}

          <div
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
                px-6
                py-5
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-green-50
                    text-green-600
                  "
                >
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-950">
                    Template Details
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Configure the template information and
                    reusable message content.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <TemplateForm />
            </div>
          </div>

          {/* =============================================
              SIDEBAR
          ============================================= */}

          <aside className="space-y-5">
            {/* TEMPLATE GUIDANCE */}

            <section
              className="
                rounded-2xl
                border
                border-blue-200
                bg-blue-50
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
                    bg-blue-100
                    text-blue-700
                  "
                >
                  <Lightbulb className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-bold text-blue-950">
                    Template Tips
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-blue-800
                    "
                  >
                    Keep templates reusable. Avoid adding
                    company-specific information directly
                    when a reusable placeholder can be used
                    instead.
                  </p>
                </div>
              </div>
            </section>

            {/* RECOMMENDED STRUCTURE */}

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
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-orange-500" />

                <h3 className="font-bold text-slate-950">
                  Recommended Structure
                </h3>
              </div>

              <div className="mt-5 space-y-4">
                <GuidanceItem
                  number="1"
                  title="Clear opening"
                  description="Explain the purpose of the message quickly."
                />

                <GuidanceItem
                  number="2"
                  title="Relevant value"
                  description="Show the benefit to the recipient."
                />

                <GuidanceItem
                  number="3"
                  title="Simple CTA"
                  description="Ask for one clear next action."
                />

                <GuidanceItem
                  number="4"
                  title="Short closing"
                  description="End with a natural and professional closing."
                />
              </div>
            </section>

            {/* TEMPLATE CATEGORIES */}

            <section
              className="
                rounded-2xl
                border
                border-orange-200
                bg-orange-50
                p-5
              "
            >
              <h3 className="font-bold text-orange-950">
                Template Categories
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-orange-800
                "
              >
                Select the category that best describes the
                intended use. This makes templates easier to
                discover later in campaigns and communication
                workflows.
              </p>

              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  gap-2
                "
              >
                {[
                  "Campaign",
                  "Newsletter",
                  "Demo Invitation",
                  "Demo Reminder",
                  "Follow-up",
                  "Sales Outreach",
                  "Trial",
                  "Onboarding",
                  "Re-engagement",
                ].map((category) => (
                  <span
                    key={category}
                    className="
                      rounded-full
                      border
                      border-orange-200
                      bg-white
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      text-orange-700
                    "
                  >
                    {category}
                  </span>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   GUIDANCE ITEM
========================================================= */

function GuidanceItem({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-blue-50
          text-xs
          font-bold
          text-blue-600
        "
      >
        {number}
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-slate-500
          "
        >
          {description}
        </p>
      </div>
    </div>
  )
}