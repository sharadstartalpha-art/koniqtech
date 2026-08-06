import Link from "next/link";
import {
  Bug,
  Users,
  Shield,
  CreditCard,
  Database,
  Bell,
  Cpu,
  Boxes,
  Activity,
  HardDrive,
  Mail,
  MessageSquare,
  ArrowRight,
  Settings2,
} from "lucide-react";

const sections = [
  {
    title: "Login As Customer",
    description:
      "Impersonate any organization owner or CRM user without knowing their password.",
    href: "/admin/developer-tools/login-as",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Subscription Simulator",
    description:
      "Switch between Starter, Professional, Enterprise, Trial, Expired and Cancelled.",
    href: "/admin/developer-tools/subscriptions",
    icon: CreditCard,
    color: "bg-green-500",
  },
  {
    title: "Role Switcher",
    description:
      "Preview Owner, Manager, Sales, Dispatcher and Technician permissions.",
    href: "/admin/developer-tools/roles",
    icon: Shield,
    color: "bg-purple-500",
  },
  {
    title: "Feature Flags",
    description:
      "Enable or disable AI, Inventory, Fleet, Voice, GPS and other modules.",
    href: "/admin/developer-tools/features",
    icon: Settings2,
    color: "bg-orange-500",
  },
  {
    title: "Demo Data",
    description:
      "Generate organizations, customers, leads, jobs, invoices and technicians.",
    href: "/admin/developer-tools/demo-data",
    icon: Database,
    color: "bg-cyan-500",
  },
  {
    title: "Webhook Simulator",
    description:
      "Fire PayPal, Resend, Twilio and internal webhook events.",
    href: "/admin/developer-tools/webhooks",
    icon: Activity,
    color: "bg-pink-500",
  },
  {
    title: "Payment Simulator",
    description:
      "Simulate successful, failed, refunded and cancelled subscriptions.",
    href: "/admin/developer-tools/payments",
    icon: CreditCard,
    color: "bg-red-500",
  },
  {
    title: "Usage Manager",
    description:
      "Reset or increase CRM usage limits for any organization.",
    href: "/admin/developer-tools/usage",
    icon: Boxes,
    color: "bg-indigo-500",
  },
  {
    title: "Email Tester",
    description:
      "Send welcome, OTP, invoice and subscription emails instantly.",
    href: "/admin/developer-tools/email",
    icon: Mail,
    color: "bg-emerald-500",
  },
  {
    title: "SMS Tester",
    description:
      "Send OTP and notification SMS using Twilio.",
    href: "/admin/developer-tools/sms",
    icon: MessageSquare,
    color: "bg-yellow-500",
  },
  {
    title: "Storage Tools",
    description:
      "Upload test files to AWS S3 and clean demo uploads.",
    href: "/admin/developer-tools/storage",
    icon: HardDrive,
    color: "bg-slate-600",
  },
  {
    title: "AI Tools",
    description:
      "Test AI Quote Generator, Email Writer and Voice Agent.",
    href: "/admin/developer-tools/ai",
    icon: Cpu,
    color: "bg-violet-600",
  },
];

export default function DeveloperToolsPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white shadow">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-red-500 p-3">
            <Bug className="h-8 w-8" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              Developer Tools
            </h1>

            <p className="mt-2 text-slate-300">
              Internal testing utilities for Super Admin.
              These tools let you test plans, roles,
              subscriptions, AI, emails, webhooks and
              organizations without touching production
              payments.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`mb-5 inline-flex rounded-xl p-3 text-white ${section.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <h2 className="text-xl font-semibold text-slate-900">
                {section.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {section.description}
              </p>

              <div className="mt-6 flex items-center gap-2 font-medium text-blue-600">
                Open Tool
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}