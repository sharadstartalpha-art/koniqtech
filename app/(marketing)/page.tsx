import type { Metadata } from "next"
import Link from "next/link"

import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Play,
  Star,
  ShieldCheck,
  Zap,
  Building2,
  Users,
  TrendingUp,
  Globe,
} from "lucide-react"

export const metadata: Metadata = {
  title: "KoniqTech | AI Field Service CRM for Roofing, HVAC, Plumbing & Landscaping",
  description:
    "Grow your field service business with KoniqTech. Manage leads, estimates, jobs, technicians, invoicing, automation and AI from one platform.",
}

const trustedCompanies = [
  "Roofing Companies",
  "HVAC Contractors",
  "Plumbing Companies",
  "Landscaping Teams",
  "Electrical Services",
  "General Contractors",
]

const stats = [
  {
    title: "Businesses",
    value: "2,500+",
    icon: Building2,
  },
  {
    title: "Users",
    value: "35,000+",
    icon: Users,
  },
  {
    title: "Jobs Managed",
    value: "4.2M+",
    icon: TrendingUp,
  },
  {
    title: "Countries",
    value: "18",
    icon: Globe,
  },
]

export default function MarketingHomePage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ====================================================== */}
      {/* Navigation */}
      {/* ====================================================== */}

      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <img
              src="/logo.png"
              alt="KoniqTech"
              className="h-11 w-11"
            />

            <div>
              <h2 className="text-xl font-bold">
                KoniqTech
              </h2>

              <p className="text-xs text-slate-500">
                AI Field Service CRM
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">

            <Link
              href="/features"
              className="font-medium text-slate-600 transition hover:text-orange-600"
            >
              Features
            </Link>

            <Link
              href="/industries"
              className="font-medium text-slate-600 transition hover:text-orange-600"
            >
              Industries
            </Link>

            <Link
              href="/pricing"
              className="font-medium text-slate-600 transition hover:text-orange-600"
            >
              Pricing
            </Link>

            <Link
              href="/integrations"
              className="font-medium text-slate-600 transition hover:text-orange-600"
            >
              Integrations
            </Link>

            <Link
              href="/blog"
              className="font-medium text-slate-600 transition hover:text-orange-600"
            >
              Blog
            </Link>

            <Link
              href="/contact"
              className="font-medium text-slate-600 transition hover:text-orange-600"
            >
              Contact
            </Link>

          </nav>

          <div className="flex items-center gap-4">

            <Link
              href="/login"
              className="hidden font-medium text-slate-600 hover:text-orange-600 md:block"
            >
              Sign In
            </Link>

            <Link
              href="/demo"
              className="inline-flex h-12 items-center rounded-xl bg-orange-500 px-6 font-semibold text-white transition hover:bg-orange-600"
            >
              Book Demo
            </Link>

          </div>

        </div>

      </header>

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-blue-50" />

        <div className="absolute -top-44 right-0 h-[520px] w-[520px] rounded-full bg-orange-200/30 blur-3xl" />

        <div className="absolute -bottom-44 left-0 h-[520px] w-[520px] rounded-full bg-blue-200/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-20 px-6 py-24 lg:grid-cols-2 lg:items-center">

          {/* LEFT */}

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">

              <Zap size={16} />

              AI Powered Field Service CRM

            </div>

            <h1 className="mt-8 text-5xl font-extrabold leading-tight text-slate-900 lg:text-7xl">

              Grow Your

              <span className="block text-orange-500">

                Service Business

              </span>

              Faster Than Ever

            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-600">

              KoniqTech helps Roofing, HVAC, Plumbing,
              Landscaping and Home Service companies
              manage leads, estimates, scheduling,
              dispatching, technicians, invoices,
              automation and AI from one powerful
              platform.

            </p>

            <div className="mt-10 flex flex-wrap gap-5">

              <Link
                href="/register"
                className="inline-flex h-14 items-center rounded-2xl bg-orange-500 px-8 font-semibold text-white transition hover:bg-orange-600"
              >
                Start Free Trial

                <ArrowRight
                  className="ml-3"
                  size={18}
                />

              </Link>

              <Link
                href="/demo"
                className="inline-flex h-14 items-center rounded-2xl border px-8 font-semibold hover:bg-slate-50"
              >
                <Play
                  className="mr-3"
                  size={18}
                />

                Watch Demo

              </Link>

            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">

              <Feature text="Unlimited Leads & Customers" />
              <Feature text="AI Estimates & Automation" />
              <Feature text="Technician Dispatch" />
              <Feature text="Mobile Field App" />
              <Feature text="Invoices & Payments" />
              <Feature text="Real-time Analytics" />

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative">

            <div className="rounded-[36px] border bg-white p-8 shadow-2xl">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Monthly Revenue
                  </p>

                  <h2 className="mt-2 text-5xl font-bold">
                    $182,400
                  </h2>

                </div>

                <div className="rounded-2xl bg-green-100 px-4 py-2 font-semibold text-green-700">

                  +38%

                </div>

              </div>

              <div className="mt-10 grid gap-5">

                <DashboardCard
                  title="Today's Jobs"
                  value="84"
                  color="blue"
                />

                <DashboardCard
                  title="New Leads"
                  value="27"
                  color="orange"
                />

                <DashboardCard
                  title="Invoices Paid"
                  value="$18,450"
                  color="green"
                />

                <DashboardCard
                  title="Technicians Online"
                  value="31"
                  color="purple"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* STATS */}
      {/* ====================================================== */}

      <section className="border-y bg-slate-50">

        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-14 md:grid-cols-2 xl:grid-cols-4">

          {stats.map((item) => {

            const Icon = item.icon

            return (

              <div
                key={item.title}
                className="rounded-3xl bg-white p-8 shadow-sm"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-slate-500">
                      {item.title}
                    </p>

                    <h3 className="mt-2 text-4xl font-bold">
                      {item.value}
                    </h3>

                  </div>

                  <div className="rounded-2xl bg-orange-100 p-4">

                    <Icon
                      className="text-orange-600"
                      size={28}
                    />

                  </div>

                </div>

              </div>

            )

          })}

        </div>

      </section>

            {/* ====================================================== */}
      {/* TRUSTED BY */}
      {/* ====================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">

              Trusted by Growing Service Businesses

            </p>

            <h2 className="mt-4 text-4xl font-bold text-slate-900">

              Built for Modern Field Service Companies

            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">

              Thousands of contractors use KoniqTech to
              streamline operations, close more jobs,
              dispatch technicians faster and grow
              revenue with AI-powered automation.

            </p>

          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3 xl:grid-cols-6">

            {trustedCompanies.map((company) => (

              <div
                key={company}
                className="
                flex
                h-24
                items-center
                justify-center
                rounded-3xl
                border
                bg-slate-50
                text-center
                font-semibold
                text-slate-700
                transition
                hover:border-orange-300
                hover:bg-orange-50
                "
              >

                {company}

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* CTA */}
      {/* ====================================================== */}

      <section className="bg-gradient-to-r from-orange-500 to-orange-600">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-6 py-20 text-center text-white lg:flex-row lg:text-left">

          <div>

            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">

              <ShieldCheck size={18} />

              Trusted Platform

            </div>

            <h2 className="mt-6 text-5xl font-bold leading-tight">

              Ready To Grow
              <br />
              Your Business?

            </h2>

            <p className="mt-6 max-w-2xl text-xl leading-9 text-orange-100">

              Join contractors using KoniqTech to
              increase revenue, automate repetitive
              work, improve technician productivity and
              deliver a better customer experience.

            </p>

          </div>

          <div className="flex flex-wrap justify-center gap-5">

            <Link
              href="/register"
              className="
              inline-flex
              h-14
              items-center
              rounded-2xl
              bg-white
              px-8
              font-semibold
              text-orange-600
              transition
              hover:bg-orange-100
              "
            >

              Start Free Trial

              <ArrowRight
                size={18}
                className="ml-3"
              />

            </Link>

            <Link
              href="/demo"
              className="
              inline-flex
              h-14
              items-center
              rounded-2xl
              border
              border-white/40
              px-8
              font-semibold
              text-white
              transition
              hover:bg-white/10
              "
            >

              Schedule Demo

              <ChevronRight
                size={18}
                className="ml-2"
              />

            </Link>

          </div>

        </div>

      </section>

   


      {/* ====================================================== */}
      {/* FEATURES */}
      {/* ====================================================== */}

      <section className="bg-slate-50">

        <div className="mx-auto max-w-7xl px-6 py-28">

          <div className="mx-auto max-w-3xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-5 py-2 text-sm font-semibold text-orange-700">

              <Zap size={16} />

              Everything Your Business Needs

            </div>

            <h2 className="mt-8 text-5xl font-bold tracking-tight text-slate-900">

              One Platform.
              <br />
              Complete Business Management.

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Stop using multiple disconnected software.
              KoniqTech manages your entire service business
              from the first lead to the final payment.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-3">

            <FeatureCard
              icon="🎯"
              title="Lead Management"
              description="Capture, organize and convert leads from your website, Facebook, Google Ads, referrals and phone calls."
            />

            <FeatureCard
              icon="📅"
              title="Scheduling"
              description="Smart calendar with drag & drop scheduling, technician availability and route optimization."
            />

            <FeatureCard
              icon="🚚"
              title="Dispatch"
              description="Assign technicians instantly and monitor every job in real time."
            />

            <FeatureCard
              icon="📋"
              title="Estimates"
              description="Generate professional quotes with AI assistance and convert them into jobs instantly."
            />

            <FeatureCard
              icon="🧾"
              title="Invoices"
              description="Create invoices, receive online payments and automate reminders."
            />

            <FeatureCard
              icon="📊"
              title="Business Analytics"
              description="Revenue, technician productivity, customer growth and profitability dashboards."
            />

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* WHY KONIQTECH */}
      {/* ====================================================== */}

      <section className="bg-white">

        <div className="mx-auto grid max-w-7xl gap-20 px-6 py-28 lg:grid-cols-2 lg:items-center">

          <div>

            <div className="inline-flex items-center rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">

              Why KoniqTech?

            </div>

            <h2 className="mt-8 text-5xl font-bold leading-tight">

              Built For
              <span className="block text-orange-500">
                Growing Companies
              </span>

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              We designed KoniqTech specifically for
              contractors and field service businesses.
              Every workflow is optimized to reduce manual
              work while increasing revenue.

            </p>

            <div className="mt-12 space-y-7">

              <FeatureRow
                title="Increase Revenue"
                description="Convert more leads into paying customers using automated follow-ups and AI recommendations."
              />

              <FeatureRow
                title="Save Hours Every Day"
                description="Automate repetitive office work including scheduling, reminders, invoicing and reporting."
              />

              <FeatureRow
                title="Keep Customers Happy"
                description="Real-time notifications, technician tracking and professional communication."
              />

              <FeatureRow
                title="Grow Without Hiring"
                description="AI assistants handle repetitive administrative work so your team focuses on customers."
              />

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative">

            <div className="rounded-[36px] bg-gradient-to-br from-orange-500 to-orange-600 p-10 shadow-2xl">

              <div className="rounded-3xl bg-white p-8">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-slate-500">
                      Weekly Performance
                    </p>

                    <h3 className="mt-2 text-4xl font-bold">

                      +42%

                    </h3>

                  </div>

                  <TrendingUp
                    className="text-green-600"
                    size={50}
                  />

                </div>

                <div className="mt-10 space-y-5">

                  <ProgressItem
                    title="Lead Conversion"
                    value="82%"
                    width="82%"
                  />

                  <ProgressItem
                    title="Jobs Completed"
                    value="91%"
                    width="91%"
                  />

                  <ProgressItem
                    title="Customer Satisfaction"
                    value="98%"
                    width="98%"
                  />

                  <ProgressItem
                    title="Technician Productivity"
                    value="87%"
                    width="87%"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* FEATURE GRID */}
      {/* ====================================================== */}

      <section className="bg-slate-900">

        <div className="mx-auto max-w-7xl px-6 py-28">

          <div className="text-center">

            <h2 className="text-5xl font-bold text-white">

              Everything Included

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-300">

              No plugins. No extra software.
              Everything works together from day one.

            </p>

          </div>

          <div className="mt-20 grid gap-7 md:grid-cols-2 xl:grid-cols-4">

            <SmallFeature icon="🤖" title="AI Assistant" />
            <SmallFeature icon="📱" title="Mobile App" />
            <SmallFeature icon="📍" title="GPS Tracking" />
            <SmallFeature icon="🔔" title="Notifications" />
            <SmallFeature icon="📧" title="Email Marketing" />
            <SmallFeature icon="💬" title="SMS Automation" />
            <SmallFeature icon="📦" title="Inventory" />
            <SmallFeature icon="💳" title="Online Payments" />
            <SmallFeature icon="📈" title="Analytics" />
            <SmallFeature icon="🛠" title="Work Orders" />
            <SmallFeature icon="👨‍🔧" title="Technicians" />
            <SmallFeature icon="⚡" title="Automation" />

          </div>

        </div>

      </section>



      {/* ====================================================== */}
      {/* CRM MODULES */}
      {/* ====================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-28">

          <div className="mx-auto max-w-3xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-5 py-2 text-sm font-semibold text-orange-700">

              Complete CRM Platform

            </div>

            <h2 className="mt-8 text-5xl font-bold tracking-tight text-slate-900">

              Every Department.
              <br />
              One Connected Platform.

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Whether you're a small contractor or a growing
              enterprise, KoniqTech connects your sales,
              operations, finance and field teams together.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-3">

            <ModuleCard
              icon="🎯"
              title="Sales CRM"
              color="orange"
              features={[
                "Lead Management",
                "Sales Pipeline",
                "Quote Builder",
                "Email Tracking",
                "Demo Scheduling",
                "Follow-ups"
              ]}
            />

            <ModuleCard
              icon="👥"
              title="Customer CRM"
              color="blue"
              features={[
                "Customer Profiles",
                "Contacts",
                "Service History",
                "Documents",
                "Appointments",
                "Communication Timeline"
              ]}
            />

            <ModuleCard
              icon="📅"
              title="Scheduling"
              color="green"
              features={[
                "Smart Calendar",
                "Recurring Jobs",
                "Availability",
                "Route Planning",
                "Drag & Drop",
                "Team Scheduling"
              ]}
            />

            <ModuleCard
              icon="🚚"
              title="Dispatch Center"
              color="purple"
              features={[
                "Dispatch Board",
                "GPS Tracking",
                "Live Technician Status",
                "Route Optimization",
                "Mobile Updates",
                "Emergency Dispatch"
              ]}
            />

            <ModuleCard
              icon="👷"
              title="Technician App"
              color="orange"
              features={[
                "Job Checklists",
                "Photo Upload",
                "Customer Signature",
                "Offline Mode",
                "Time Tracking",
                "Inventory Usage"
              ]}
            />

            <ModuleCard
              icon="🧾"
              title="Billing"
              color="green"
              features={[
                "Invoices",
                "Online Payments",
                "Taxes",
                "Subscriptions",
                "Receipts",
                "Accounting Export"
              ]}
            />

            <ModuleCard
              icon="📦"
              title="Inventory"
              color="blue"
              features={[
                "Warehouse",
                "Stock Levels",
                "Purchase Orders",
                "Suppliers",
                "Equipment",
                "Barcode Support"
              ]}
            />

            <ModuleCard
              icon="📈"
              title="Reports"
              color="purple"
              features={[
                "Revenue",
                "Lead Analytics",
                "Technician Performance",
                "Profitability",
                "Customer Trends",
                "Dashboards"
              ]}
            />

            <ModuleCard
              icon="⚙️"
              title="Automation"
              color="orange"
              features={[
                "Workflow Builder",
                "Email Automation",
                "SMS Automation",
                "Reminders",
                "Recurring Tasks",
                "Notifications"
              ]}
            />

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* BUSINESS WORKFLOW */}
      {/* ====================================================== */}

      <section className="bg-slate-50">

        <div className="mx-auto max-w-7xl px-6 py-28">

          <div className="text-center">

            <h2 className="text-5xl font-bold">

              From Lead To Payment

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              KoniqTech automates every step of your customer
              journey so your business runs smoothly.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-7">

            <WorkflowStep
              number="01"
              title="Lead"
            />

            <WorkflowArrow />

            <WorkflowStep
              number="02"
              title="Quote"
            />

            <WorkflowArrow />

            <WorkflowStep
              number="03"
              title="Schedule"
            />

            <WorkflowArrow />

            <WorkflowStep
              number="04"
              title="Complete Job"
            />

          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-3">

            <WorkflowInfo
              title="Acquire Customers"
              description="Capture leads from websites, Google Ads, Facebook, referrals and phone calls."
            />

            <WorkflowInfo
              title="Manage Operations"
              description="Schedule jobs, dispatch technicians, communicate with customers and track progress."
            />

            <WorkflowInfo
              title="Get Paid Faster"
              description="Generate invoices, collect payments online and monitor business performance."
            />

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* AI PLATFORM */}
      {/* ====================================================== */}

      <section className="overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

        <div className="mx-auto max-w-7xl px-6 py-28">

          <div className="mx-auto max-w-3xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-5 py-2 text-sm font-semibold text-orange-300">

              🤖 KoniqTech AI

            </div>

            <h2 className="mt-8 text-5xl font-bold leading-tight text-white">

              AI That Actually
              <span className="block text-orange-400">
                Runs Your Business
              </span>

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-300">

              From answering customers to generating
              estimates, scheduling technicians and
              predicting revenue, KoniqTech AI becomes
              another employee on your team.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-3">

            <AiCard
              icon="🤖"
              title="AI Assistant"
              description="Ask questions about customers, jobs, invoices and business performance using natural language."
            />

            <AiCard
              icon="📝"
              title="AI Quote Builder"
              description="Generate professional estimates automatically from customer requests."
            />

            <AiCard
              icon="📞"
              title="Voice AI"
              description="AI answers calls, books appointments and qualifies new leads 24×7."
            />

            <AiCard
              icon="📧"
              title="Email AI"
              description="Write follow-up emails, campaigns and customer responses in seconds."
            />

            <AiCard
              icon="💬"
              title="SMS AI"
              description="Automatically remind customers, confirm appointments and reduce no-shows."
            />

            <AiCard
              icon="🧠"
              title="Knowledge AI"
              description="Search invoices, jobs, documents and customer history instantly."
            />

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* AI AUTOMATION */}
      {/* ====================================================== */}

      <section className="bg-white">

        <div className="mx-auto grid max-w-7xl gap-20 px-6 py-28 lg:grid-cols-2 lg:items-center">

          <div>

            <div className="inline-flex rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-green-700">

              AI Automation

            </div>

            <h2 className="mt-8 text-5xl font-bold">

              Automate
              <span className="block text-orange-500">
                Repetitive Work
              </span>

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Save hours every week by allowing AI to
              perform repetitive office tasks while your
              team focuses on customers.

            </p>

            <div className="mt-12 space-y-6">

              <AutomationItem text="Automatically assign technicians" />
              <AutomationItem text="Generate invoices after job completion" />
              <AutomationItem text="Send appointment reminders" />
              <AutomationItem text="Follow up unpaid invoices" />
              <AutomationItem text="Create recurring maintenance jobs" />
              <AutomationItem text="Notify customers automatically" />
              <AutomationItem text="Generate weekly business reports" />
              <AutomationItem text="AI lead qualification" />

            </div>

          </div>

          <div>

            <div className="rounded-[36px] bg-slate-900 p-10 shadow-2xl">

              <div className="rounded-3xl bg-slate-800 p-8">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl font-bold text-white">

                    Today's AI Activity

                  </h3>

                  <div className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white">

                    Live

                  </div>

                </div>

                <div className="mt-10 space-y-5">

                  <AiActivity
                    task="Generated 24 Quotes"
                    time="2 min ago"
                  />

                  <AiActivity
                    task="Booked 8 Appointments"
                    time="7 min ago"
                  />

                  <AiActivity
                    task="Sent 126 Reminder SMS"
                    time="12 min ago"
                  />

                  <AiActivity
                    task="Followed up 32 Leads"
                    time="20 min ago"
                  />

                  <AiActivity
                    task="Scheduled 18 Jobs"
                    time="35 min ago"
                  />

                  <AiActivity
                    task="Created Revenue Report"
                    time="1 hour ago"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* PREDICTIVE ANALYTICS */}
      {/* ====================================================== */}

      <section className="bg-slate-50">

        <div className="mx-auto max-w-7xl px-6 py-28">

          <div className="text-center">

            <h2 className="text-5xl font-bold">

              Predict The Future
              <span className="block text-orange-500">
                With AI Analytics
              </span>

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              KoniqTech AI doesn't just report data—it
              predicts trends, identifies opportunities,
              and recommends actions before problems occur.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-4">

            <PredictionCard
              title="Revenue Forecast"
              value="+28%"
            />

            <PredictionCard
              title="Lead Conversion"
              value="84%"
            />

            <PredictionCard
              title="Customer Retention"
              value="97%"
            />

            <PredictionCard
              title="Technician Efficiency"
              value="+32%"
            />

          </div>

        </div>

      </section>



      {/* ====================================================== */}
      {/* INDUSTRY SOLUTIONS */}
      {/* ====================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-28">

          <div className="mx-auto max-w-3xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">

              Industry Solutions

            </div>

            <h2 className="mt-8 text-5xl font-bold tracking-tight text-slate-900">

              Built For Every
              <span className="block text-orange-500">
                Field Service Business
              </span>

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Every industry has different workflows.
              KoniqTech adapts to your business with
              specialized tools, automation and AI.

            </p>

          </div>

          <div className="mt-20 space-y-12">

            <IndustryCard
              emoji="🏠"
              color="orange"
              title="Roofing CRM"
              description="Manage inspections, insurance claims, roof measurements, proposals, production schedules and crews from one dashboard."
              modules={[
                "Roof Measurements",
                "Insurance Claims",
                "Production Calendar",
                "Material Tracking",
                "Crew Scheduling",
                "Photo Documentation"
              ]}
              stats={[
                "35% Faster Estimates",
                "28% More Jobs Won",
                "95% Customer Satisfaction"
              ]}
            />

            <IndustryCard
              emoji="❄️"
              color="blue"
              title="HVAC CRM"
              description="Track equipment, preventive maintenance, warranties, service agreements and technician dispatch."
              modules={[
                "Equipment History",
                "Maintenance Plans",
                "Warranty Tracking",
                "Emergency Dispatch",
                "Technician Checklists",
                "Parts Inventory"
              ]}
              stats={[
                "42% Faster Dispatch",
                "31% More Renewals",
                "98% Service Accuracy"
              ]}
            />

            <IndustryCard
              emoji="🔧"
              color="green"
              title="Plumbing CRM"
              description="Schedule emergency calls, manage recurring maintenance, inventory and customer communication."
              modules={[
                "Emergency Jobs",
                "Recurring Service",
                "Pipe Inspections",
                "Inventory Tracking",
                "Invoice Automation",
                "Customer History"
              ]}
              stats={[
                "22% Higher Revenue",
                "38% Faster Response",
                "96% Repeat Customers"
              ]}
            />

            <IndustryCard
              emoji="🌳"
              color="emerald"
              title="Landscaping CRM"
              description="Manage seasonal work, recurring lawn care, irrigation, crews and route optimization."
              modules={[
                "Seasonal Scheduling",
                "Recurring Jobs",
                "Crew Planning",
                "Route Optimization",
                "Property Photos",
                "Maintenance Contracts"
              ]}
              stats={[
                "30% More Jobs",
                "27% Less Travel",
                "94% Customer Retention"
              ]}
            />

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* INDUSTRY COMPARISON */}
      {/* ====================================================== */}

      <section className="bg-slate-50">

        <div className="mx-auto max-w-7xl px-6 py-28">

          <div className="text-center">

            <h2 className="text-5xl font-bold">

              One Platform.
              <span className="block text-orange-500">
                Multiple Industries.
              </span>

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Switch industries or operate multiple business
              units using one powerful CRM.

            </p>

          </div>

          <div className="mt-20 overflow-hidden rounded-3xl border bg-white shadow-sm">

            <table className="w-full">

              <thead className="bg-slate-100">

                <tr>

                  <th className="px-8 py-5 text-left">

                    Feature

                  </th>

                  <th className="px-8 py-5 text-center">

                    Roofing

                  </th>

                  <th className="px-8 py-5 text-center">

                    HVAC

                  </th>

                  <th className="px-8 py-5 text-center">

                    Plumbing

                  </th>

                  <th className="px-8 py-5 text-center">

                    Landscaping

                  </th>

                </tr>

              </thead>

              <tbody>

                <IndustryRow
                  title="Lead Management"
                />

                <IndustryRow
                  title="Scheduling"
                />

                <IndustryRow
                  title="Dispatch"
                />

                <IndustryRow
                  title="AI Estimates"
                />

                <IndustryRow
                  title="Invoices"
                />

                <IndustryRow
                  title="Mobile App"
                />

                <IndustryRow
                  title="Inventory"
                />

                <IndustryRow
                  title="Automation"
                />

              </tbody>

            </table>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* INTEGRATIONS */}
      {/* ====================================================== */}

      <section className="bg-slate-950 overflow-hidden">

        <div className="mx-auto max-w-7xl px-6 py-28">

          <div className="mx-auto max-w-3xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-300">

              🔗 Integrations & Marketplace

            </div>

            <h2 className="mt-8 text-5xl font-bold leading-tight text-white">

              Connect Everything
              <span className="block text-orange-400">
                Your Business Uses
              </span>

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-300">

              KoniqTech integrates with the tools your team
              already relies on while providing APIs,
              webhooks and automation for advanced workflows.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

            <IntegrationCard
              emoji="📧"
              title="Email"
              apps={[
                "Resend",
                "SMTP",
                "Microsoft 365",
                "Google Workspace"
              ]}
            />

            <IntegrationCard
              emoji="💬"
              title="Communication"
              apps={[
                "Twilio",
                "MSG91",
                "WhatsApp",
                "SMS Gateway"
              ]}
            />

            <IntegrationCard
              emoji="💳"
              title="Payments"
              apps={[
                "PayPal",
                "Stripe",
                "Razorpay",
                "Square"
              ]}
            />

            <IntegrationCard
              emoji="☁️"
              title="Cloud Storage"
              apps={[
                "AWS S3",
                "Cloudflare R2",
                "Google Drive",
                "Dropbox"
              ]}
            />

            <IntegrationCard
              emoji="📅"
              title="Calendar"
              apps={[
                "Google Calendar",
                "Microsoft Outlook",
                "Apple Calendar",
                "ICS"
              ]}
            />

            <IntegrationCard
              emoji="📊"
              title="Accounting"
              apps={[
                "QuickBooks",
                "Xero",
                "FreshBooks",
                "Zoho Books"
              ]}
            />

            <IntegrationCard
              emoji="🤖"
              title="Artificial Intelligence"
              apps={[
                "OpenAI",
                "Claude",
                "Gemini",
                "Azure AI"
              ]}
            />

            <IntegrationCard
              emoji="🧩"
              title="Developer"
              apps={[
                "REST API",
                "Webhooks",
                "OAuth",
                "SDK"
              ]}
            />

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* MARKETPLACE */}
      {/* ====================================================== */}

      <section className="bg-white">

        <div className="mx-auto grid max-w-7xl gap-20 px-6 py-28 lg:grid-cols-2 lg:items-center">

          <div>

            <div className="inline-flex rounded-full bg-orange-100 px-5 py-2 text-sm font-semibold text-orange-700">

              Marketplace

            </div>

            <h2 className="mt-8 text-5xl font-bold leading-tight">

              Extend KoniqTech
              <span className="block text-orange-500">
                Without Coding
              </span>

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Enable new capabilities with ready-made
              integrations, templates, AI agents and
              workflow packs built for contractors.

            </p>

            <div className="mt-12 space-y-5">

              <MarketplaceItem text="Industry Workflow Packs" />
              <MarketplaceItem text="Automation Templates" />
              <MarketplaceItem text="Email Templates" />
              <MarketplaceItem text="SMS Templates" />
              <MarketplaceItem text="AI Prompt Library" />
              <MarketplaceItem text="Custom Reports" />
              <MarketplaceItem text="Dashboard Widgets" />
              <MarketplaceItem text="API Connectors" />

            </div>

          </div>

          <div>

            <div className="rounded-[36px] border bg-slate-50 p-10">

              <h3 className="text-3xl font-bold">

                Popular Marketplace Apps

              </h3>

              <div className="mt-10 grid gap-5">

                <MarketplaceCard
                  emoji="🏠"
                  title="Roof Inspection AI"
                  installs="4,800+"
                />

                <MarketplaceCard
                  emoji="📞"
                  title="Voice Booking Agent"
                  installs="3,900+"
                />

                <MarketplaceCard
                  emoji="📧"
                  title="Marketing Automation"
                  installs="6,400+"
                />

                <MarketplaceCard
                  emoji="📍"
                  title="GPS Fleet Tracking"
                  installs="2,700+"
                />

                <MarketplaceCard
                  emoji="📊"
                  title="Executive Dashboard"
                  installs="5,100+"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* OPEN PLATFORM */}
      {/* ====================================================== */}

      <section className="bg-slate-100">

        <div className="mx-auto max-w-7xl px-6 py-28">

          <div className="text-center">

            <h2 className="text-5xl font-bold">

              Built For Developers

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Build custom integrations, automate workflows,
              synchronize data and extend KoniqTech using
              modern APIs and webhooks.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-4">

            <DeveloperCard
              title="REST API"
              value="200+"
              subtitle="Endpoints"
            />

            <DeveloperCard
              title="Webhooks"
              value="40+"
              subtitle="Events"
            />

            <DeveloperCard
              title="OAuth"
              value="100%"
              subtitle="Secure Authentication"
            />

            <DeveloperCard
              title="SDK"
              value="JS"
              subtitle="Developer Friendly"
            />

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* MOBILE APP */}
      {/* ====================================================== */}

      <section className="bg-white">

        <div className="mx-auto grid max-w-7xl gap-20 px-6 py-28 lg:grid-cols-2 lg:items-center">

          <div>

            <div className="inline-flex rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-green-700">

              Mobile Workforce

            </div>

            <h2 className="mt-8 text-5xl font-bold leading-tight">

              Your Office
              <span className="block text-orange-500">

                Fits In Every Pocket

              </span>

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Give technicians everything they need on-site.
              View schedules, navigate to customers,
              upload photos, collect signatures, create
              invoices and receive payments—all from one app.

            </p>

            <div className="mt-12 grid gap-5">

              <MobileFeature text="Today's Schedule" />
              <MobileFeature text="GPS Navigation" />
              <MobileFeature text="Customer History" />
              <MobileFeature text="Photo & Video Upload" />
              <MobileFeature text="Digital Signatures" />
              <MobileFeature text="Offline Mode" />
              <MobileFeature text="Instant Invoice Creation" />
              <MobileFeature text="Payment Collection" />

            </div>

          </div>

          <div>

            <div className="mx-auto max-w-sm rounded-[42px] border-[12px] border-slate-900 bg-white shadow-2xl">

              <div className="rounded-[30px] bg-slate-100 p-6">

                <div className="rounded-2xl bg-orange-500 p-5 text-white">

                  <p className="text-sm opacity-90">

                    Today's Jobs

                  </p>

                  <h3 className="mt-2 text-3xl font-bold">

                    6 Assigned

                  </h3>

                </div>

                <div className="mt-6 space-y-4">

                  <MobileJob
                    customer="Johnson Roofing"
                    status="In Progress"
                  />

                  <MobileJob
                    customer="Smith HVAC"
                    status="Scheduled"
                  />

                  <MobileJob
                    customer="Green Plumbing"
                    status="Completed"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* SECURITY */}
      {/* ====================================================== */}

      <section className="bg-slate-950">

        <div className="mx-auto max-w-7xl px-6 py-28">

          <div className="text-center">

            <div className="inline-flex rounded-full border border-green-500/30 bg-green-500/10 px-5 py-2 text-sm font-semibold text-green-300">

              Enterprise Security

            </div>

            <h2 className="mt-8 text-5xl font-bold text-white">

              Security You Can Trust

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-300">

              Customer information, payments and business
              data are protected using enterprise-grade
              security standards and best practices.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

            <SecurityCard
              emoji="🔒"
              title="Encrypted Data"
              description="Data encrypted in transit and at rest."
            />

            <SecurityCard
              emoji="🛡️"
              title="Role Permissions"
              description="Granular access for every employee."
            />

            <SecurityCard
              emoji="📋"
              title="Audit Logs"
              description="Track every important action."
            />

            <SecurityCard
              emoji="☁️"
              title="Cloud Backup"
              description="Automatic secure backups."
            />

            <SecurityCard
              emoji="🔑"
              title="Secure Login"
              description="Password hashing and secure sessions."
            />

            <SecurityCard
              emoji="🌎"
              title="Multi-Tenant"
              description="Each company is fully isolated."
            />

            <SecurityCard
              emoji="⚡"
              title="99.9% Uptime"
              description="Reliable cloud infrastructure."
            />

            <SecurityCard
              emoji="📊"
              title="Monitoring"
              description="Real-time health monitoring."
            />

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* ENTERPRISE */}
      {/* ====================================================== */}

      <section className="bg-slate-50">

        <div className="mx-auto max-w-7xl px-6 py-28">

          <div className="text-center">

            <h2 className="text-5xl font-bold">

              Built To Scale

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Whether you manage one technician or hundreds
              across multiple locations, KoniqTech grows
              with your business.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-4">

            <EnterpriseCard
              number="1+"
              title="Business"
            />

            <EnterpriseCard
              number="100+"
              title="Employees"
            />

            <EnterpriseCard
              number="Unlimited"
              title="Customers"
            />

            <EnterpriseCard
              number="Millions"
              title="Jobs"
            />

          </div>

          <div className="mt-16 rounded-[36px] bg-white p-10 shadow-sm">

            <div className="grid gap-8 lg:grid-cols-3">

              <EnterpriseFeature
                title="Multi-Location"
                description="Manage multiple branches and warehouses from one dashboard."
              />

              <EnterpriseFeature
                title="Advanced Permissions"
                description="Control access for Owners, Managers, Sales, Dispatchers and Technicians."
              />

              <EnterpriseFeature
                title="Real-Time Insights"
                description="Monitor every job, technician and customer instantly."
              />

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* PRICING */}
      {/* ====================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-28">

          <div className="mx-auto max-w-3xl text-center">

            <div className="inline-flex items-center rounded-full bg-orange-100 px-5 py-2 text-sm font-semibold text-orange-700">

              Simple Pricing

            </div>

            <h2 className="mt-8 text-5xl font-bold">

              Choose Your
              <span className="block text-orange-500">

                Growth Plan

              </span>

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              No hidden fees.
              No setup charges.
              Cancel anytime.

            </p>

          </div>

          <div className="mt-20 grid gap-10 lg:grid-cols-3">

            <PricingCard
              title="Starter"
              price="$99"
              description="Perfect for small service businesses."
              button="Start Free Trial"
              color="gray"
              features={[
                "1 Business",
                "Up to 5 Employees",
                "Unlimited Customers",
                "Unlimited Leads",
                "Scheduling",
                "Dispatch",
                "Invoices",
                "Email Support"
              ]}
            />

            <PricingCard
              title="Professional"
              price="$199"
              description="Our most popular plan."
              popular
              button="Start Free Trial"
              color="orange"
              features={[
                "Everything in Starter",
                "Unlimited Employees",
                "AI Assistant",
                "Email Automation",
                "SMS Automation",
                "Inventory",
                "Reports",
                "Priority Support"
              ]}
            />

            <PricingCard
              title="Enterprise"
              price="Custom"
              description="For large organizations."
              button="Contact Sales"
              color="blue"
              features={[
                "Everything in Professional",
                "Multiple Locations",
                "Custom Integrations",
                "Dedicated Success Manager",
                "Advanced Security",
                "API Access",
                "Custom Onboarding",
                "SLA Support"
              ]}
            />

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* FEATURE COMPARISON */}
      {/* ====================================================== */}

      <section className="bg-slate-50">

        <div className="mx-auto max-w-7xl px-6 pb-28">

          <div className="overflow-hidden rounded-[36px] border bg-white shadow-sm">

            <div className="border-b bg-slate-100 px-10 py-6">

              <h3 className="text-3xl font-bold">

                Compare Plans

              </h3>

            </div>

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="px-8 py-5 text-left">

                    Feature

                  </th>

                  <th className="text-center">

                    Starter

                  </th>

                  <th className="text-center">

                    Professional

                  </th>

                  <th className="text-center">

                    Enterprise

                  </th>

                </tr>

              </thead>

              <tbody>

                <PricingRow title="Unlimited Customers" />

                <PricingRow title="Unlimited Leads" />

                <PricingRow title="Scheduling" />

                <PricingRow title="Dispatch" />

                <PricingRow title="Invoices" />

                <PricingRow title="AI Assistant" pro enterprise />

                <PricingRow title="SMS Automation" pro enterprise />

                <PricingRow title="Inventory" pro enterprise />

                <PricingRow title="Reports" pro enterprise />

                <PricingRow title="API Access" enterprise />

                <PricingRow title="Multiple Locations" enterprise />

                <PricingRow title="Dedicated Support" enterprise />

              </tbody>

            </table>

          </div>

        </div>

      </section>




      {/* ====================================================== */}
      {/* TESTIMONIALS */}
      {/* ====================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-28">

          <div className="mx-auto max-w-3xl text-center">

            <div className="inline-flex rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-green-700">

              Customer Success

            </div>

            <h2 className="mt-8 text-5xl font-bold">

              Trusted By
              <span className="block text-orange-500">

                Growing Service Businesses

              </span>

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Replace these sample testimonials with real
              customer stories as your business grows.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-3">

            <TestimonialCard
              name="Customer Name"
              company="Roofing Company"
              rating={5}
              text="KoniqTech completely changed how we manage our business. Scheduling, dispatch and invoicing now happen from one platform."
            />

            <TestimonialCard
              name="Customer Name"
              company="HVAC Contractor"
              rating={5}
              text="The AI assistant saves our office several hours every day by generating estimates and following up with customers."
            />

            <TestimonialCard
              name="Customer Name"
              company="Plumbing Business"
              rating={5}
              text="Our technicians love the mobile app and our office finally has real-time visibility into every job."
            />

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* SUCCESS METRICS */}
      {/* ====================================================== */}

      <section className="bg-slate-50">

        <div className="mx-auto max-w-7xl px-6 py-28">

          <div className="text-center">

            <h2 className="text-5xl font-bold">

              Results That Matter

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Typical improvements businesses achieve
              after implementing an integrated CRM.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-4">

            <MetricCard
              value="+35%"
              label="Lead Conversion"
            />

            <MetricCard
              value="-40%"
              label="Admin Time"
            />

            <MetricCard
              value="+28%"
              label="Revenue Growth"
            />

            <MetricCard
              value="98%"
              label="Customer Satisfaction"
            />

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* CASE STUDIES */}
      {/* ====================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-28">

          <div className="text-center">

            <h2 className="text-5xl font-bold">

              Success Stories

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Publish real customer stories here as your
              customer base grows.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-2">

            <CaseStudyCard
              title="Roofing Company"
              result="+41% Revenue Growth"
              description="Demonstrate how a roofing company increased estimates, reduced manual work and improved technician productivity."
            />

            <CaseStudyCard
              title="HVAC Contractor"
              result="32% Faster Dispatch"
              description="Explain how AI scheduling and dispatch reduced travel time and improved customer satisfaction."
            />

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* CUSTOMER LOGOS */}
      {/* ====================================================== */}

      <section className="bg-slate-900">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="text-center">

            <h2 className="text-4xl font-bold text-white">

              Your Customers Could Be Here

            </h2>

            <p className="mt-6 text-lg text-slate-400">

              Replace these placeholders with customer
              logos after onboarding clients.

            </p>

          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3 xl:grid-cols-6">

            {[
              "Company Logo",
              "Company Logo",
              "Company Logo",
              "Company Logo",
              "Company Logo",
              "Company Logo",
            ].map((logo) => (

              <div
                key={logo}
                className="flex h-24 items-center justify-center rounded-3xl border border-slate-700 bg-slate-800 text-slate-400"
              >

                {logo}

              </div>

            ))}

          </div>

        </div>

      </section>



      {/* ====================================================== */}
      {/* FAQ */}
      {/* ====================================================== */}

      <section className="bg-slate-50">

        <div className="mx-auto max-w-5xl px-6 py-28">

          <div className="text-center">

            <div className="inline-flex rounded-full bg-orange-100 px-5 py-2 text-sm font-semibold text-orange-700">
              Frequently Asked Questions
            </div>

            <h2 className="mt-8 text-5xl font-bold">

              Questions?
              <span className="block text-orange-500">
                We've Got Answers.
              </span>

            </h2>

          </div>

          <div className="mt-20 space-y-6">

            <FaqItem
              question="Can I try KoniqTech before purchasing?"
              answer="Yes. Start with a free trial and explore every feature before subscribing."
            />

            <FaqItem
              question="Is KoniqTech suitable for small businesses?"
              answer="Absolutely. Whether you have one technician or hundreds, KoniqTech scales with your business."
            />

            <FaqItem
              question="Do you support Roofing, HVAC, Plumbing and Landscaping?"
              answer="Yes. Every industry has dedicated workflows, AI tools and automation."
            />

            <FaqItem
              question="Can I import my existing customer data?"
              answer="Yes. CSV imports and migration assistance are available."
            />

            <FaqItem
              question="Does KoniqTech have a mobile app?"
              answer="Yes. Technicians can manage jobs, upload photos, collect signatures and invoices directly from mobile devices."
            />

            <FaqItem
              question="Can I cancel anytime?"
              answer="Yes. There are no long-term contracts."
            />

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* FINAL CTA */}
      {/* ====================================================== */}

      <section className="bg-gradient-to-r from-orange-500 to-orange-600">

        <div className="mx-auto max-w-7xl px-6 py-24 text-center text-white">

          <h2 className="text-6xl font-bold leading-tight">

            Ready To Grow
            <br />
            Your Business?

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-orange-100">

            Join contractors using KoniqTech to manage
            leads, jobs, dispatch, AI automation,
            invoicing and customer communication from
            one modern platform.

          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-6">

            <Link
              href="/register"
              className="inline-flex h-14 items-center rounded-2xl bg-white px-8 font-semibold text-orange-600 transition hover:bg-orange-100"
            >
              Start Free Trial
            </Link>

            <Link
              href="/demo"
              className="inline-flex h-14 items-center rounded-2xl border border-white/40 px-8 font-semibold text-white transition hover:bg-white/10"
            >
              Book Demo
            </Link>

          </div>

          <p className="mt-10 text-orange-100">

            ✓ Free Trial &nbsp;&nbsp;
            ✓ No Setup Fee &nbsp;&nbsp;
            ✓ Cancel Anytime

          </p>

        </div>

      </section>

      {/* ====================================================== */}
      {/* FOOTER */}
      {/* ====================================================== */}

      <footer className="bg-slate-950 text-slate-300">

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="grid gap-12 lg:grid-cols-5">

            <div className="lg:col-span-2">

              <div className="flex items-center gap-3">

                <img
                  src="/logo.png"
                  alt="KoniqTech"
                  className="h-12 w-12"
                />

                <div>

                  <h3 className="text-2xl font-bold text-white">

                    KoniqTech

                  </h3>

                  <p className="text-sm text-slate-400">

                    AI Field Service CRM

                  </p>

                </div>

              </div>

              <p className="mt-8 max-w-md leading-8">

                Modern CRM for Roofing, HVAC, Plumbing,
                Landscaping and Field Service companies.
                Manage your entire business from one
                powerful AI platform.

              </p>

            </div>

            <FooterColumn
              title="Product"
              links={[
                ["Features","/features"],
                ["Pricing","/pricing"],
                ["Industries","/industries"],
                ["AI Platform","/ai"],
                ["Integrations","/integrations"],
              ]}
            />

            <FooterColumn
              title="Company"
              links={[
                ["About","/about"],
                ["Blog","/blog"],
                ["Contact","/contact"],
                ["Careers","/careers"],
                ["Demo","/demo"],
              ]}
            />

            <FooterColumn
              title="Resources"
              links={[
                ["Documentation","/docs"],
                ["API","/developers"],
                ["Privacy","/privacy"],
                ["Terms","/terms"],
                ["Security","/security"],
              ]}
            />

          </div>

          <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-slate-800 pt-8 md:flex-row">

            <p className="text-sm text-slate-500">

              © {new Date().getFullYear()} KoniqTech.
              All rights reserved.

            </p>

            <div className="flex gap-6 text-sm">

              <Link href="/privacy">
                Privacy
              </Link>

              <Link href="/terms">
                Terms
              </Link>

              <Link href="/cookies">
                Cookies
              </Link>

              <Link href="/security">
                Security
              </Link>

            </div>

          </div>

        </div>

      </footer>

 </main>
  )
}
   




function Feature({
  text,
}: {
  text: string
}) {
  return (
    <div className="flex items-center gap-3">

      <CheckCircle2
        size={18}
        className="text-green-600"
      />

      <span className="font-medium text-slate-700">

        {text}

      </span>

    </div>
  )
}

function DashboardCard({
  title,
  value,
  color,
}: {
  title: string
  value: string
  color: "blue" | "orange" | "green" | "purple"
}) {

  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    orange: "bg-orange-100 text-orange-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
  }

  return (

    <div className="flex items-center justify-between rounded-2xl border p-5">

      <div>

        <p className="text-sm text-slate-500">

          {title}

        </p>

        <h4 className="mt-2 text-3xl font-bold">

          {value}

        </h4>

      </div>

      <div
        className={`
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          ${colorClasses[color]}
        `}
      >

        <Star size={24} />

      </div>

    </div>

  )
}



function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

      <div className="text-5xl">
        {icon}
      </div>

      <h3 className="mt-8 text-2xl font-bold">
        {title}
      </h3>

      <p className="mt-5 leading-8 text-slate-600">
        {description}
      </p>

    </div>
  )
}

function FeatureRow({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex gap-5">

      <CheckCircle2
        className="mt-1 text-green-600"
        size={24}
      />

      <div>

        <h3 className="text-xl font-bold">
          {title}
        </h3>

        <p className="mt-2 leading-8 text-slate-600">
          {description}
        </p>

      </div>

    </div>
  )
}

function ProgressItem({
  title,
  value,
  width,
}: {
  title: string
  value: string
  width: string
}) {
  return (
    <div>

      <div className="mb-2 flex justify-between">

        <span>{title}</span>

        <span className="font-bold">
          {value}
        </span>

      </div>

      <div className="h-3 rounded-full bg-slate-200">

        <div
          className="h-3 rounded-full bg-orange-500"
          style={{ width }}
        />

      </div>

    </div>
  )
}

function SmallFeature({
  icon,
  title,
}: {
  icon: string
  title: string
}) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-800 p-7 text-center transition hover:border-orange-400">

      <div className="text-4xl">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-white">
        {title}
      </h3>

    </div>
  )
}



function ModuleCard({
  icon,
  title,
  color,
  features,
}: {
  icon: string
  title: string
  color: "orange" | "green" | "blue" | "purple"
  features: string[]
}) {

  const colors = {
    orange: "bg-orange-100 text-orange-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
  }

  return (

    <div className="rounded-3xl border bg-white p-8 transition hover:-translate-y-2 hover:shadow-xl">

      <div
        className={`
        flex
        h-16
        w-16
        items-center
        justify-center
        rounded-2xl
        text-3xl
        ${colors[color]}
        `}
      >
        {icon}
      </div>

      <h3 className="mt-8 text-2xl font-bold">
        {title}
      </h3>

      <ul className="mt-8 space-y-4">

        {features.map((item) => (

          <li
            key={item}
            className="flex items-center gap-3"
          >

            <CheckCircle2
              size={18}
              className="text-green-600"
            />

            <span>{item}</span>

          </li>

        ))}

      </ul>

    </div>

  )

}

function WorkflowStep({
  number,
  title,
}: {
  number: string
  title: string
}) {

  return (

    <div className="rounded-3xl bg-white p-8 text-center shadow-sm">

      <div className="text-5xl font-bold text-orange-500">

        {number}

      </div>

      <h3 className="mt-6 text-xl font-bold">

        {title}

      </h3>

    </div>

  )

}

function WorkflowArrow() {

  return (

    <div className="hidden items-center justify-center lg:flex">

      <ArrowRight
        size={40}
        className="text-orange-500"
      />

    </div>

  )

}

function WorkflowInfo({
  title,
  description,
}: {
  title: string
  description: string
}) {

  return (

    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <h3 className="text-2xl font-bold">

        {title}

      </h3>

      <p className="mt-5 leading-8 text-slate-600">

        {description}

      </p>

    </div>

  )

}



function AiCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-800 p-8 transition hover:border-orange-400 hover:-translate-y-2">

      <div className="text-5xl">
        {icon}
      </div>

      <h3 className="mt-8 text-2xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-5 leading-8 text-slate-300">
        {description}
      </p>

    </div>
  )
}

function AutomationItem({
  text,
}: {
  text: string
}) {
  return (
    <div className="flex items-center gap-4">

      <CheckCircle2
        size={22}
        className="text-green-600"
      />

      <span className="text-lg">
        {text}
      </span>

    </div>
  )
}

function AiActivity({
  task,
  time,
}: {
  task: string
  time: string
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-700 p-5">

      <div>

        <h4 className="font-semibold text-white">
          {task}
        </h4>

        <p className="mt-1 text-sm text-slate-400">
          {time}
        </p>

      </div>

      <div className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
        Done
      </div>

    </div>
  )
}

function PredictionCard({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

      <div className="text-5xl font-bold text-orange-500">
        {value}
      </div>

      <p className="mt-5 text-lg font-semibold text-slate-700">
        {title}
      </p>

    </div>
  )
}

function IndustryCard({
  emoji,
  title,
  description,
  modules,
  stats,
  color,
}: {
  emoji: string
  title: string
  description: string
  modules: string[]
  stats: string[]
  color: "orange" | "blue" | "green" | "emerald"
}) {

  const colors = {
    orange: "bg-orange-100 text-orange-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    emerald: "bg-emerald-100 text-emerald-700",
  }

  return (

    <div className="grid gap-10 rounded-[36px] border bg-white p-10 shadow-sm lg:grid-cols-2">

      <div>

        <div
          className={`inline-flex h-20 w-20 items-center justify-center rounded-3xl text-5xl ${colors[color]}`}
        >
          {emoji}
        </div>

        <h3 className="mt-8 text-4xl font-bold">

          {title}

        </h3>

        <p className="mt-6 text-lg leading-9 text-slate-600">

          {description}

        </p>

        <div className="mt-10 grid gap-4">

          {stats.map((item) => (

            <div
              key={item}
              className="flex items-center gap-3"
            >

              <TrendingUp
                size={18}
                className="text-green-600"
              />

              <span className="font-semibold">

                {item}

              </span>

            </div>

          ))}

        </div>

      </div>

      <div>

        <div className="rounded-3xl bg-slate-50 p-8">

          <h4 className="text-2xl font-bold">

            Included Modules

          </h4>

          <div className="mt-8 grid gap-5">

            {modules.map((module) => (

              <div
                key={module}
                className="flex items-center gap-3"
              >

                <CheckCircle2
                  size={20}
                  className="text-green-600"
                />

                <span>

                  {module}

                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  )

}

function IndustryRow({
  title,
}: {
  title: string
}) {

  return (

    <tr className="border-t">

      <td className="px-8 py-5 font-semibold">

        {title}

      </td>

      <td className="text-center text-green-600">

        ✓

      </td>

      <td className="text-center text-green-600">

        ✓

      </td>

      <td className="text-center text-green-600">

        ✓

      </td>

      <td className="text-center text-green-600">

        ✓

      </td>

    </tr>

  )

}


function IntegrationCard({
  emoji,
  title,
  apps,
}: {
  emoji: string
  title: string
  apps: string[]
}) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8 transition hover:border-orange-400">

      <div className="text-5xl">
        {emoji}
      </div>

      <h3 className="mt-8 text-2xl font-bold text-white">
        {title}
      </h3>

      <div className="mt-8 space-y-4">
        {apps.map((app) => (
          <div
            key={app}
            className="flex items-center gap-3"
          >
            <CheckCircle2
              size={18}
              className="text-green-400"
            />
            <span className="text-slate-300">
              {app}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}

function MarketplaceItem({
  text,
}: {
  text: string
}) {
  return (
    <div className="flex items-center gap-3">

      <CheckCircle2
        size={20}
        className="text-green-600"
      />

      <span className="text-lg">
        {text}
      </span>

    </div>
  )
}

function MarketplaceCard({
  emoji,
  title,
  installs,
}: {
  emoji: string
  title: string
  installs: string
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="text-4xl">
          {emoji}
        </div>

        <div>

          <h4 className="font-bold">
            {title}
          </h4>

          <p className="text-sm text-slate-500">
            {installs} installs
          </p>

        </div>

      </div>

      <button className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">

        Install

      </button>

    </div>
  )
}

function DeveloperCard({
  title,
  value,
  subtitle,
}: {
  title: string
  value: string
  subtitle: string
}) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

      <div className="text-5xl font-bold text-orange-500">

        {value}

      </div>

      <h3 className="mt-5 text-2xl font-bold">

        {title}

      </h3>

      <p className="mt-2 text-slate-500">

        {subtitle}

      </p>

    </div>
  )
}

function MobileFeature({
  text,
}: {
  text: string
}) {
  return (
    <div className="flex items-center gap-3">

      <CheckCircle2
        size={20}
        className="text-green-600"
      />

      <span className="text-lg">
        {text}
      </span>

    </div>
  )
}

function MobileJob({
  customer,
  status,
}: {
  customer: string
  status: string
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">

      <h4 className="font-semibold">

        {customer}

      </h4>

      <p className="mt-2 text-sm text-slate-500">

        {status}

      </p>

    </div>
  )
}

function SecurityCard({
  emoji,
  title,
  description,
}: {
  emoji: string
  title: string
  description: string
}) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8 text-center transition hover:border-orange-400">

      <div className="text-5xl">

        {emoji}

      </div>

      <h3 className="mt-6 text-2xl font-bold text-white">

        {title}

      </h3>

      <p className="mt-4 leading-7 text-slate-300">

        {description}

      </p>

    </div>
  )
}

function EnterpriseCard({
  number,
  title,
}: {
  number: string
  title: string
}) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

      <div className="text-5xl font-bold text-orange-500">

        {number}

      </div>

      <h3 className="mt-5 text-xl font-bold">

        {title}

      </h3>

    </div>
  )
}

function EnterpriseFeature({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div>

      <h3 className="text-2xl font-bold">

        {title}

      </h3>

      <p className="mt-5 leading-8 text-slate-600">

        {description}

      </p>

    </div>
  )
}


function PricingCard({
  title,
  price,
  description,
  button,
  features,
  color,
  popular = false,
}: {
  title: string
  price: string
  description: string
  button: string
  features: string[]
  color: "gray" | "orange" | "blue"
  popular?: boolean
}) {

  const buttonColors = {
    gray: "bg-slate-900 hover:bg-black",
    orange: "bg-orange-500 hover:bg-orange-600",
    blue: "bg-blue-600 hover:bg-blue-700",
  }

  return (

    <div
      className={`
      relative
      rounded-[36px]
      border
      bg-white
      p-10
      shadow-sm
      transition
      hover:-translate-y-2
      hover:shadow-xl
      ${
        popular
          ? "border-orange-500 ring-2 ring-orange-200"
          : ""
      }
      `}
    >

      {popular && (

        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white">

          MOST POPULAR

        </div>

      )}

      <h3 className="text-3xl font-bold">

        {title}

      </h3>

      <div className="mt-8 flex items-end gap-2">

        <span className="text-6xl font-bold">

          {price}

        </span>

        {price !== "Custom" && (

          <span className="mb-2 text-slate-500">

            /month

          </span>

        )}

      </div>

      <p className="mt-6 leading-8 text-slate-600">

        {description}

      </p>

      <button
        className={`
        mt-10
        w-full
        rounded-2xl
        py-4
        font-semibold
        text-white
        transition
        ${buttonColors[color]}
        `}
      >

        {button}

      </button>

      <div className="mt-10 space-y-5">

        {features.map((item) => (

          <div
            key={item}
            className="flex items-center gap-3"
          >

            <CheckCircle2
              size={20}
              className="text-green-600"
            />

            <span>

              {item}

            </span>

          </div>

        ))}

      </div>

    </div>

  )

}

function PricingRow({
  title,
  pro = false,
  enterprise = false,
}: {
  title: string
  pro?: boolean
  enterprise?: boolean
}) {

  const check = (
    <CheckCircle2
      className="mx-auto text-green-600"
      size={20}
    />
  )

  const cross = (
    <span className="text-slate-300">—</span>
  )

  return (

    <tr className="border-t">

      <td className="px-8 py-5 font-medium">

        {title}

      </td>

      <td className="text-center">

        {!pro && !enterprise ? check : cross}

      </td>

      <td className="text-center">

        {enterprise ? cross : check}

      </td>

      <td className="text-center">

        {check}

      </td>

    </tr>

  )

}


function TestimonialCard({
  name,
  company,
  rating,
  text,
}: {
  name: string
  company: string
  rating: number
  text: string
}) {
  return (
    <div className="rounded-[36px] bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

      <div className="flex gap-1">

        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            size={20}
            className="fill-yellow-400 text-yellow-400"
          />
        ))}

      </div>

      <p className="mt-8 leading-8 text-slate-600">

        "{text}"

      </p>

      <div className="mt-10">

        <h4 className="font-bold">

          {name}

        </h4>

        <p className="text-slate-500">

          {company}

        </p>

      </div>

    </div>
  )
}

function MetricCard({
  value,
  label,
}: {
  value: string
  label: string
}) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-sm">

      <div className="text-5xl font-bold text-orange-500">

        {value}

      </div>

      <p className="mt-5 text-lg font-semibold">

        {label}

      </p>

    </div>
  )
}

function CaseStudyCard({
  title,
  result,
  description,
}: {
  title: string
  result: string
  description: string
}) {
  return (
    <div className="rounded-[36px] border bg-slate-50 p-10">

      <div className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

        {result}

      </div>

      <h3 className="mt-8 text-3xl font-bold">

        {title}

      </h3>

      <p className="mt-6 leading-8 text-slate-600">

        {description}

      </p>

      <button className="mt-8 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600">

        Read Case Study

      </button>

    </div>
  )
}


function FaqItem({
  question,
  answer,
}:{
  question:string
  answer:string
}){

  return(

    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <h3 className="text-xl font-bold">

        {question}

      </h3>

      <p className="mt-4 leading-8 text-slate-600">

        {answer}

      </p>

    </div>

  )

}

function FooterColumn({
  title,
  links,
}:{
  title:string
  links:[string,string][]
}){

  return(

    <div>

      <h3 className="text-xl font-semibold text-white">

        {title}

      </h3>

      <div className="mt-6 space-y-4">

        {links.map(([label,href])=>(

          <Link
            key={href}
            href={href}
            className="block transition hover:text-orange-400"
          >

            {label}

          </Link>

        ))}

      </div>

    </div>

  )

}



