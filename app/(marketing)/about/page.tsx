import type { Metadata } from "next"
import Link from "next/link"

import {
  ArrowRight,
  Sparkles,
  Building2,
  Target,
  Globe,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  Users
} from "lucide-react"

export const metadata: Metadata = {
  title: "About KoniqTech | AI-Powered Field Service CRM",
  description:
    "Learn about KoniqTech, our mission, vision and commitment to building the next generation AI-powered CRM platform for roofing, HVAC, plumbing, landscaping and field service businesses."
}

const stats = [
  {
    value: "AI",
    label: "Powered Platform"
  },
  {
    value: "4+",
    label: "Industries"
  },
  {
    value: "USA & EU",
    label: "Target Market"
  },
  {
    value: "24/7",
    label: "Cloud Platform"
  }
]

const highlights = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "Help field service businesses replace disconnected software with one intelligent AI-powered operating platform."
  },
  {
    icon: Globe,
    title: "Global Vision",
    description:
      "Build the most trusted field service CRM serving businesses across the United States and Europe."
  },
  {
    icon: ShieldCheck,
    title: "Built For Business",
    description:
      "Enterprise-grade security, multi-tenant architecture and scalable cloud infrastructure from day one."
  },
  {
    icon: Building2,
    title: "Industry Focus",
    description:
      "Purpose-built for roofing, HVAC, plumbing, landscaping and growing service companies."
  }
]


const values = [
  {
    icon: Target,
    title: "Customer First",
    description:
      "Every feature we build is designed to help field service businesses operate more efficiently and deliver exceptional customer experiences.",
    color: "bg-orange-100 text-orange-600"
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description:
      "We continuously invest in AI, automation and modern cloud technologies to simplify everyday business operations.",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: ShieldCheck,
    title: "Trust & Security",
    description:
      "Security, privacy and tenant isolation are built into the platform from the beginning—not added later.",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: Globe,
    title: "Long-Term Partnership",
    description:
      "Our goal isn't simply selling software—it's helping businesses grow for years to come.",
    color: "bg-purple-100 text-purple-600"
  }
]

const timeline = [
  {
    year: "Today",
    title: "Building KoniqTech",
    description:
      "Developing a modern AI-powered CRM platform specifically for field service businesses."
  },
  {
    year: "Phase 1",
    title: "Industry CRM",
    description:
      "Launch dedicated CRM solutions for Roofing, HVAC, Plumbing and Landscaping companies."
  },
  {
    year: "Phase 2",
    title: "AI Platform",
    description:
      "Expand intelligent automation, voice AI, predictive reporting and workflow automation."
  },
  {
    year: "Future",
    title: "Global Growth",
    description:
      "Support thousands of service businesses with scalable cloud infrastructure and continuous innovation."
  }
]

const platformHighlights = [
  {
    icon: Sparkles,
    title: "Artificial Intelligence",
    description:
      "Automate quoting, scheduling, customer communication, reporting and everyday business workflows.",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: Users,
    title: "Complete CRM",
    description:
      "Manage leads, customers, jobs, invoices, technicians and communication from one place.",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Globe,
    title: "Cloud Platform",
    description:
      "Access your business securely from anywhere with real-time synchronization across every device.",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description:
      "Multi-tenant architecture, secure authentication and modern cloud infrastructure keep business data protected.",
    color: "bg-red-100 text-red-600"
  }
]

const industries = [
  {
    title: "Roofing",
    description:
      "Manage inspections, estimates, crews, production and warranty work.",
    color: "bg-orange-100 text-orange-600"
  },
  {
    title: "HVAC",
    description:
      "Track installations, maintenance contracts, technicians and equipment history.",
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Plumbing",
    description:
      "Handle service requests, emergency repairs, maintenance plans and invoicing.",
    color: "bg-cyan-100 text-cyan-600"
  },
  {
    title: "Landscaping",
    description:
      "Schedule recurring maintenance, irrigation services and seasonal projects.",
    color: "bg-green-100 text-green-600"
  }
]

const reasons = [
  "AI-powered automation",
  "Modern cloud platform",
  "Industry-specific CRM",
  "Fast onboarding",
  "Smart scheduling",
  "Integrated dispatch",
  "Powerful reporting",
  "Scalable architecture"
]


const faqs = [
  {
    question: "What is KoniqTech?",
    answer:
      "KoniqTech is an AI-powered Field Service CRM built for roofing, HVAC, plumbing, landscaping and other service businesses. It combines CRM, dispatch, scheduling, billing, reporting and AI automation into one platform."
  },
  {
    question: "Who is KoniqTech designed for?",
    answer:
      "Our platform is designed for small, medium and growing field service businesses that want to replace spreadsheets and disconnected software with one intelligent operating system."
  },
  {
    question: "Which countries do you support?",
    answer:
      "KoniqTech is primarily focused on businesses across the United States and Europe."
  },
  {
    question: "Is my business data secure?",
    answer:
      "Yes. Every customer operates within an isolated tenant environment with secure authentication and enterprise-grade cloud infrastructure."
  },
  {
    question: "Can I request a live demo?",
    answer:
      "Absolutely. Our product specialists will walk you through the platform and answer any questions before you start your free trial."
  },
  {
    question: "Does KoniqTech include AI features?",
    answer:
      "Yes. The platform includes AI-powered quoting, automation, reporting, customer communication and workflow optimization."
  }
]

export default function AboutPage() {

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

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-blue-700">

                <Sparkles className="h-4 w-4" />

                About KoniqTech

              </div>

              <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">

                Building The Future Of

                <span className="block text-orange-500">

                  Field Service CRM

                </span>

              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-600">

                KoniqTech is creating an AI-powered platform that helps
                roofing, HVAC, plumbing, landscaping and other field service
                companies manage customers, jobs, technicians and business
                operations from one modern cloud platform.

              </p>

              <div className="mt-12 flex flex-wrap gap-5">

                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
                >

                  Book Demo

                  <ArrowRight className="h-5 w-5" />

                </Link>

                <Link
                  href="/contact"
                  className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
                >

                  Contact Us

                </Link>

              </div>

            </div>

            <div className="rounded-[40px] border bg-white p-8 shadow-2xl">

              <div className="rounded-3xl bg-slate-900 p-8 text-white">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl font-bold">

                    Company Overview

                  </h3>

                  <BarChart3 className="h-8 w-8 text-orange-400" />

                </div>

                <div className="mt-10 space-y-5">

                  <DashboardMetric
                    title="Platform"
                    value="AI CRM"
                  />

                  <DashboardMetric
                    title="Deployment"
                    value="Cloud"
                  />

                  <DashboardMetric
                    title="Market"
                    value="USA & EU"
                  />

                  <DashboardMetric
                    title="Availability"
                    value="24/7"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* COMPANY STATS */}
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
      {/* WHY KONIQTECH */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Why KoniqTech Exists

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              One Platform.
              Every Operation.

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Many field service companies still rely on spreadsheets,
              disconnected software and manual processes.
              KoniqTech brings CRM,
              dispatch,
              AI,
              scheduling,
              billing
              and reporting together into one intelligent platform.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-2">

            {highlights.map((item) => {

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
      {/* OUR STORY */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid items-center gap-20 lg:grid-cols-2">

            <div>

              <p className="font-semibold uppercase tracking-widest text-orange-600">

                Our Story

              </p>

              <h2 className="mt-4 text-5xl font-black text-slate-900">

                Built To Solve
                Real Business Problems

              </h2>

              <p className="mt-8 text-xl leading-9 text-slate-600">

                KoniqTech was created with one clear objective:
                eliminate the complexity of running a field service business.

              </p>

              <p className="mt-8 text-lg leading-8 text-slate-600">

                Instead of forcing businesses to use multiple disconnected
                applications for CRM, scheduling, dispatch, invoicing,
                customer communication and reporting, we believe everything
                should work together inside one intelligent platform.

              </p>

              <p className="mt-8 text-lg leading-8 text-slate-600">

                By combining modern cloud infrastructure with artificial
                intelligence, KoniqTech helps service businesses save time,
                reduce manual work and deliver better customer experiences.

              </p>

            </div>

            <div className="rounded-[40px] bg-gradient-to-br from-orange-50 via-white to-blue-50 p-12 shadow-xl">

              <div className="space-y-8">

                <div className="flex gap-5">

                  <div className="rounded-2xl bg-orange-100 p-4">

                    <Target className="h-8 w-8 text-orange-600" />

                  </div>

                  <div>

                    <h3 className="text-2xl font-bold">

                      Mission

                    </h3>

                    <p className="mt-3 leading-8 text-slate-600">

                      Build the simplest and smartest operating system for field service businesses.

                    </p>

                  </div>

                </div>

                <div className="flex gap-5">

                  <div className="rounded-2xl bg-blue-100 p-4">

                    <Globe className="h-8 w-8 text-blue-600" />

                  </div>

                  <div>

                    <h3 className="text-2xl font-bold">

                      Vision

                    </h3>

                    <p className="mt-3 leading-8 text-slate-600">

                      Become the trusted AI-powered CRM platform for service companies worldwide.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

            {/* ====================================================== */}
      {/* CORE VALUES */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Core Values

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Principles That
              Guide Everything We Build

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Every product decision is guided by simplicity,
              innovation,
              security
              and long-term customer success.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {values.map((item) => {

              const Icon = item.icon

              return (

                <div
                  key={item.title}
                  className="rounded-[36px] bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
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

                </div>

              )

            })}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* TIMELINE */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-green-600">

              Our Journey

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Growing With
              Our Customers

            </h2>

          </div>

          <div className="mt-20 space-y-8">

            {timeline.map((item) => (

              <div
                key={item.title}
                className="rounded-[36px] border bg-white p-10 shadow-sm"
              >

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center">

                  <div className="rounded-2xl bg-green-100 px-6 py-3 font-bold text-green-700">

                    {item.year}

                  </div>

                  <div>

                    <h3 className="text-3xl font-bold text-slate-900">

                      {item.title}

                    </h3>

                    <p className="mt-4 leading-8 text-slate-600">

                      {item.description}

                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>
     

            {/* ====================================================== */}
      {/* WHY CHOOSE US */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div>

              <p className="font-semibold uppercase tracking-widest text-orange-600">

                Why Choose KoniqTech

              </p>

              <h2 className="mt-4 text-5xl font-black text-slate-900">

                One Intelligent Platform
                For Your Entire Business

              </h2>

              <p className="mt-8 text-xl leading-9 text-slate-600">

                Instead of managing multiple disconnected applications,
                KoniqTech centralizes CRM,
                dispatch,
                scheduling,
                AI,
                billing,
                reporting
                and customer communication inside one platform.

              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">

                {reasons.map((item) => (

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

            <div className="rounded-[40px] bg-gradient-to-br from-blue-50 via-white to-orange-50 p-12 shadow-xl">

              <div className="space-y-8">

                <DashboardMetric
                  title="AI Features"
                  value="20+"
                />

                <DashboardMetric
                  title="CRM Modules"
                  value="50+"
                />

                <DashboardMetric
                  title="Cloud Access"
                  value="24/7"
                />

                <DashboardMetric
                  title="Industries"
                  value="4+"
                />

              </div>

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* PLATFORM HIGHLIGHTS */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Platform Highlights

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Built Using Modern
              Cloud Technology

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Every part of KoniqTech is designed to improve productivity,
              reduce manual work and help businesses scale efficiently.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {platformHighlights.map((item) => {

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

                </div>

              )

            })}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* INDUSTRIES */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-green-600">

              Industries We Serve

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Purpose-Built
              For Field Service Businesses

            </h2>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {industries.map((industry) => (

              <div
                key={industry.title}
                className="rounded-[36px] bg-white p-10 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >

                <div className={`mx-auto w-fit rounded-2xl px-5 py-3 font-bold ${industry.color}`}>

                  {industry.title}

                </div>

                <p className="mt-8 leading-8 text-slate-600">

                  {industry.description}

                </p>

                <Link
                  href={`/industries/${industry.title.toLowerCase()}`}
                  className="mt-8 inline-flex rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >

                  Learn More

                </Link>

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

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Frequently Asked Questions

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Learn More About
              KoniqTech

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Here are answers to some of the most common questions about
              our company, platform and long-term vision.

            </p>

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

            Why Businesses Trust Us

          </p>

          <h2 className="mt-6 text-5xl font-black">

            Technology Built
            For Long-Term Growth

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">

            KoniqTech combines modern cloud infrastructure,
            artificial intelligence
            and industry expertise to help field service businesses
            become more efficient,
            profitable
            and customer-focused.

          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">

            <div className="rounded-[32px] bg-white/10 p-8 backdrop-blur">

              <CheckCircle2 className="mx-auto h-10 w-10 text-green-300" />

              <h3 className="mt-5 text-2xl font-bold">

                AI-Powered Platform

              </h3>

              <p className="mt-4 text-blue-100">

                Intelligent automation across CRM, scheduling, dispatch and reporting.

              </p>

            </div>

            <div className="rounded-[32px] bg-white/10 p-8 backdrop-blur">

              <CheckCircle2 className="mx-auto h-10 w-10 text-green-300" />

              <h3 className="mt-5 text-2xl font-bold">

                Secure Cloud Architecture

              </h3>

              <p className="mt-4 text-blue-100">

                Enterprise-grade infrastructure with secure multi-tenant isolation.

              </p>

            </div>

            <div className="rounded-[32px] bg-white/10 p-8 backdrop-blur">

              <CheckCircle2 className="mx-auto h-10 w-10 text-green-300" />

              <h3 className="mt-5 text-2xl font-bold">

                Industry Expertise

              </h3>

              <p className="mt-4 text-blue-100">

                Designed specifically for field service businesses and their daily operations.

              </p>

            </div>

          </div>

        </div>

      </section>

            {/* ====================================================== */}
      {/* ABOUT CTA */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-5xl px-6">

          <div className="rounded-[40px] bg-orange-500 px-10 py-20 text-center text-white shadow-xl">

            <Building2 className="mx-auto h-14 w-14" />

            <h2 className="mt-8 text-5xl font-black">

              Ready To See
              KoniqTech In Action?

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-orange-100">

              Book a personalized demonstration and discover how
              KoniqTech can simplify your operations,
              automate workflows
              and help your business grow.

            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">

              <Link
                href="/demo"
                className="rounded-2xl bg-white px-8 py-4 font-semibold text-orange-600 transition hover:bg-orange-50"
              >

                Book Demo

              </Link>

              <Link
                href="/contact"
                className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >

                Contact Sales

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

              Build The Future
              Of Your Business

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-green-50">

              Join modern roofing,
              HVAC,
              plumbing
              and landscaping companies using KoniqTech to automate
              operations, improve productivity and deliver exceptional
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
                href="/pricing"
                className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >

                View Pricing

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
}:{
  value:string
  label:string
}){

  return(

    <div className="rounded-[32px] border bg-white p-8 text-center shadow-sm">

      <div className="text-5xl font-black text-orange-500">

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
}:{
  title:string
  value:string
}){

  return(

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