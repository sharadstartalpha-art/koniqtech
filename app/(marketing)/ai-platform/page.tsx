import type { Metadata } from "next"
import Link from "next/link"

import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Bot,
  BrainCircuit,
  MessageSquare,
  Mic,
  FileText,
  BarChart3,
  Cpu,
  ShieldCheck
} from "lucide-react"

export const metadata: Metadata = {
  title: "AI CRM Platform | KoniqTech",
  description:
    "KoniqTech AI helps service businesses automate quotes, emails, dispatch, customer communication, reporting, scheduling and business operations using powerful AI built directly into your CRM."
}

const stats = [
  {
    value: "80%",
    label: "Less Manual Work"
  },
  {
    value: "3X",
    label: "Faster Quote Creation"
  },
  {
    value: "24/7",
    label: "AI Assistant"
  },
  {
    value: "100+",
    label: "AI Automations"
  }
]

const benefits = [
  {
    icon: BrainCircuit,
    title: "AI Business Assistant",
    description:
      "Ask questions about your business, customers, jobs, invoices and reports using natural language."
  },
  {
    icon: FileText,
    title: "Instant Quote Generation",
    description:
      "Generate professional estimates and proposals in seconds using AI-powered pricing and templates."
  },
  {
    icon: MessageSquare,
    title: "Customer Communication",
    description:
      "Automatically draft emails, SMS messages and follow-ups while maintaining your company tone."
  },
  {
    icon: Mic,
    title: "Voice AI",
    description:
      "Technicians can update jobs, create notes and complete work orders using voice commands."
  }
]


const aiAgents = [
  {
    icon: FileText,
    title: "AI Quote Generator",
    description:
      "Generate professional estimates using customer information, pricing rules and historical job data.",
    features: [
      "Professional proposals",
      "Automatic pricing",
      "Custom templates",
      "Instant estimate creation"
    ]
  },
  {
    icon: MessageSquare,
    title: "AI Email Writer",
    description:
      "Automatically draft customer emails, follow-ups, appointment reminders and proposals.",
    features: [
      "Follow-up emails",
      "Appointment reminders",
      "Professional responses",
      "Marketing campaigns"
    ]
  },
  {
    icon: Mic,
    title: "Voice AI Assistant",
    description:
      "Allow technicians to complete work orders, dictate notes and update jobs using voice.",
    features: [
      "Voice notes",
      "Hands-free updates",
      "Speech recognition",
      "Job completion"
    ]
  },
  {
    icon: Bot,
    title: "AI Customer Support",
    description:
      "Answer customer questions instantly using AI trained on your services and business knowledge.",
    features: [
      "24/7 customer support",
      "Knowledge base",
      "Instant answers",
      "Smart conversations"
    ]
  },
  {
    icon: Cpu,
    title: "AI Sales Assistant",
    description:
      "Help your sales team qualify leads, prepare proposals and increase conversion rates.",
    features: [
      "Lead qualification",
      "Sales recommendations",
      "Pipeline insights",
      "Deal summaries"
    ]
  }
]


const automationFeatures = [
  {
    icon: Cpu,
    title: "Workflow Automation",
    description:
      "Automate repetitive business processes across your CRM without manual intervention.",
    features: [
      "Automatic task creation",
      "Customer follow-ups",
      "Invoice reminders",
      "Recurring maintenance scheduling"
    ]
  },
  {
    icon: BrainCircuit,
    title: "Dispatch AI",
    description:
      "Optimize technician schedules using intelligent routing, travel time estimation and workload balancing.",
    features: [
      "Smart technician assignment",
      "Route optimization",
      "Traffic-aware scheduling",
      "Real-time dispatch recommendations"
    ]
  },
  {
    icon: BarChart3,
    title: "AI Reporting",
    description:
      "Receive intelligent business insights generated from jobs, customers, invoices and technician performance.",
    features: [
      "Revenue forecasting",
      "Profit analysis",
      "Performance summaries",
      "Growth recommendations"
    ]
  },
  {
    icon: Bot,
    title: "Mobile AI Assistant",
    description:
      "Bring AI directly to technicians and field employees through the KoniqTech mobile application.",
    features: [
      "Voice commands",
      "Photo summaries",
      "Instant job notes",
      "Offline assistance"
    ]
  }
]

const integrations = [
  "OpenAI",
  "Twilio SMS",
  "Resend Email",
  "PayPal Business",
  "Google Calendar",
  "Cloudflare R2",
  "REST API",
  "Webhooks",
  "Zapier (Coming Soon)",
  "Microsoft Outlook",
  "QuickBooks (Planned)",
  "Slack Notifications"
]


const faqs = [
  {
    question: "Does KoniqTech AI use my business data for training?",
    answer:
      "No. Your business data remains private to your organization. KoniqTech does not use your tenant data to train public AI models."
  },
  {
    question: "Can I control which employees use AI?",
    answer:
      "Yes. AI features can be enabled or disabled using role-based permissions so only authorized users have access."
  },
  {
    question: "Does AI work on mobile devices?",
    answer:
      "Yes. Technicians and field employees can use AI from the KoniqTech mobile application for voice updates, job summaries and customer information."
  },
  {
    question: "Which AI providers are supported?",
    answer:
      "KoniqTech is designed to integrate with leading AI providers while allowing future expansion as new enterprise AI models become available."
  },
  {
    question: "Is my customer information secure?",
    answer:
      "Absolutely. Every organization operates in an isolated tenant with encrypted communication, secure authentication and enterprise-grade access controls."
  },
  {
    question: "Can AI automate my workflows?",
    answer:
      "Yes. AI can automate customer communication, scheduling, follow-ups, reporting, reminders and many repetitive operational tasks."
  }
]


export default function AIPage() {
  return (
    <main className="bg-white">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50" />

        <div className="relative mx-auto max-w-7xl px-6 py-28">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-5 py-2 text-indigo-700">

                <Sparkles className="h-4 w-4" />

                AI Powered CRM Platform

              </div>

              <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">

                Let AI Run The

                <span className="block text-indigo-600">

                  Busy Work

                </span>

              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-600">

                Generate estimates,
                answer customers,
                automate workflows,
                optimize dispatch,
                summarize jobs,
                write emails
                and help every department work faster using one intelligent AI platform.

              </p>

              <div className="mt-12 flex flex-wrap gap-5">

                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 font-semibold text-white transition hover:bg-indigo-700"
                >

                  Start Free Trial

                  <ArrowRight className="h-5 w-5" />

                </Link>

                <Link
                  href="/demo"
                  className="rounded-2xl border border-slate-300 px-8 py-4 font-semibold transition hover:bg-slate-50"
                >

                  Book Demo

                </Link>

              </div>

              <div className="mt-12 flex flex-wrap gap-6">

                {[
                  "AI Quotes",
                  "Voice Assistant",
                  "Smart Automation",
                  "AI Reports"
                ].map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-2"
                  >

                    <CheckCircle2 className="h-5 w-5 text-green-600" />

                    <span className="font-medium text-slate-700">

                      {item}

                    </span>

                  </div>

                ))}

              </div>

            </div>

            <div className="rounded-[40px] border bg-white p-8 shadow-2xl">

              <div className="rounded-3xl bg-slate-900 p-8 text-white">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl font-bold">

                    AI Dashboard

                  </h3>

                  <Bot className="h-8 w-8 text-indigo-400" />

                </div>

                <div className="mt-10 space-y-5">

                  <DashboardMetric
                    title="AI Conversations"
                    value="1,482"
                  />

                  <DashboardMetric
                    title="Quotes Generated"
                    value="318"
                  />

                  <DashboardMetric
                    title="Hours Saved"
                    value="427"
                  />

                  <DashboardMetric
                    title="Automation Success"
                    value="99.7%"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* AI STATISTICS */}
      {/* ====================================================== */}

      <section className="pb-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

            {stats.map((item) => (

              <StatCard
                key={item.label}
                value={item.value}
                label={item.label}
              />

            ))}

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* WHY KONIQTECH AI */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-indigo-600">

              Why Businesses Choose KoniqTech AI

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              AI Built Specifically
              For Service Businesses

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Unlike generic AI tools,
              KoniqTech AI understands customers,
              technicians,
              dispatch,
              estimates,
              invoices,
              scheduling
              and field service operations.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-2">

            {benefits.map((item) => {

              const Icon = item.icon

              return (

                <div
                  key={item.title}
                  className="rounded-[36px] bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="w-fit rounded-2xl bg-indigo-100 p-4">

                    <Icon className="h-8 w-8 text-indigo-600" />

                  </div>

                  <h3 className="mt-8 text-3xl font-bold text-slate-900">

                    {item.title}

                  </h3>

                  <p className="mt-5 leading-8 text-slate-600">

                    {item.description}

                  </p>

                </div>

              )

            })}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* AI AGENTS */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-indigo-600">

              AI Agents

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              AI That Works Across
              Your Entire Business

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              KoniqTech AI is more than a chatbot.
              Every AI agent is designed specifically
              for field service businesses to automate
              daily operations and improve customer experience.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-2">

            {aiAgents.map((item) => {

              const Icon = item.icon

              return (

                <div
                  key={item.title}
                  className="rounded-[36px] border bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="w-fit rounded-2xl bg-indigo-100 p-4">

                    <Icon className="h-8 w-8 text-indigo-600" />

                  </div>

                  <h3 className="mt-8 text-3xl font-bold text-slate-900">

                    {item.title}

                  </h3>

                  <p className="mt-5 leading-8 text-slate-600">

                    {item.description}

                  </p>

                  <ul className="mt-8 space-y-3">

                    {item.features.map((feature) => (

                      <li
                        key={feature}
                        className="flex items-center gap-3"
                      >

                        <CheckCircle2 className="h-5 w-5 text-green-600" />

                        <span className="text-slate-700">

                          {feature}

                        </span>

                      </li>

                    ))}

                  </ul>

                </div>

              )

            })}

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* AI WORKFLOW */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-indigo-600">

              AI Workflow

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              AI Assists Every Step
              Of The Customer Journey

            </h2>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-5">

            {[
              "Customer Request",
              "AI Creates Quote",
              "AI Schedules Job",
              "Technician Updates",
              "AI Follow-up"
            ].map((step, index) => (

              <div
                key={step}
                className="rounded-[32px] bg-white p-8 text-center shadow-sm"
              >

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">

                  {index + 1}

                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">

                  {step}

                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* AI AUTOMATION */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-indigo-600">

              AI Automation

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Eliminate Repetitive Work
              Across Your Business

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              KoniqTech AI continuously automates repetitive tasks so your
              team spends less time managing software and more time serving
              customers.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-2">

            {automationFeatures.map((item) => {

              const Icon = item.icon

              return (

                <div
                  key={item.title}
                  className="rounded-[36px] border bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="w-fit rounded-2xl bg-indigo-100 p-4">

                    <Icon className="h-8 w-8 text-indigo-600" />

                  </div>

                  <h3 className="mt-8 text-3xl font-bold text-slate-900">

                    {item.title}

                  </h3>

                  <p className="mt-5 leading-8 text-slate-600">

                    {item.description}

                  </p>

                  <ul className="mt-8 space-y-3">

                    {item.features.map((feature) => (

                      <li
                        key={feature}
                        className="flex items-center gap-3"
                      >

                        <CheckCircle2 className="h-5 w-5 text-green-600" />

                        <span>

                          {feature}

                        </span>

                      </li>

                    ))}

                  </ul>

                </div>

              )

            })}

          </div>

        </div>

      </section>

            {/* ====================================================== */}
      {/* AI EVERYWHERE */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-indigo-600">

              AI Across Every Department

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Every Team Gets
              Their Own AI Assistant

            </h2>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {[
              "Sales",
              "Dispatch",
              "Customer Support",
              "Technicians",
              "Accounting",
              "Business Owners"
            ].map((department) => (

              <div
                key={department}
                className="rounded-[32px] bg-white p-10 shadow-sm"
              >

                <Bot className="h-10 w-10 text-indigo-600" />

                <h3 className="mt-6 text-2xl font-bold">

                  {department}

                </h3>

                <p className="mt-4 leading-8 text-slate-600">

                  AI helps automate daily tasks, improve productivity and
                  provide intelligent recommendations for the {department.toLowerCase()} team.

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* AI INTEGRATIONS */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-indigo-600">

              AI Integrations

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Connect AI With
              The Tools You Already Use

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              KoniqTech AI integrates with your communication,
              payment,
              scheduling
              and cloud infrastructure to automate your complete workflow.

            </p>

          </div>

          <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {integrations.map((integration) => (

              <div
                key={integration}
                className="flex items-center gap-4 rounded-[24px] border bg-white p-6 shadow-sm transition hover:shadow-lg"
              >

                <CheckCircle2 className="h-6 w-6 text-green-600" />

                <span className="font-semibold text-slate-700">

                  {integration}

                </span>

              </div>

            ))}

          </div>

        </div>

      </section>

           {/* ====================================================== */}
      {/* AI SECURITY */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-indigo-600">

              Enterprise Security

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              AI Built With
              Privacy & Security First

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Every AI request is protected by enterprise-grade security,
              encrypted communication,
              tenant isolation
              and strict permission controls.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

            {[
              "Tenant Isolation",
              "Encrypted Data",
              "Role-Based Permissions",
              "Audit Logs"
            ].map((item) => (

              <div
                key={item}
                className="rounded-[32px] bg-white p-10 text-center shadow-sm"
              >

                <ShieldCheck className="mx-auto h-12 w-12 text-indigo-600" />

                <h3 className="mt-6 text-2xl font-bold">

                  {item}

                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* FAQ */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-5xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-indigo-600">

              Frequently Asked Questions

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              AI Questions Answered

            </h2>

          </div>

          <div className="mt-20 space-y-8">

            {faqs.map((faq) => (

              <div
                key={faq.question}
                className="rounded-[32px] border bg-white p-10 shadow-sm"
              >

                <h3 className="text-2xl font-bold text-slate-900">

                  {faq.question}

                </h3>

                <p className="mt-5 leading-8 text-slate-600">

                  {faq.answer}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* TRUST */}
      {/* ====================================================== */}

      <section className="bg-gradient-to-r from-indigo-600 to-blue-700 py-28 text-white">

        <div className="mx-auto max-w-6xl px-6 text-center">

          <p className="font-semibold uppercase tracking-[0.3em] text-indigo-200">

            Built For Professional Service Companies

          </p>

          <h2 className="mt-6 text-5xl font-black">

            Enterprise AI You Can Trust

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-indigo-100">

            KoniqTech AI is designed specifically for roofing,
            HVAC,
            plumbing,
            landscaping
            and field service companies—providing secure,
            reliable
            and practical AI tools for everyday business operations.

          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">

            {[
              "Enterprise Security",
              "Multi-Tenant Architecture",
              "Scalable Cloud Infrastructure"
            ].map((item) => (

              <div
                key={item}
                className="rounded-[32px] bg-white/10 p-8 backdrop-blur"
              >

                <CheckCircle2 className="mx-auto h-10 w-10 text-green-300" />

                <h3 className="mt-5 text-2xl font-bold">

                  {item}

                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>

            {/* ====================================================== */}
      {/* PRICING CTA */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-5xl px-6">

          <div className="rounded-[40px] bg-slate-900 px-10 py-20 text-center text-white">

            <p className="font-semibold uppercase tracking-widest text-indigo-300">

              Ready To Experience AI?

            </p>

            <h2 className="mt-6 text-5xl font-black">

              Start Using AI
              In Your Business Today

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-300">

              From intelligent estimates to automated workflows,
              KoniqTech AI helps your entire team work faster,
              smarter
              and more efficiently.

            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">

              <Link
                href="/pricing"
                className="rounded-2xl bg-indigo-600 px-8 py-4 font-semibold text-white transition hover:bg-indigo-700"
              >

                View Pricing

              </Link>

              <Link
                href="/demo"
                className="rounded-2xl border border-slate-600 px-8 py-4 font-semibold transition hover:bg-slate-800"
              >

                Schedule Demo

              </Link>

            </div>

          </div>

        </div>

      </section>

            {/* ====================================================== */}
      {/* FINAL CTA */}
      {/* ====================================================== */}

      <section className="pb-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="rounded-[40px] bg-gradient-to-r from-indigo-600 to-blue-700 px-10 py-24 text-center text-white">

            <h2 className="text-5xl font-black">

              Let AI Become
              Your Next Employee

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-indigo-100">

              Join modern service businesses using KoniqTech AI
              to automate operations,
              improve customer satisfaction
              and grow revenue with intelligent automation.

            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">

              <Link
                href="/register"
                className="rounded-2xl bg-white px-8 py-4 font-semibold text-indigo-700 transition hover:bg-slate-100"
              >

                Start Free Trial

              </Link>

              <Link
                href="/contact"
                className="rounded-2xl border border-white px-8 py-4 font-semibold transition hover:bg-white hover:text-indigo-700"
              >

                Contact Sales

              </Link>

            </div>

          </div>

        </div>

      </section>


    </main>
  )
}

function StatCard({
  value,
  label
}: {
  value: string
  label: string
}) {
  return (
    <div className="rounded-[32px] border bg-white p-8 text-center shadow-sm">

      <div className="text-5xl font-black text-indigo-600">

        {value}

      </div>

      <p className="mt-4 text-lg font-semibold text-slate-700">

        {label}

      </p>

    </div>
  )
}

function DashboardMetric({
  title,
  value
}: {
  title: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-800 px-6 py-5">

      <span className="text-slate-300">

        {title}

      </span>

      <span className="text-2xl font-bold text-indigo-400">

        {value}

      </span>

    </div>
  )
}