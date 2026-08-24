// app/(app)/invoices/templates/page.tsx

import Link from "next/link"
import {
  FileText,
  Briefcase,
  Wrench,
  Home,
  Building2,
  Sparkles,
  ArrowRight,
} from "lucide-react"

const templates = [
  {
    id: 1,
    name: "General Service",
    description: "Standard invoice for any service business.",
    icon: FileText,
    color: "bg-blue-50 text-blue-700",
  },
  {
    id: 2,
    name: "Construction",
    description: "Progress billing with labour and materials.",
    icon: Building2,
    color: "bg-amber-50 text-amber-700",
  },
  {
    id: 3,
    name: "HVAC",
    description: "Installation, maintenance and repair invoice.",
    icon: Home,
    color: "bg-cyan-50 text-cyan-700",
  },
  {
    id: 4,
    name: "Electrical",
    description: "Electrical service invoice template.",
    icon: Sparkles,
    color: "bg-yellow-50 text-yellow-700",
  },
  {
    id: 5,
    name: "Plumbing",
    description: "Professional plumbing invoice layout.",
    icon: Wrench,
    color: "bg-sky-50 text-sky-700",
  },
  {
    id: 6,
    name: "Consulting",
    description: "Business and consulting services invoice.",
    icon: Briefcase,
    color: "bg-violet-50 text-violet-700",
  },
]

export default function InvoiceTemplatesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Invoice Templates</h1>
        <p className="text-slate-500 mt-2">
          Choose a professional template when creating invoices.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => {
          const Icon = template.icon

          return (
            <div
              key={template.id}
              className="rounded-3xl border bg-white p-6 shadow-sm hover:shadow-lg transition"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${template.color}`}
              >
                <Icon className="h-7 w-7" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                {template.name}
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                {template.description}
              </p>

              <div className="mt-8">
                <Link
                  href={`/invoices/create?template=${template.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-white hover:bg-slate-800"
                >
                  Use Template
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}