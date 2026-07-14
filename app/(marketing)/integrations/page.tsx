import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  CreditCard,
  Bot,
  Database,
  Cloud,
  Smartphone,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Zap,
  Workflow,
  Globe,
  Bell,
} from "lucide-react"

export default function IntegrationsPage() {
  const categories = [
    {
      title: "Communication",
      icon: MessageSquare,
      color: "text-blue-600",
      integrations: [
        "Twilio SMS",
        "Resend Email",
        "Email Notifications",
        "Customer Messaging",
        "Team Chat",
        "Call Logging",
      ],
    },
    {
      title: "Payments",
      icon: CreditCard,
      color: "text-green-600",
      integrations: [
        "PayPal",
        "Invoice Payments",
        "Recurring Billing",
        "Subscription Management",
        "Payment Tracking",
        "Refund History",
      ],
    },
    {
      title: "AI & Automation",
      icon: Bot,
      color: "text-purple-600",
      integrations: [
        "OpenAI",
        "AI Quote Generation",
        "Voice Assistant",
        "AI Email Writer",
        "Job Summaries",
        "Automation Workflows",
      ],
    },
    {
      title: "Cloud Storage",
      icon: Cloud,
      color: "text-cyan-600",
      integrations: [
        "Cloudflare R2",
        "AWS S3 Compatible",
        "Photo Storage",
        "Document Uploads",
        "Invoice PDFs",
        "Backup Storage",
      ],
    },
    {
      title: "Scheduling",
      icon: Calendar,
      color: "text-orange-600",
      integrations: [
        "Google Calendar",
        "Job Scheduling",
        "Dispatch Calendar",
        "Reminder Emails",
        "Technician Schedule",
        "Demo Booking",
      ],
    },
    {
      title: "API & Developers",
      icon: Database,
      color: "text-red-600",
      integrations: [
        "REST API",
        "Webhook Support",
        "Secure API Keys",
        "JSON Responses",
        "Developer SDK",
        "Future Marketplace",
      ],
    },
  ]

  const features = [
    {
      title: "Real-Time Sync",
      icon: Zap,
      description:
        "Keep customers, invoices, jobs, and communications synchronized across every connected service.",
    },
    {
      title: "Enterprise Security",
      icon: ShieldCheck,
      description:
        "Encrypted connections, secure authentication, tenant isolation, and detailed audit logs.",
    },
    {
      title: "Workflow Automation",
      icon: Workflow,
      description:
        "Automatically trigger emails, SMS, AI actions, reminders, invoice creation, and customer updates.",
    },
    {
      title: "Global Availability",
      icon: Globe,
      description:
        "Reliable integrations designed for businesses operating across multiple regions.",
    },
  ]

  return (
    <main className="bg-white">

      {/* Hero */}

      <section className="border-b bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="mx-auto max-w-3xl text-center">

            <div className="mb-6 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              40+ Business Integrations
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
              Connect Every Tool Your Business Uses
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              KoniqTech CRM integrates with your communication platforms,
              payment systems, AI services, cloud storage, calendars, and
              business workflows—eliminating manual work and keeping your
              operations connected.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">

              <Link
                href="/pricing"
                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                View Pricing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="rounded-lg border px-6 py-3 font-semibold hover:bg-slate-50"
              >
                Schedule Demo
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* Categories */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="text-center">

          <h2 className="text-4xl font-bold">
            Integration Categories
          </h2>

          <p className="mt-4 text-slate-600">
            Everything you need to operate your service business from one
            platform.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {categories.map((category) => {
            const Icon = category.icon

            return (
              <div
                key={category.title}
                className="rounded-2xl border bg-white p-8 shadow-sm"
              >
                <Icon className={`mb-5 h-10 w-10 ${category.color}`} />

                <h3 className="text-2xl font-bold">
                  {category.title}
                </h3>

                <ul className="mt-6 space-y-3">

                  {category.integrations.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span>{item}</span>
                    </li>
                  ))}

                </ul>

              </div>
            )
          })}

        </div>

      </section>

      {/* Platform Features */}

      <section className="bg-slate-50 py-24">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <h2 className="text-4xl font-bold">
              Built for Modern Automation
            </h2>

            <p className="mt-4 text-slate-600">
              Save hours every week by letting your connected systems work
              together automatically.
            </p>

          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">

            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl bg-white p-8 shadow-sm"
                >
                  <Icon className="mb-5 h-10 w-10 text-blue-600" />

                  <h3 className="text-2xl font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-slate-600 leading-7">
                    {feature.description}
                  </p>

                </div>
              )
            })}

          </div>

        </div>

      </section>

      {/* Supported Services */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="text-center">

          <h2 className="text-4xl font-bold">
            Popular Integrations
          </h2>

        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">

          {[
            {
              icon: Mail,
              title: "Email Platform",
              text: "Automated customer emails, invoices, reminders, estimates, and follow-ups.",
            },
            {
              icon: Phone,
              title: "SMS & Calls",
              text: "Appointment reminders, technician arrival alerts, and customer messaging.",
            },
            {
              icon: Smartphone,
              title: "Mobile Workforce",
              text: "Real-time technician updates, GPS tracking, and instant notifications.",
            },
            {
              icon: Bell,
              title: "Notifications",
              text: "Receive alerts for payments, jobs, dispatches, and customer activity.",
            },
            {
              icon: Bot,
              title: "AI Assistant",
              text: "Generate estimates, customer replies, summaries, and job notes instantly.",
            },
            {
              icon: Database,
              title: "Open API",
              text: "Connect internal tools, reporting systems, and third-party applications.",
            },
          ].map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.title}
                className="rounded-2xl border p-8"
              >
                <Icon className="mb-4 h-10 w-10 text-blue-600" />

                <h3 className="text-xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-4 text-slate-600 leading-7">
                  {item.text}
                </p>

              </div>
            )
          })}

        </div>

      </section>

      {/* CTA */}

      <section className="bg-blue-600 py-24 text-white">

        <div className="mx-auto max-w-4xl px-6 text-center">

          <h2 className="text-4xl font-bold">
            Connect Your Entire Business
          </h2>

          <p className="mt-6 text-lg text-blue-100">
            From customer communication to AI automation, KoniqTech keeps
            every system working together so your team can focus on delivering
            exceptional service.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <Link
              href="/contact"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-700"
            >
              Book a Demo
            </Link>

            <Link
              href="/pricing"
              className="rounded-lg border border-white px-6 py-3 font-semibold hover:bg-white hover:text-blue-700"
            >
              Explore Plans
            </Link>

          </div>

        </div>

      </section>

    </main>
  )
}