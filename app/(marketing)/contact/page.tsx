import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  Clock3,
  Globe2,
  Mail,
  MessageSquare,
} from "lucide-react"

import ContactForm from "./components/ContactForm"

export const metadata: Metadata = {
  title: "Contact KoniqTech | AI-Powered Field Service CRM",
  description:
    "Contact KoniqTech to learn how our AI-powered CRM can help HVAC, roofing, plumbing, and landscaping businesses manage leads, customers, jobs, scheduling, and operations.",
  alternates: {
    canonical: "https://koniqtech.com/contact",
  },
  openGraph: {
    title: "Contact KoniqTech | AI-Powered Field Service CRM",
    description:
      "Talk to KoniqTech about an AI-powered CRM built for field service businesses.",
    url: "https://koniqtech.com/contact",
    siteName: "KoniqTech",
    type: "website",
  },
}

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: "info@koniqtech.com",
    href: "mailto:info@koniqtech.com",
  },
  {
    icon: Clock3,
    label: "Response",
    value: "Within 1 business day",
  },
  {
    icon: Globe2,
    label: "Markets",
    value: "USA & Europe",
  },
]

function FeatureItem({
  text,
}: {
  text: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
        ✓
      </div>

      <span className="font-medium text-slate-700">
        {text}
      </span>
    </div>
  )
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.12),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200">
              <MessageSquare className="h-4 w-4 text-orange-400" />
              Let&apos;s talk
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Talk to the KoniqTech team
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Have questions about KoniqTech CRM, AI features,
              pricing, onboarding, or your field-service workflow?
              Send us a message and our team will get back to you.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            {/* LEFT */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
                Contact KoniqTech
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Tell us what you need
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                Whether you are evaluating CRM software, switching
                from another platform, or simply want to understand
                how KoniqTech works, we&apos;re happy to help.
              </p>

              <div className="mt-10 space-y-6">
                {contactItems.map((item) => {
                  const Icon = item.icon

                  const content = (
                    <>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>

                      <div>
                        <p className="text-sm text-slate-500">
                          {item.label}
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {item.value}
                        </p>
                      </div>
                    </>
                  )

                  return item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-4 rounded-xl transition hover:opacity-80"
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      key={item.label}
                      className="flex items-center gap-4"
                    >
                      {content}
                    </div>
                  )
                })}
              </div>

              {/* FEATURES */}
              <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-950">
                  What you can ask us about
                </h3>

                <div className="mt-5 space-y-3">
                  <FeatureItem text="AI-powered CRM features" />
                  <FeatureItem text="HVAC, Roofing, Plumbing & Landscaping workflows" />
                  <FeatureItem text="Pricing and plans" />
                  <FeatureItem text="3-day free trial" />
                  <FeatureItem text="Migration from another CRM" />
                  <FeatureItem text="Team and multi-location setup" />
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-orange-600"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/pricing"
                  className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  View Pricing
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}