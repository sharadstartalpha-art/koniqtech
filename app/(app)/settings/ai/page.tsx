import Link from "next/link"
import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

const aiSections = [
  {
    title: "AI Agents",
    description:
      "Create and manage AI agents, instructions, models, and permissions.",
    href: "/settings/ai/agents",
    icon: "✦",
  },
  {
    title: "Agent Tools",
    description:
      "Configure which CRM, communication, analytics, and other tools agents can use.",
    href: "/settings/ai/agents/tools",
    icon: "⚙",
  },
  {
    title: "Approvals",
    description:
      "Review and approve AI actions that require human authorization.",
    href: "/settings/ai/approvals",
    icon: "✓",
  },
  {
    title: "Executions",
    description:
      "Monitor AI tool calls, execution status, results, and failures.",
    href: "/settings/ai/executions",
    icon: "⚡",
  },
  {
    title: "Workflows",
    description:
      "Configure automated AI workflows and event-based triggers.",
    href: "/settings/ai/workflows",
    icon: "↗",
  },
  {
    title: "Knowledge",
    description:
      "Manage documents and knowledge sources available to AI.",
    href: "/settings/ai/knowledge",
    icon: "◈",
  },
  {
    title: "Usage",
    description:
      "Review AI usage, tokens, features, models, and consumption.",
    href: "/settings/ai/usage",
    icon: "◒",
  },
  {
    title: "Conversation History",
    description:
      "Review AI conversations and inspect previous messages.",
    href: "/settings/ai/history",
    icon: "☷",
  },
]

export default async function AISettingsPage() {
  const session =
    await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const currentUser =
    await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        organizationRole: {
          include: {
            permissions: true,
          },
        },
      },
    })

  if (!currentUser) {
    redirect("/login")
  }

  const isOwner =
    currentUser.organizationRole?.name
      ?.toLowerCase() ===
    "owner"

  const permission =
    currentUser.organizationRole?.permissions.find(
      (p) =>
        p.module ===
        "AI Settings",
    )

  if (
    !isOwner &&
    !permission?.canView
  ) {
    redirect("/dashboard")
  }

  const canEdit =
    isOwner ||
    Boolean(
      permission?.canEdit,
    )

  return (
    <div className="max-w-6xl space-y-8 pb-10">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/settings"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Settings
          </Link>

          <span className="text-slate-300">
            /
          </span>

          <span className="text-slate-500">
            AI
          </span>
        </div>

        <div className="mt-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            AI Settings
          </h1>

          <p className="mt-2 text-slate-500">
            Configure AI assistants, agents,
            automations, knowledge, and execution
            controls.
          </p>
        </div>
      </div>

      {/* AI Configuration */}
      <section className="rounded-3xl border border-orange-200 bg-orange-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-lg text-orange-700">
            !
          </div>

          <div>
            <h2 className="font-semibold text-orange-700">
              AI Configuration
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              AI features are managed by your
              KoniqTech subscription and cannot be
              modified from the dashboard. Contact
              support if you need to enable additional
              AI capabilities.
            </p>
          </div>
        </div>
      </section>

      {/* AI Configuration Controls */}
      <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
        <div className="border-b pb-5">
          <h2 className="text-xl font-bold text-slate-900">
            AI Assistant
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current AI capabilities available to your
            organization.
          </p>
        </div>

        <div className="divide-y">
          {/* Enable AI */}
          <label className="flex items-center justify-between gap-6 py-5">
            <div>
              <p className="font-semibold text-slate-800">
                Enable AI Assistant
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Enable the main AI assistant for your
                organization.
              </p>
            </div>

            <input
              type="checkbox"
              checked
              disabled
              readOnly
              className="h-5 w-5 cursor-not-allowed"
            />
          </label>

          {/* Lead Scoring */}
          <label className="flex items-center justify-between gap-6 py-5">
            <div>
              <p className="font-semibold text-slate-800">
                AI Lead Scoring
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Use AI-assisted analysis for lead
                prioritization.
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
              disabled={!canEdit}
              className="h-5 w-5"
            />
          </label>

          {/* Quote Generation */}
          <label className="flex items-center justify-between gap-6 py-5">
            <div>
              <p className="font-semibold text-slate-800">
                AI Quote Generation
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Use AI assistance when preparing quotes.
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
              disabled={!canEdit}
              className="h-5 w-5"
            />
          </label>

          {/* Dispatch */}
          <label className="flex items-center justify-between gap-6 py-5">
            <div>
              <p className="font-semibold text-slate-800">
                AI Dispatch Suggestions
              </p>

              <p className="mt-1 text-sm text-slate-500">
                AI-assisted scheduling and dispatch
                recommendations.
              </p>
            </div>

            <input
              type="checkbox"
              disabled
              readOnly
              className="h-5 w-5 cursor-not-allowed"
            />
          </label>
        </div>
      </section>

      {/* AI Management */}
      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">
            AI Management
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your AI platform from the sections
            below.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {aiSections.map(
            (section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-600 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                    {section.icon}
                  </div>

                  <span className="text-lg text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500">
                    →
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {section.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {section.description}
                </p>

                <div className="mt-5 text-sm font-semibold text-blue-600">
                  Manage {section.title}
                  <span className="ml-1 transition group-hover:ml-2">
                    →
                  </span>
                </div>
              </Link>
            ),
          )}
        </div>
      </section>

      {/* AI Platform Flow */}
      <section className="rounded-3xl border bg-slate-950 p-6 text-white shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              KoniqTech AI Platform
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              AI from request to execution
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              AI agents can use approved CRM tools,
              access configured knowledge, request human
              approval for actions, and record execution
              history.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <FlowItem
              number="01"
              label="Agent"
            />

            <FlowItem
              number="02"
              label="Tool"
            />

            <FlowItem
              number="03"
              label="Approval"
            />

            <FlowItem
              number="04"
              label="Execution"
            />
          </div>
        </div>
      </section>

      {/* Footer information */}
      <section className="rounded-2xl border bg-slate-50 p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              AI access
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {isOwner
                ? "You are viewing AI settings as an organization owner."
                : canEdit
                  ? "You have permission to edit AI settings."
                  : "You have view-only access to AI settings."}
            </p>
          </div>

          <span className="w-fit rounded-full border bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
            {canEdit
              ? "Edit Access"
              : "View Access"}
          </span>
        </div>
      </section>
    </div>
  )
}

function FlowItem({
  number,
  label,
}: {
  number: string
  label: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-[10px] font-bold tracking-widest text-slate-500">
        {number}
      </p>

      <p className="mt-2 text-sm font-semibold text-white">
        {label}
      </p>
    </div>
  )
}