import type { Metadata } from "next"
import Link from "next/link"

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Globe,
  Headphones,
  Mail,
  MessageSquare,
  Users,
} from "lucide-react"

import ContactForm from "./components/ContactForm"

export const metadata: Metadata = {
  title: "Contact KoniqTech | AI-Powered Field Service CRM",
  description:
    "Contact KoniqTech for product questions, pricing, demos, support, partnerships or general enquiries. Built for roofing, HVAC, plumbing and landscaping businesses.",
  keywords: [
    "KoniqTech contact",
    "field service CRM",
    "HVAC CRM",
    "roofing CRM",
    "plumbing CRM",
    "landscaping CRM",
    "AI CRM",
  ],
  openGraph: {
    title: "Contact KoniqTech | AI-Powered Field Service CRM",
    description:
      "Talk to KoniqTech about your field service business, product questions, pricing, demos or support.",
    type: "website",
  },
}

const departments = [
  {
    icon: Users,
    title: "Sales",
    description:
      "Learn how KoniqTech can help your field service business manage customers, jobs, teams and growth.",
    email: "sales@koniqtech.com",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description:
      "Already using KoniqTech? Contact our team for help with your account or platform.",
    email: "support@koniqtech.com",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Globe,
    title: "Partnerships",
    description:
      "Interested in integrations, technology partnerships or business opportunities?",
    email: "info@koniqtech.com",
    color: "bg-blue-100 text-blue-600",
  },
]

const faqs = [
  {
    question: "How quickly will I receive a response?",
    answer:
      "Our team normally responds within one business day. Sales enquiries are typically reviewed as quickly as possible.",
  },
  {
    question: "Can I request a personalized demo?",
    answer:
      "Yes. You can request a demo and tell us about your business so we can focus on the workflows that matter to you.",
  },
  {
    question: "What industries does KoniqTech support?",
    answer:
      "KoniqTech is designed for field service businesses including roofing, HVAC, plumbing and landscaping.",
  },
  {
    question: "Can I try KoniqTech before purchasing?",
    answer:
      "Yes. KoniqTech offers a 3-day free trial so you can explore the platform before choosing a plan.",
  },
]

export default function ContactPage() {
  return (
    <main className="bg-white">
      {/* ====================================================== */}
      {/* HERO + CONTACT FORM */}
      {/* ====================================================== */}

      <section
        id="contact"
        className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50"
      >
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -right-32 top-32 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            {/* LEFT SIDE */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700">
                <MessageSquare className="h-4 w-4" />
                We'd Love To Hear From You
              </div>

              <h1 className="mt-7 text-5xl font-black tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
                Let's Talk About
                <span className="block text-orange-500">
                  Your Business
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 md:text-xl">
                Have a question about KoniqTech, pricing, features or your
                field service workflow? Send us a message and our team will
                get back to you.
              </p>

              <div className="mt-10 space-y-5">
                <ContactHighlight
                  icon={<Mail className="h-5 w-5" />}
                  title="Email"
                  value="info@koniqtech.com"
                />

                <ContactHighlight
                  icon={<Clock3 className="h-5 w-5" />}
                  title="Response"
                  value="Within 1 business day"
                />

                <ContactHighlight
                  icon={<Globe className="h-5 w-5" />}
                  title="Markets"
                  value="USA & Europe"
                />
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/pricing"
                  className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                >
                  View Pricing
                </Link>
              </div>
            </div>

            {/* CONTACT FORM */}
            <div
              id="contact-form"
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 md:p-8"
            >
              <div className="mb-7">
                <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                  Contact KoniqTech
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  Send Us A Message
                </h2>

                <p className="mt-3 text-slate-600">
                  Tell us a little about your business and how we can help.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* TRUST STRIP */}
      {/* ====================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          <TrustItem
            title="AI-Powered CRM"
            description="Built for field service"
          />

          <TrustItem
            title="3-Day Free Trial"
            description="Explore before choosing"
          />

          <TrustItem
            title="USA & Europe"
            description="Focused on your market"
          />

          <TrustItem
            title="No Per-User Fees"
            description="Unlimited employees"
          />
        </div>
      </section>

      {/* ====================================================== */}
      {/* DEPARTMENTS */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-widest text-blue-600">
              Need Something Specific?
            </p>

            <h2 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">
              Talk To The Right Team
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Whether you're evaluating KoniqTech, already using the platform,
              or interested in a partnership, we're here to help.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {departments.map((department) => {
              const Icon = department.icon

              return (
                <div
                  key={department.title}
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${department.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-slate-900">
                    {department.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {department.description}
                  </p>

                  <a
                    href={`mailto:${department.email}`}
                    className="mt-6 inline-flex font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {department.email}
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* INDUSTRIES */}
      {/* ====================================================== */}

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="font-semibold uppercase tracking-widest text-orange-500">
                Built For Field Service
              </p>

              <h2 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">
                One CRM For Your Entire Operation
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                KoniqTech brings customers, leads, estimates, jobs,
                scheduling, technicians, billing and AI-powered workflows
                together in one platform.
              </p>

              <div className="mt-8 space-y-4">
                <FeatureItem text="Roofing businesses" />
                <FeatureItem text="HVAC companies" />
                <FeatureItem text="Plumbing businesses" />
                <FeatureItem text="Landscaping companies" />
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl md:p-10">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
                KoniqTech CRM
              </p>

              <h3 className="mt-4 text-3xl font-black">
                Have questions about your workflow?
              </h3>

              <p className="mt-5 leading-8 text-slate-300">
                Tell us what you're currently using and what you want to
                improve. Our team can help you understand how KoniqTech fits
                your business.
              </p>

              <Link
                href="#contact-form"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-semibold text-white transition hover:bg-orange-600"
              >
                Talk To Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* FAQ */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="font-semibold uppercase tracking-widest text-blue-600">
              Frequently Asked Questions
            </p>

            <h2 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">
              Questions? We've Got Answers.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200 bg-white p-7"
              >
                <h3 className="text-xl font-bold text-slate-900">
                  {faq.question}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* FINAL CTA */}
      {/* ====================================================== */}

      <section className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-16 text-center text-white md:px-12">
          <p className="font-semibold uppercase tracking-widest text-blue-200">
            Ready To Get Started?
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            Start Your 3-Day Free Trial
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Explore KoniqTech and see how an AI-powered CRM can simplify your
            field service operation.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-orange-500 px-7 py-3.5 font-semibold text-white transition hover:bg-orange-600"
            >
              Start Free Trial
            </Link>

            <Link
              href="/pricing"
              className="rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

/* ====================================================== */
/* SMALL COMPONENTS */
/* ====================================================== */

function ContactHighlight({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode
  title: string
  value: string
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200">
        {icon}
      </div>

      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  )
}

function TrustItem({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />

      <div>
        <p className="font-bold text-slate-900">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  )
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="h-5 w-5 text-green-600" />

      <span className="font-medium text-slate-700">{text}</span>
    </div>
  )
}