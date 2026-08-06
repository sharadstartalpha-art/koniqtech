"use client";

import { useMemo, useState } from "react";

import {
  Database,
  Building2,
  Search,
  Layers3,
  Users,
  UserPlus,
  Briefcase,
  FileText,
  Receipt,
  DollarSign,
  Wrench,
  Package,
  Truck,
  Bot,
  Mail,
  MessageSquare,
  Bell,
  Calendar,
  Activity,
  Shield,
  Trash2,
  Download,
  Upload,
  Play,
  RotateCcw,
  Sparkles,
  BarChart3,
  AlertTriangle,
} from "lucide-react";

interface StatisticsCard {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

interface IndustryTemplate {
  id: string;
  name: string;
  description: string;
}

interface Organization {
  id: string;
  name: string;
  plan: string;
  industry: string;
}

interface GeneratorCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  defaultCount: number;
  color: string;
}

const statistics: StatisticsCard[] = [
  {
    title: "Organizations",
    value: "42",
    icon: Building2,
    color: "bg-blue-500",
  },
  {
    title: "Demo Records",
    value: "186,540",
    icon: Database,
    color: "bg-green-600",
  },
  {
    title: "Generated Today",
    value: "12,442",
    icon: Sparkles,
    color: "bg-orange-500",
  },
  {
    title: "Storage Used",
    value: "1.8 GB",
    icon: BarChart3,
    color: "bg-purple-600",
  },
];

const organizations: Organization[] = [
  {
    id: "1",
    name: "Starter Roofing Demo",
    plan: "Starter",
    industry: "Roofing",
  },
  {
    id: "2",
    name: "Professional HVAC Demo",
    plan: "Professional",
    industry: "HVAC",
  },
  {
    id: "3",
    name: "Enterprise Plumbing Demo",
    plan: "Enterprise",
    industry: "Plumbing",
  },
  {
    id: "4",
    name: "Landscaping Demo",
    plan: "Professional",
    industry: "Landscaping",
  },
];

const templates: IndustryTemplate[] = [
  {
    id: "roofing",
    name: "Roofing",
    description: "Roof inspections, estimates, insurance claims",
  },
  {
    id: "hvac",
    name: "HVAC",
    description: "Maintenance, installations and service calls",
  },
  {
    id: "plumbing",
    name: "Plumbing",
    description: "Residential & commercial plumbing jobs",
  },
  {
    id: "landscaping",
    name: "Landscaping",
    description: "Seasonal maintenance and lawn care",
  },
  {
    id: "cleaning",
    name: "Cleaning",
    description: "Residential & commercial cleaning services",
  },
  {
    id: "electrical",
    name: "Electrical",
    description: "Electrical repairs and installations",
  },
];

const generators: GeneratorCard[] = [
  {
    id: "customers",
    title: "Customers",
    description: "Generate customer records",
    icon: Users,
    defaultCount: 100,
    color: "bg-blue-500",
  },
  {
    id: "leads",
    title: "Leads",
    description: "Generate sales leads",
    icon: UserPlus,
    defaultCount: 250,
    color: "bg-indigo-600",
  },
  {
    id: "jobs",
    title: "Jobs",
    description: "Generate completed & scheduled jobs",
    icon: Briefcase,
    defaultCount: 150,
    color: "bg-orange-500",
  },
  {
    id: "estimates",
    title: "Estimates",
    description: "Generate estimates",
    icon: FileText,
    defaultCount: 120,
    color: "bg-cyan-600",
  },
  {
    id: "invoices",
    title: "Invoices",
    description: "Generate invoices",
    icon: Receipt,
    defaultCount: 120,
    color: "bg-green-600",
  },
  {
    id: "payments",
    title: "Payments",
    description: "Generate successful payments",
    icon: DollarSign,
    defaultCount: 120,
    color: "bg-emerald-600",
  },
  {
    id: "technicians",
    title: "Technicians",
    description: "Generate technicians",
    icon: Wrench,
    defaultCount: 25,
    color: "bg-yellow-500",
  },
  {
    id: "inventory",
    title: "Inventory",
    description: "Generate inventory items",
    icon: Package,
    defaultCount: 300,
    color: "bg-slate-600",
  },
  {
    id: "vehicles",
    title: "Fleet",
    description: "Generate company vehicles",
    icon: Truck,
    defaultCount: 20,
    color: "bg-red-600",
  },
  {
    id: "ai",
    title: "AI Conversations",
    description: "Generate AI history",
    icon: Bot,
    defaultCount: 500,
    color: "bg-purple-600",
  },
  {
    id: "emails",
    title: "Email Logs",
    description: "Generate email history",
    icon: Mail,
    defaultCount: 200,
    color: "bg-pink-600",
  },
  {
    id: "sms",
    title: "SMS Logs",
    description: "Generate SMS history",
    icon: MessageSquare,
    defaultCount: 200,
    color: "bg-teal-600",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Generate notifications",
    icon: Bell,
    defaultCount: 300,
    color: "bg-amber-500",
  },
  {
    id: "calendar",
    title: "Appointments",
    description: "Generate appointments",
    icon: Calendar,
    defaultCount: 120,
    color: "bg-blue-700",
  },
  {
    id: "activities",
    title: "Activities",
    description: "Generate activity logs",
    icon: Activity,
    defaultCount: 600,
    color: "bg-lime-600",
  },
  {
    id: "audit",
    title: "Audit Logs",
    description: "Generate audit history",
    icon: Shield,
    defaultCount: 1000,
    color: "bg-gray-700",
  },
];

export default function DemoDataPage() {
  const [search, setSearch] = useState("");

  const [selectedOrganization, setSelectedOrganization] =
    useState(organizations[0].id);

  const [selectedTemplate, setSelectedTemplate] =
    useState(templates[0].id);

  const filteredGenerators = useMemo(() => {
    return generators.filter((generator) =>
      (
        generator.title +
        generator.description
      )
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);


  const [progress, setProgress] =
  useState(0);

const [isGenerating, setIsGenerating] =
  useState(false);

const [completedModules, setCompletedModules] =
  useState(0);

const [queueLength, setQueueLength] =
  useState(0);



  const recentActivities = [
  {
    id: 1,
    module: "Organizations",
    records: 10,
    organization: "Starter Demo",
    status: "Completed",
    time: "2 minutes ago",
  },
  {
    id: 2,
    module: "Customers",
    records: 250,
    organization: "Professional Demo",
    status: "Completed",
    time: "8 minutes ago",
  },
  {
    id: 3,
    module: "Jobs",
    records: 180,
    organization: "Enterprise Demo",
    status: "Running",
    time: "Just now",
  },
  {
    id: 4,
    module: "Invoices",
    records: 300,
    organization: "Enterprise Demo",
    status: "Failed",
    time: "25 minutes ago",
  },
];


const [confirmOpen, setConfirmOpen] =
  useState(false);

const [confirmTitle, setConfirmTitle] =
  useState("");

const [confirmMessage, setConfirmMessage] =
  useState("");

const [confirmAction, setConfirmAction] =
  useState<(() => void) | null>(null);

const [confirmLoading, setConfirmLoading] =
  useState(false);

  const [loadingModule, setLoadingModule] =
  useState<string | null>(null);

const [refreshing, setRefreshing] =
  useState(false);

const [error, setError] =
  useState("");

const [success, setSuccess] =
  useState("");

function openConfirmation(
  title: string,
  message: string,
  action: () => void
) {
  setConfirmTitle(title);

  setConfirmMessage(message);

  setConfirmAction(() => action);

  setConfirmOpen(true);
}



async function generateModule(
  module: string,
  count: number
) {
  try {
    setLoadingModule(module);
    setError("");
    setSuccess("");

    const [selectedIndustry, setSelectedIndustry] =
  useState("roofing");

    const response = await fetch(
      "/api/admin/developer-tools/demo-data/generate",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          organizationId:
            selectedOrganization,
          industry:
            selectedIndustry,
          module,
          count,
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Generation failed."
      );
    }

    setSuccess(
      `${module} generated successfully.`
    );
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Unknown error."
    );
  } finally {
    setLoadingModule(null);
  }
}


async function refreshActivity() {
  try {
    setRefreshing(true);

    // TODO:
    // Fetch latest activity
  } finally {
    setRefreshing(false);
  }
}

async function deleteDemoData() {
  try {
    const response = await fetch(
      "/api/admin/developer-tools/demo-data",
      {
        method: "DELETE",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          organizationId:
            selectedOrganization,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Unable to delete demo data."
      );
    }

    setSuccess(
      "Demo data deleted."
    );
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Unknown error."
    );
  }
}





  return (
    <div className="space-y-8">

      {
  success && (
    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
      {success}
    </div>
  )
}

{
  error && (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
      {error}
    </div>
  )
}

      {/* Hero */}

      <section className="rounded-3xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow">

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">

              <Database className="h-4 w-4" />

              Developer Tools

            </div>

            <h1 className="text-4xl font-bold tracking-tight">
              Demo Data Generator
            </h1>

            <p className="mt-4 max-w-3xl text-slate-300">

              Instantly generate realistic CRM data for any
              organization without manually creating
              customers, jobs, invoices, technicians,
              inventory or AI conversations.

            </p>

          </div>

          <div className="flex gap-3">

            <button className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700">

              <Play className="h-5 w-5" />

              Generate Everything

            </button>

            <button className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/20">

              <RotateCcw className="h-5 w-5" />

              Reset

            </button>

          </div>

        </div>

      </section>

      {/* Statistics */}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {statistics.map((card) => {

          const Icon = card.icon;

          return (

            <div
              key={card.title}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    {card.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {card.value}
                  </h2>

                </div>

                <div
                  className={`rounded-xl p-3 text-white ${card.color}`}
                >

                  <Icon className="h-7 w-7" />

                </div>

              </div>

            </div>

          );

        })}

      </section>

      {/* Search */}

      <section className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="relative">

          <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search generator..."
            className="w-full rounded-xl border py-3 pl-12 pr-4 outline-none transition focus:border-blue-600"
          />

        </div>

      </section>

            {/* Configuration */}

      <section className="grid gap-6 xl:grid-cols-2">

        {/* Organization */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-lg bg-blue-100 p-3">

              <Building2 className="h-6 w-6 text-blue-600" />

            </div>

            <div>

              <h2 className="text-xl font-semibold">
                Target Organization
              </h2>

              <p className="text-sm text-slate-500">
                Select which organization should receive
                generated demo data.
              </p>

            </div>

          </div>

          <select
            value={selectedOrganization}
            onChange={(e) =>
              setSelectedOrganization(e.target.value)
            }
            className="w-full rounded-xl border p-3 outline-none focus:border-blue-600"
          >
            {organizations.map((organization) => (
              <option
                key={organization.id}
                value={organization.id}
              >
                {organization.name} • {organization.plan}
              </option>
            ))}
          </select>

        </div>

        {/* Industry */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-lg bg-green-100 p-3">

              <Layers3 className="h-6 w-6 text-green-600" />

            </div>

            <div>

              <h2 className="text-xl font-semibold">
                Industry Template
              </h2>

              <p className="text-sm text-slate-500">
                Generate realistic data based on a specific
                service industry.
              </p>

            </div>

          </div>

          <select
            value={selectedTemplate}
            onChange={(e) =>
              setSelectedTemplate(e.target.value)
            }
            className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
          >
            {templates.map((template) => (

              <option
                key={template.id}
                value={template.id}
              >
                {template.name}
              </option>

            ))}
          </select>

          <div className="mt-4 rounded-xl bg-slate-50 p-4">

            <p className="text-sm text-slate-600">

              {
                templates.find(
                  (t) =>
                    t.id === selectedTemplate
                )?.description
              }

            </p>

          </div>

        </div>

      </section>

      {/* Quick Actions */}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <button className="rounded-2xl border bg-green-600 p-6 text-left text-white shadow transition hover:bg-green-700">

          <Play className="mb-4 h-8 w-8" />

          <h3 className="text-lg font-semibold">
            Generate Everything
          </h3>

          <p className="mt-2 text-sm text-green-100">
            Creates every CRM module with realistic demo
            records.
          </p>

        </button>

        <button className="rounded-2xl border bg-blue-600 p-6 text-left text-white shadow transition hover:bg-blue-700">

          <Download className="mb-4 h-8 w-8" />

          <h3 className="text-lg font-semibold">
            Export Demo
          </h3>

          <p className="mt-2 text-sm text-blue-100">
            Export demo records as a reusable template.
          </p>

        </button>

        <button className="rounded-2xl border bg-purple-600 p-6 text-left text-white shadow transition hover:bg-purple-700">

          <Upload className="mb-4 h-8 w-8" />

          <h3 className="text-lg font-semibold">
            Import Demo
          </h3>

          <p className="mt-2 text-sm text-purple-100">
            Restore a previously exported demo dataset.
          </p>

        </button>

        <button className="rounded-2xl border bg-orange-500 p-6 text-left text-white shadow transition hover:bg-orange-600">

          <RotateCcw className="mb-4 h-8 w-8" />

          <h3 className="text-lg font-semibold">
            Reset Tenant
          </h3>

          <p className="mt-2 text-sm text-orange-100">
            Remove generated demo data while preserving
            configuration.
          </p>

        </button>

      </section>

    {/* Generator Section */}

    <section>
  <div className="mb-6 flex items-center justify-between">
    <div>
      <h2 className="text-2xl font-bold">
        Demo Data Generators
      </h2>

      <p className="mt-1 text-slate-500">
        Generate only the modules you need.
      </p>
    </div>

    <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
      {filteredGenerators.length} Modules
    </div>
  </div>

  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {filteredGenerators.map((generator) => {
      const Icon = generator.icon;

      return (
        <div
          key={generator.id}
          className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div
              className={`${generator.color} rounded-xl p-3 text-white`}
            >
              <Icon className="h-7 w-7" />
            </div>

            <button
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
              title="Reset Module"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <h3 className="mt-5 text-xl font-semibold">
            {generator.title}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {generator.description}
          </p>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Records to Generate
            </label>

            <input
              type="number"
              defaultValue={generator.defaultCount}
              min={1}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
            />
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-500">
                Estimated Time
              </span>

              <span className="font-semibold text-slate-700">
                {Math.ceil(generator.defaultCount / 40)}s
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`${generator.color} h-full w-3/4`}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {generator.defaultCount} Records
            </span>

            <div className="flex gap-2">
              <button className="rounded-xl border px-4 py-2 transition hover:bg-slate-100">
                Preview
              </button>

             <button
  onClick={() =>
    openConfirmation(
      "Delete Demo Data",
      "Delete all demo records?",
      deleteDemoData
    )
  }
  className="rounded-xl border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50"
>
  Clear
</button>
            </div>
          </div>

          <button
  onClick={() =>
    generateModule(
      generator.id,
      generator.defaultCount
    )
  }
  disabled={
    loadingModule ===
    generator.id
  }
  className="mt-4 w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
>
  {loadingModule ===
  generator.id
    ? "Generating..."
    : "Generate"}
</button>
        </div>
      );
    })}
  </div>
    </section>

      {/* Generation Progress */}

       <section className="rounded-3xl border bg-white p-8 shadow-sm">

  <div className="mb-8 flex items-center justify-between">

    <div>
      <h2 className="text-2xl font-bold">
        Generation Progress
      </h2>

      <p className="mt-1 text-slate-500">
        Monitor currently running demo generation tasks.
      </p>
    </div>

    <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
      {isGenerating ? "Running" : "Idle"}
    </span>

  </div>

  <div className="space-y-6">

    <div>

      <div className="mb-2 flex justify-between">

        <span className="font-medium">
          Overall Progress
        </span>

        <span>
          {progress}%
        </span>

      </div>

      <div className="h-4 overflow-hidden rounded-full bg-slate-200">

        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>

    <div className="grid gap-4 md:grid-cols-4">

      <div className="rounded-2xl border p-5">

        <p className="text-sm text-slate-500">
          Status
        </p>

        <p className="mt-2 text-xl font-bold">
          {isGenerating
            ? "Generating..."
            : "Ready"}
        </p>

      </div>

      <div className="rounded-2xl border p-5">

        <p className="text-sm text-slate-500">
          Completed
        </p>

        <p className="mt-2 text-xl font-bold">
          {completedModules}
        </p>

      </div>

      <div className="rounded-2xl border p-5">

        <p className="text-sm text-slate-500">
          Remaining
        </p>

        <p className="mt-2 text-xl font-bold">
          {filteredGenerators.length -
            completedModules}
        </p>

      </div>

      <div className="rounded-2xl border p-5">

        <p className="text-sm text-slate-500">
          Queue
        </p>

        <p className="mt-2 text-xl font-bold">
          {queueLength}
        </p>

      </div>

    </div>

  </div>

        </section>


       {/* Recent Activity */}

        <section className="rounded-3xl border bg-white p-8 shadow-sm">

         <div className="mb-8 flex items-center justify-between">

    <div>

      <h2 className="text-2xl font-bold">
        Recent Activity
      </h2>

      <p className="mt-1 text-slate-500">
        Latest demo data generation history.
      </p>

    </div>

    <button
  onClick={refreshActivity}
  disabled={refreshing}
  className="rounded-xl border px-4 py-2 hover:bg-slate-100"
>
  {refreshing
    ? "Refreshing..."
    : "Refresh"}
</button>

         </div>

          <div className="overflow-x-auto">

    <table className="w-full">

      <thead>

        <tr className="border-b bg-slate-50">

          <th className="px-5 py-4 text-left text-sm font-semibold">
            Module
          </th>

          <th className="px-5 py-4 text-left text-sm font-semibold">
            Organization
          </th>

          <th className="px-5 py-4 text-center text-sm font-semibold">
            Records
          </th>

          <th className="px-5 py-4 text-center text-sm font-semibold">
            Status
          </th>

          <th className="px-5 py-4 text-right text-sm font-semibold">
            Time
          </th>

        </tr>

      </thead>

      <tbody>

        {recentActivities.map((activity) => (

          <tr
            key={activity.id}
            className="border-b hover:bg-slate-50"
          >

            <td className="px-5 py-4 font-medium">
              {activity.module}
            </td>

            <td className="px-5 py-4">
              {activity.organization}
            </td>

            <td className="px-5 py-4 text-center">
              {activity.records}
            </td>

            <td className="px-5 py-4 text-center">

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold

                ${
                  activity.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : activity.status === "Running"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {activity.status}
              </span>

            </td>

            <td className="px-5 py-4 text-right text-slate-500">
              {activity.time}
            </td>

          </tr>

        ))}

      </tbody>

    </table>

           </div>

           </section>




          {confirmOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

    <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">

      <div className="border-b p-6">

        <h2 className="text-2xl font-bold">
          {confirmTitle}
        </h2>

        <p className="mt-3 text-slate-600">
          {confirmMessage}
        </p>

      </div>

      <div className="border-b bg-amber-50 p-5">

        <div className="flex items-start gap-3">

          <AlertTriangle className="mt-1 h-6 w-6 text-amber-600" />

          <div>

            <p className="font-semibold text-amber-800">
              Warning
            </p>

            <p className="mt-1 text-sm text-amber-700">
              This operation may overwrite or remove existing demo
              records. This action cannot be undone.
            </p>

          </div>

        </div>

      </div>

      <div className="flex justify-end gap-3 p-6">

        <button
          onClick={() =>
            setConfirmOpen(false)
          }
          disabled={confirmLoading}
          className="rounded-xl border px-5 py-2.5 transition hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          disabled={confirmLoading}
          onClick={async () => {

            setConfirmLoading(true);

            try {

              await confirmAction?.();

            } finally {

              setConfirmLoading(false);

              setConfirmOpen(false);

            }

          }}
          className="rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {confirmLoading
            ? "Processing..."
            : "Confirm"}
        </button>

      </div>

    </div>

  </div>
           )}




          </div>

         );
         }