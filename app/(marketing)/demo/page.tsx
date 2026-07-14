import type { Metadata } from "next"
import Link from "next/link"

import {
  ArrowRight,
  CalendarDays,
  PlayCircle,
  CheckCircle2,
  MonitorSmartphone,
  Users,
  Clock3,
  TrendingUp,
  Sparkles,
  BarChart3
} from "lucide-react"

export const metadata: Metadata = {
  title: "Book a Live Demo | KoniqTech",
  description:
    "Schedule a personalized live demo of KoniqTech Field Service CRM. Discover AI automation, dispatch, scheduling, customer management, estimates, billing and reporting for your business."
}

const stats = [
  {
    value: "30 Min",
    label: "Live Demo"
  },
  {
    value: "1-on-1",
    label: "Personal Session"
  },
  {
    value: "100%",
    label: "Questions Answered"
  },
  {
    value: "Free",
    label: "No Commitment"
  }
]

const benefits = [
  {
    icon: MonitorSmartphone,
    title: "Live Platform Walkthrough",
    description:
      "Explore the complete CRM dashboard, scheduling, dispatch, AI automation, reporting and customer management in real time."
  },
  {
    icon: Users,
    title: "Personalized Consultation",
    description:
      "Every demo is tailored to your business processes, industry and team so you see exactly how KoniqTech fits your workflow."
  },
  {
    icon: Clock3,
    title: "Quick 30 Minute Session",
    description:
      "Learn the platform quickly with a focused live demonstration and dedicated Q&A session."
  },
  {
    icon: TrendingUp,
    title: "Business Growth Strategy",
    description:
      "Receive recommendations on improving efficiency, technician productivity and customer satisfaction using KoniqTech."
  }
]

const demoModules = [
  {
    icon: Users,
    title: "CRM & Customer Management",
    description:
      "Learn how KoniqTech organizes leads, customers, jobs, service history, notes and communications in one centralized workspace.",
    color: "bg-blue-100 text-blue-600",
    features: [
      "Lead Management",
      "Customer Profiles",
      "Job History",
      "Customer Portal"
    ]
  },
  {
    icon: Sparkles,
    title: "AI Platform",
    description:
      "Experience live AI features including quote generation, email writing, dispatch recommendations and customer support automation.",
    color: "bg-purple-100 text-purple-600",
    features: [
      "AI Quotes",
      "Voice AI",
      "Workflow Automation",
      "Customer AI"
    ]
  },
  {
    icon: CalendarDays,
    title: "Smart Dispatch",
    description:
      "See how intelligent scheduling assigns technicians, optimizes travel routes and manages emergency jobs.",
    color: "bg-green-100 text-green-600",
    features: [
      "GPS Routing",
      "Calendar",
      "Technician Assignment",
      "Real-Time Updates"
    ]
  },
  {
    icon: BarChart3,
    title: "Billing & Reporting",
    description:
      "Generate estimates, invoices, payments and powerful business reports with only a few clicks.",
    color: "bg-orange-100 text-orange-600",
    features: [
      "Estimates",
      "Invoices",
      "Payments",
      "Analytics"
    ]
  },
  {
    icon: MonitorSmartphone,
    title: "Mobile Application",
    description:
      "Watch technicians complete jobs, upload photos, collect signatures and update customers directly from the mobile app.",
    color: "bg-cyan-100 text-cyan-600",
    features: [
      "Offline Mode",
      "Photo Upload",
      "Customer Signatures",
      "Instant Updates"
    ]
  },
  {
    icon: TrendingUp,
    title: "Business Intelligence",
    description:
      "Understand revenue, technician productivity, conversion rates and customer satisfaction with live dashboards.",
    color: "bg-red-100 text-red-600",
    features: [
      "Revenue",
      "KPIs",
      "Profit Reports",
      "Forecasting"
    ]
  }
]

const demoSteps = [
  "Introduction & Business Goals",
  "CRM Walkthrough",
  "AI Platform Demo",
  "Dispatch & Scheduling",
  "Billing & Payments",
  "Reports & Analytics",
  "Questions & Answers"
]


const processSteps = [
  {
    number: "01",
    title: "Book Your Demo",
    description:
      "Choose a convenient date and time. We'll confirm your session and send the meeting details.",
    icon: CalendarDays,
    color: "bg-blue-100 text-blue-600"
  },
  {
    number: "02",
    title: "Meet Our Product Expert",
    description:
      "Connect with a KoniqTech specialist who understands field service businesses and your industry's challenges.",
    icon: Users,
    color: "bg-green-100 text-green-600"
  },
  {
    number: "03",
    title: "Live Platform Walkthrough",
    description:
      "Experience CRM, dispatch, AI, scheduling, billing, reporting and mobile apps using real business workflows.",
    icon: PlayCircle,
    color: "bg-orange-100 text-orange-600"
  },
  {
    number: "04",
    title: "Questions & Discussion",
    description:
      "Ask anything about implementation, pricing, migration, integrations or customization.",
    icon: CheckCircle2,
    color: "bg-purple-100 text-purple-600"
  },
  {
    number: "05",
    title: "Start Your Free Trial",
    description:
      "Immediately access your account and begin using KoniqTech with onboarding assistance.",
    icon: ArrowRight,
    color: "bg-red-100 text-red-600"
  }
]

const trialBenefits = [
  "Complete CRM Access",
  "AI Platform Included",
  "Unlimited Customer Records",
  "Dispatch & Scheduling",
  "Reports & Dashboards",
  "Email & SMS Automation",
  "Mobile Application",
  "Free Product Support"
]

const successStats = [
  {
    value: "30 Min",
    label: "Average Demo"
  },
  {
    value: "1 Day",
    label: "Fast Setup"
  },
  {
    value: "7 Days",
    label: "Free Trial"
  },
  {
    value: "24/7",
    label: "Customer Support"
  }
]



const faqs = [
  {
    question: "How long does the demo take?",
    answer:
      "Most live demonstrations take approximately 30 minutes, followed by a dedicated Q&A session tailored to your business."
  },
  {
    question: "Will the demo be customized for my business?",
    answer:
      "Yes. Every demonstration is personalized based on your industry, business size, workflow and operational goals."
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No. The demo is completely online and only requires your web browser."
  },
  {
    question: "Can my team join the meeting?",
    answer:
      "Absolutely. Owners, managers, dispatchers and technicians are welcome to participate."
  },
  {
    question: "Will I receive a free trial after the demo?",
    answer:
      "Yes. After the session you'll be able to start your free trial and explore the platform with onboarding assistance."
  },
  {
    question: "Can KoniqTech migrate data from our current software?",
    answer:
      "Yes. We help migrate customers, jobs, invoices and other important business data during onboarding."
  }
]

export default function DemoPage() {
  return (
    <main className="bg-white">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50" />

        <div className="relative mx-auto max-w-7xl px-6 py-28">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2 text-orange-700">

                <Sparkles className="h-4 w-4" />

                Book Your Personalized Demo

              </div>

              <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">

                See KoniqTech

                <span className="block text-orange-600">

                  In Action

                </span>

              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-600">

                Discover how AI,
                CRM,
                dispatch,
                scheduling,
                estimates,
                billing
                and automation work together to transform your field service business.

              </p>

              <div className="mt-12 flex flex-wrap gap-5">

                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
                >

                  Start Free Trial

                  <ArrowRight className="h-5 w-5" />

                </Link>

                <Link
                  href="#schedule-demo"
                  className="inline-flex items-center gap-2 rounded-2xl border border-blue-300 bg-blue-50 px-8 py-4 font-semibold text-blue-700 transition hover:bg-blue-100"
                >

                  <CalendarDays className="h-5 w-5" />

                  Schedule Demo

                </Link>

              </div>

            </div>

            <div className="rounded-[40px] border bg-white p-8 shadow-2xl">

              <div className="rounded-3xl bg-slate-900 p-8 text-white">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl font-bold">

                    Live Demo Preview

                  </h3>

                  <PlayCircle className="h-9 w-9 text-orange-400" />

                </div>

                <div className="mt-10 space-y-5">

                  <DashboardMetric
                    title="CRM Walkthrough"
                    value="✔"
                  />

                  <DashboardMetric
                    title="AI Automation"
                    value="Live"
                  />

                  <DashboardMetric
                    title="Dispatch Demo"
                    value="GPS"
                  />

                  <DashboardMetric
                    title="Questions"
                    value="Unlimited"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* STATS */}
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
      {/* WHY BOOK A DEMO */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Why Book A Demo

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Experience The Platform
              Before You Decide

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Watch the platform operate in real time,
              ask questions,
              explore AI capabilities
              and understand how KoniqTech fits your business.

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

                  <div className="w-fit rounded-2xl bg-blue-100 p-4">

                    <Icon className="h-8 w-8 text-blue-600" />

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
      {/* DEMO MODULES */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-orange-600">

              Live Product Demonstration

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Everything You'll See
              During Your Demo

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Your personalized demo walks through every major feature
              so you understand exactly how KoniqTech can improve your
              day-to-day operations.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-2 xl:grid-cols-3">

            {demoModules.map((item) => {

              const Icon = item.icon

              return (

                <div
                  key={item.title}
                  className="rounded-[36px] border bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className={`w-fit rounded-2xl p-4 ${item.color}`}>

                    <Icon className="h-8 w-8" />

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
      {/* DEMO TIMELINE */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Demo Agenda

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Your 30 Minute Session

            </h2>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

            {demoSteps.map((step, index) => (

              <div
                key={step}
                className="rounded-[32px] bg-white p-10 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-black text-white">

                  {index + 1}

                </div>

                <h3 className="mt-8 text-2xl font-bold text-slate-900">

                  {step}

                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>




          {/* ====================================================== */}
      {/* DEMO PROCESS */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Demo Process

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              From Booking
              To Business Growth

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Our guided demonstration ensures you understand every feature
              before starting your free trial.

            </p>

          </div>

          <div className="mt-20 space-y-10">

            {processSteps.map((step) => {

              const Icon = step.icon

              return (

                <div
                  key={step.number}
                  className="rounded-[40px] border bg-white p-10 shadow-sm transition hover:shadow-xl"
                >

                  <div className="grid items-center gap-10 lg:grid-cols-[120px_1fr]">

                    <div className="text-center">

                      <div
                        className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${step.color}`}
                      >

                        <Icon className="h-10 w-10" />

                      </div>

                      <div className="mt-5 text-3xl font-black text-slate-900">

                        {step.number}

                      </div>

                    </div>

                    <div>

                      <h3 className="text-3xl font-bold text-slate-900">

                        {step.title}

                      </h3>

                      <p className="mt-5 text-lg leading-8 text-slate-600">

                        {step.description}

                      </p>

                    </div>

                  </div>

                </div>

              )

            })}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* FREE TRIAL */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div>

              <p className="font-semibold uppercase tracking-widest text-green-600">

                After Your Demo

              </p>

              <h2 className="mt-4 text-5xl font-black text-slate-900">

                Start Your
                Free Trial
                Immediately

              </h2>

              <p className="mt-8 text-xl leading-9 text-slate-600">

                Everything demonstrated during your session becomes
                available inside your own KoniqTech workspace.

              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">

                {trialBenefits.map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm"
                  >

                    <CheckCircle2 className="h-5 w-5 text-green-600" />

                    <span className="font-medium text-slate-700">

                      {item}

                    </span>

                  </div>

                ))}

              </div>

            </div>

            <div className="rounded-[40px] bg-white p-10 shadow-xl">

              <h3 className="text-3xl font-bold text-slate-900">

                Trial Highlights

              </h3>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">

                {successStats.map((item) => (

                  <div
                    key={item.label}
                    className="rounded-[28px] border p-8 text-center"
                  >

                    <div className="text-4xl font-black text-orange-600">

                      {item.value}

                    </div>

                    <p className="mt-4 font-semibold text-slate-700">

                      {item.label}

                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* FAQ */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-5xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Frequently Asked Questions

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Everything You Need
              Before Booking

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

      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 py-28 text-white">

        <div className="mx-auto max-w-6xl px-6 text-center">

          <p className="font-semibold uppercase tracking-[0.3em] text-blue-200">

            Trusted Platform

          </p>

          <h2 className="mt-6 text-5xl font-black">

            Discover Why Businesses
            Choose KoniqTech

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">

            During your live demo you'll see how KoniqTech simplifies
            scheduling, dispatch, AI automation, billing, reporting and
            customer management from one intelligent platform.

          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">

            <div className="rounded-[32px] bg-white/10 p-8 backdrop-blur">

              <CheckCircle2 className="mx-auto h-10 w-10 text-green-300" />

              <h3 className="mt-5 text-2xl font-bold">

                Enterprise Security

              </h3>

            </div>

            <div className="rounded-[32px] bg-white/10 p-8 backdrop-blur">

              <CheckCircle2 className="mx-auto h-10 w-10 text-green-300" />

              <h3 className="mt-5 text-2xl font-bold">

                AI-Powered Platform

              </h3>

            </div>

            <div className="rounded-[32px] bg-white/10 p-8 backdrop-blur">

              <CheckCircle2 className="mx-auto h-10 w-10 text-green-300" />

              <h3 className="mt-5 text-2xl font-bold">

                Built For Field Services

              </h3>

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* DEMO CTA */}
      {/* ====================================================== */}

      <section
        id="schedule-demo"
        className="py-28"
      >

        <div className="mx-auto max-w-5xl px-6">

          <div className="rounded-[40px] bg-orange-500 px-10 py-20 text-center text-white shadow-xl">

            <CalendarDays className="mx-auto h-14 w-14" />

            <h2 className="mt-8 text-5xl font-black">

              Schedule Your
              Live Demo Today

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-orange-100">

              Meet with a KoniqTech specialist, explore the platform
              live and discover how AI can transform your business.

            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">

              <Link
                href="/contact"
                className="rounded-2xl bg-white px-8 py-4 font-semibold text-orange-600 transition hover:bg-orange-50"
              >

                Book Demo

              </Link>

              <Link
                href="/pricing"
                className="rounded-2xl border border-orange-200 px-8 py-4 font-semibold transition hover:bg-orange-600"
              >

                View Pricing

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

          <div className="rounded-[40px] bg-gradient-to-r from-green-600 to-blue-600 px-10 py-24 text-center text-white">

            <h2 className="text-5xl font-black">

              Ready To Modernize
              Your Business?

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-green-50">

              Join roofing,
              HVAC,
              plumbing
              and landscaping companies using KoniqTech to automate
              operations, increase productivity and deliver exceptional
              customer experiences.

            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">

              <Link
                href="/register"
                className="rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
              >

                Start Free Trial

              </Link>

              <Link
                href="/contact"
                className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >

                Talk To Sales

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

      <div className="text-5xl font-black text-orange-600">

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

      <span className="text-2xl font-bold text-orange-400">

        {value}

      </span>

    </div>
  )
}
