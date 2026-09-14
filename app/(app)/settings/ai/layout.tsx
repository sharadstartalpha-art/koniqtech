import Link from "next/link"
import type { ReactNode } from "react"

const navigation = [
  {
    label: "Overview",
    href: "/settings/ai",
    icon: "⌂",
  },
  {
    label: "Agents",
    href: "/settings/ai/agents",
    icon: "✦",
  },
  {
    label: "Tools",
    href: "/settings/ai/agents/tools",
    icon: "⚙",
  },
  {
    label: "Approvals",
    href: "/settings/ai/approvals",
    icon: "✓",
  },
  {
    label: "Executions",
    href: "/settings/ai/executions",
    icon: "⚡",
  },
  {
    label: "Workflows",
    href: "/settings/ai/workflows",
    icon: "↗",
  },
  {
    label: "Knowledge",
    href: "/settings/ai/knowledge",
    icon: "◈",
  },
  {
    label: "Usage",
    href: "/settings/ai/usage",
    icon: "◒",
  },
  {
    label: "History",
    href: "/settings/ai/history",
    icon: "☷",
  },
]

export default function AISettingsLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="space-y-6">
      {/* AI Navigation */}
      <nav
        aria-label="AI Settings Navigation"
        className="rounded-2xl border bg-white p-2 shadow-sm"
      >
        <div className="flex gap-1 overflow-x-auto pb-1">
          {navigation.map(
            (item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500 transition group-hover:bg-white group-hover:text-blue-600">
                  {item.icon}
                </span>

                <span>
                  {item.label}
                </span>
              </Link>
            ),
          )}
        </div>
      </nav>

      {/* Page Content */}
      {children}
    </div>
  )
}