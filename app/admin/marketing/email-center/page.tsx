import Link from "next/link"

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  Megaphone,
  Plus,
  Send,
  Users,
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

/* =========================================================
   PAGE
========================================================= */

export default async function MarketingEmailCenterPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
          You are not authorized to view the Email Center.
        </div>
      </div>
    )
  }

  /* =======================================================
     SAFE DATA
  ======================================================= */

  const [
    totalCampaigns,
    runningCampaigns,
    emailCampaigns,
  ] = await Promise.all([
    prisma.marketingCampaign.count(),

    prisma.marketingCampaign.count({
      where: {
        status: "running",
      },
    }),

    prisma.marketingCampaign.count({
      where: {
        channel: "email",
      },
    }),
  ])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1500px] space-y-6 p-6 lg:p-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Marketing Communication
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Email Center
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Create marketing emails, manage campaign
              communication, monitor delivery queues, and
              review email activity.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/marketing/templates"
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
                font-semibold
                text-blue-700
                transition
                hover:bg-blue-100
              "
            >
              <FileText className="h-4 w-4" />

              Email Templates
            </Link>

            <Link
              href="/admin/marketing/email-center/new"
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-green-600
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-green-700
              "
            >
              <Plus className="h-4 w-4" />

              Compose Email
            </Link>
          </div>
        </div>

        {/* =================================================
            METRICS
        ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Email Campaigns"
            value={emailCampaigns.toString()}
            subtitle="Campaigns using email"
            icon={
              <Mail className="h-5 w-5 text-blue-600" />
            }
          />

          <MetricCard
            title="Running Campaigns"
            value={runningCampaigns.toString()}
            subtitle="Currently active"
            icon={
              <Send className="h-5 w-5 text-green-600" />
            }
          />

          <MetricCard
            title="All Campaigns"
            value={totalCampaigns.toString()}
            subtitle="Across every channel"
            icon={
              <Megaphone className="h-5 w-5 text-orange-600" />
            }
          />

          <MetricCard
            title="Audience"
            value="Leads"
            subtitle="Marketing lead contacts"
            icon={
              <Users className="h-5 w-5 text-violet-600" />
            }
          />
        </div>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-950">
              Email Operations
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage the complete marketing email workflow.
            </p>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
            <OperationCard
              href="/admin/marketing/email-center/new"
              title="Compose Email"
              description="Create and send a new marketing email."
              icon={
                <Mail className="h-5 w-5 text-green-600" />
              }
            />

            <OperationCard
              href="/admin/marketing/templates"
              title="Templates"
              description="Create and manage reusable email templates."
              icon={
                <FileText className="h-5 w-5 text-blue-600" />
              }
            />

            <OperationCard
              href="/admin/marketing/email-queue"
              title="Email Queue"
              description="Monitor pending and processing email jobs."
              icon={
                <Clock3 className="h-5 w-5 text-orange-600" />
              }
            />

            <OperationCard
              href="/admin/marketing/campaigns"
              title="Campaigns"
              description="Connect emails with marketing campaigns."
              icon={
                <Megaphone className="h-5 w-5 text-violet-600" />
              }
            />
          </div>
        </section>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

          {/* ===============================================
              EMAIL WORKFLOW
          =============================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-bold text-slate-950">
                Email Workflow
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Standard marketing email delivery process.
              </p>
            </div>

            <div className="space-y-3 p-6">
              <WorkflowRow
                number="01"
                title="Choose Audience"
                description="Select leads or campaign recipients."
                icon={
                  <Users className="h-5 w-5 text-blue-600" />
                }
              />

              <WorkflowRow
                number="02"
                title="Prepare Message"
                description="Write the email or use an existing template."
                icon={
                  <FileText className="h-5 w-5 text-violet-600" />
                }
              />

              <WorkflowRow
                number="03"
                title="Queue Delivery"
                description="Create queue records for controlled delivery."
                icon={
                  <Clock3 className="h-5 w-5 text-orange-600" />
                }
              />

              <WorkflowRow
                number="04"
                title="Track Delivery"
                description="Monitor sent, delivered, and failed emails."
                icon={
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                }
              />
            </div>
          </section>

          {/* ===============================================
              DELIVERY HEALTH
          =============================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-bold text-slate-950">
                Delivery Center
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Email delivery monitoring shortcuts.
              </p>
            </div>

            <div className="space-y-3 p-6">
              <DeliveryRow
                label="Queued"
                description="Waiting for processing"
                icon={
                  <Clock3 className="h-5 w-5 text-orange-600" />
                }
              />

              <DeliveryRow
                label="Sent"
                description="Successfully submitted"
                icon={
                  <Send className="h-5 w-5 text-blue-600" />
                }
              />

              <DeliveryRow
                label="Delivered"
                description="Accepted by recipient server"
                icon={
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                }
              />

              <DeliveryRow
                label="Failed"
                description="Requires attention or retry"
                icon={
                  <AlertCircle className="h-5 w-5 text-red-600" />
                }
              />

              <Link
                href="/admin/marketing/email-queue"
                className="
                  mt-4
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                "
              >
                Open Email Queue

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50">
          {icon}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   OPERATION CARD
========================================================= */

function OperationCard({
  href,
  title,
  description,
  icon,
}: {
  href: string
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="
        group
        rounded-xl
        border
        border-slate-200
        p-5
        transition
        hover:border-blue-200
        hover:bg-blue-50/40
      "
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600">
        Open

        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

/* =========================================================
   WORKFLOW ROW
========================================================= */

function WorkflowRow({
  number,
  title,
  description,
  icon,
}: {
  number: string
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-600">
            {number}
          </span>

          <h3 className="font-semibold text-slate-950">
            {title}
          </h3>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  )
}

/* =========================================================
   DELIVERY ROW
========================================================= */

function DeliveryRow({
  label,
  description,
  icon,
}: {
  label: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50">
        {icon}
      </div>

      <div>
        <p className="font-semibold text-slate-950">
          {label}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  )
}