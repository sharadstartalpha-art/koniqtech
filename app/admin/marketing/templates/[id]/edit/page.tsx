import Link from "next/link"

import {
  notFound,
  redirect,
} from "next/navigation"

import {
  ArrowLeft,
  Edit3,
  FileText,
  Info,
  LayoutTemplate,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import TemplateEditForm from "./components/TemplateEditForm"

/* =========================================================
   TYPES
========================================================= */

type EditMarketingTemplatePageProps = {
  params: Promise<{
    id: string
  }>
}

/* =========================================================
   PAGE
========================================================= */

export default async function EditMarketingTemplatePage({
  params,
}: EditMarketingTemplatePageProps) {
  /* =======================================================
     AUTH
  ======================================================= */

  const session =
    await auth()

  const userId =
    (
      session?.user as {
        id?: string
      } | undefined
    )?.id

  if (!userId) {
    redirect("/login")
  }

  /* =======================================================
     USER CONTEXT
  ======================================================= */

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        orgId: true,
      },
    })

  if (!user?.orgId) {
    redirect("/login")
  }

  /* =======================================================
     PARAMS
  ======================================================= */

  const {
    id,
  } = await params

  /* =======================================================
     TEMPLATE
  ======================================================= */

  const template =
    await prisma.marketingTemplate.findFirst({
      where: {
        id,
        orgId: user.orgId,
      },

      select: {
        id: true,

        name: true,

        description: true,

        category: true,

        subject: true,

        previewText: true,

        content: true,

        status: true,

        usageCount: true,

        createdAt: true,

        updatedAt: true,
      },
    })

  if (!template) {
    notFound()
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
          href={`/admin/marketing/templates/${template.id}`}
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

          Back to Template
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
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-orange-50
                text-orange-600
              "
            >
              <Edit3 className="h-7 w-7" />
            </div>

            <div>
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-orange-600
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
                Edit Template
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
                Update the content, category,
                subject, preview text, and
                availability of{" "}
                <span
                  className="
                    font-semibold
                    text-slate-700
                  "
                >
                  {template.name}
                </span>
                .
              </p>
            </div>
          </div>

          {/* =============================================
              VIEW BUTTON
          ============================================= */}

          <Link
            href={`/admin/marketing/templates/${template.id}`}
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
            <LayoutTemplate className="h-4 w-4" />

            View Template
          </Link>
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
              FORM CARD
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
                    text-orange-600
                  "
                >
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <h2
                    className="
                      font-bold
                      text-slate-950
                    "
                  >
                    Template Details
                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    Make changes to the reusable
                    template content and settings.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <TemplateEditForm
                template={{
                  id:
                    template.id,

                  name:
                    template.name,

                  description:
                    template.description,

                  category:
                    template.category,

                  subject:
                    template.subject,

                  previewText:
                    template.previewText,

                  content:
                    template.content,

                  status:
                    template.status,
                }}
              />
            </div>
          </div>

          {/* =============================================
              SIDEBAR
          ============================================= */}

          <aside className="space-y-5">
            {/* ===========================================
                EDITING INFORMATION
            =========================================== */}

            <section
              className="
                rounded-2xl
                border
                border-blue-200
                bg-blue-50
                p-5
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
                    bg-blue-100
                    text-blue-700
                  "
                >
                  <Info className="h-5 w-5" />
                </div>

                <div>
                  <h3
                    className="
                      font-bold
                      text-blue-950
                    "
                  >
                    Editing Template
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-blue-800
                    "
                  >
                    Changes will affect future use
                    of this template. Previously
                    queued or sent emails will not
                    be modified.
                  </p>
                </div>
              </div>
            </section>

            {/* ===========================================
                TEMPLATE INFORMATION
            =========================================== */}

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
              <h3
                className="
                  font-bold
                  text-slate-950
                "
              >
                Template Information
              </h3>

              <div
                className="
                  mt-5
                  divide-y
                  divide-slate-100
                "
              >
                <InfoRow
                  label="Usage Count"
                  value={`${template.usageCount}`}
                />

                <InfoRow
                  label="Created"
                  value={formatDate(
                    template.createdAt
                  )}
                />

                <InfoRow
                  label="Last Updated"
                  value={formatDate(
                    template.updatedAt
                  )}
                />
              </div>
            </section>

            {/* ===========================================
                SAFETY
            =========================================== */}

            <section
              className="
                rounded-2xl
                border
                border-green-200
                bg-green-50
                p-5
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
                    bg-green-100
                    text-green-700
                  "
                >
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <h3
                    className="
                      font-bold
                      text-green-950
                    "
                  >
                    Tenant Protected
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-green-800
                    "
                  >
                    This template is scoped to
                    your organization and cannot
                    be edited through another
                    tenant account.
                  </p>
                </div>
              </div>
            </section>

            {/* ===========================================
                EDITING CHECKLIST
            =========================================== */}

            <section
              className="
                rounded-2xl
                border
                border-orange-200
                bg-orange-50
                p-5
              "
            >
              <h3
                className="
                  font-bold
                  text-orange-950
                "
              >
                Before Saving
              </h3>

              <div className="mt-4 space-y-3">
                <ChecklistItem text="Check personalization placeholders" />

                <ChecklistItem text="Review the email subject" />

                <ChecklistItem text="Check preview text length" />

                <ChecklistItem text="Verify the template category" />

                <ChecklistItem text="Preview the final content" />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
  value: Date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month:
        "short",

      day:
        "numeric",

      year:
        "numeric",

      hour:
        "numeric",

      minute:
        "2-digit",
    }
  ).format(value)
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
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
        py-3
        first:pt-0
        last:pb-0
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
          text-right
          text-sm
          font-semibold
          text-slate-800
        "
      >
        {value}
      </span>
    </div>
  )
}

/* =========================================================
   CHECKLIST ITEM
========================================================= */

function ChecklistItem({
  text,
}: {
  text: string
}) {
  return (
    <div
      className="
        flex
        items-start
        gap-2
      "
    >
      <div
        className="
          mt-1
          h-2
          w-2
          shrink-0
          rounded-full
          bg-orange-500
        "
      />

      <span
        className="
          text-sm
          leading-5
          text-orange-800
        "
      >
        {text}
      </span>
    </div>
  )
}