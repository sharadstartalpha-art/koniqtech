import type { Metadata } from "next"
import Link from "next/link"

import {
  ArrowRight,
  Cookie,
  ShieldCheck,
  Globe,
  Lock,
  Database,
  CheckCircle2,
  CalendarDays
} from "lucide-react"

export const metadata: Metadata = {
  title: "Cookie Policy | KoniqTech",
  description:
    "Read KoniqTech's Cookie Policy to understand how cookies are used across our AI-powered Field Service CRM platform, website and customer portal."
}

const cookieTypes = [
  {
    icon: Lock,
    title: "Essential Cookies",
    description:
      "Required for login sessions, security, authentication and core website functionality."
  },
  {
    icon: Database,
    title: "Performance Cookies",
    description:
      "Help us measure website performance and improve speed, reliability and overall user experience."
  },
  {
    icon: Globe,
    title: "Functional Cookies",
    description:
      "Remember your preferences such as language, theme and frequently used settings."
  },
  {
    icon: ShieldCheck,
    title: "Security Cookies",
    description:
      "Protect accounts against fraud, unauthorized access and malicious activity."
  }
]

const cookieUsage = [
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    description:
      "Maintain secure login sessions, protect user accounts and verify authenticated users throughout the platform."
  },
  {
    icon: Database,
    title: "Platform Performance",
    description:
      "Measure application performance, improve loading speeds and identify technical issues."
  },
  {
    icon: Globe,
    title: "Personalized Experience",
    description:
      "Remember language, preferences, dashboard settings and recently used options."
  },
  {
    icon: Cookie,
    title: "Platform Improvements",
    description:
      "Analyze anonymous usage trends to improve usability, AI features and customer experience."
  }
]

const cookieCategories = [
  {
    color: "green",
    title: "Essential Cookies",
    description:
      "These cookies are required for the KoniqTech platform to operate correctly and cannot be disabled.",
    items: [
      "User authentication (NextAuth)",
      "Secure login sessions",
      "Account security",
      "CSRF protection",
      "Load balancing",
      "Fraud prevention"
    ]
  },
  {
    color: "blue",
    title: "Analytics Cookies",
    description:
      "Analytics cookies help us understand how visitors interact with our website and platform.",
    items: [
      "Website traffic",
      "Page performance",
      "Feature usage",
      "Error monitoring",
      "Performance optimization",
      "Anonymous usage statistics"
    ]
  },
  {
    color: "orange",
    title: "Functional Cookies",
    description:
      "Functional cookies improve convenience by remembering your preferences.",
    items: [
      "Language selection",
      "Dashboard preferences",
      "Theme settings",
      "Recent pages",
      "Saved preferences",
      "User interface improvements"
    ]
  }
]

const thirdPartyServices = [
  {
    name: "PayPal Business",
    purpose: "Subscription payments and billing."
  },
  {
    name: "Resend",
    purpose: "Transactional email delivery."
  },
  {
    name: "Cloudflare",
    purpose: "Performance, CDN and security."
  },
  {
    name: "Neon PostgreSQL",
    purpose: "Secure application database."
  }
]

const browserSettings = [
  "Google Chrome",
  "Mozilla Firefox",
  "Microsoft Edge",
  "Apple Safari",
  "Opera",
  "Brave Browser"
]

const gdprRights = [
  "Request access to your personal information.",
  "Request correction of inaccurate information.",
  "Request deletion of eligible personal data.",
  "Object to certain processing activities.",
  "Withdraw cookie consent where applicable.",
  "Request data portability where legally available."
]

const policyUpdates = [
  {
    title: "Platform Improvements",
    description:
      "We may update this Cookie Policy when introducing new features or improving the KoniqTech platform."
  },
  {
    title: "Legal Requirements",
    description:
      "Changes in applicable privacy or cookie regulations may require updates to this policy."
  },
  {
    title: "Technology Changes",
    description:
      "As browsers, authentication systems and third-party services evolve, our cookie practices may also change."
  }
]


const cookieFaqs = [
  {
    question: "Does KoniqTech use cookies for advertising?",
    answer:
      "No. KoniqTech does not use advertising cookies to sell or share your personal information with advertisers."
  },
  {
    question: "Can I disable cookies?",
    answer:
      "Yes. Most browsers allow you to manage or disable cookies. However, disabling essential cookies may affect login, security and platform functionality."
  },
  {
    question: "Are cookies secure?",
    answer:
      "Cookies themselves do not execute code or contain malware. We use secure cookies to protect authentication sessions and improve platform security."
  },
  {
    question: "Do AI features use cookies?",
    answer:
      "Some AI-powered features may use secure session cookies to maintain authenticated requests and improve user experience."
  },
  {
    question: "How often is this Cookie Policy updated?",
    answer:
      "We review this policy periodically and update it whenever our technologies, legal obligations or services change."
  },
  {
    question: "Who can I contact about cookies?",
    answer:
      "Please contact info@koniqtech.com if you have any questions regarding cookies or privacy."
  }
]





export default function CookiePolicyPage() {
  return (
    <main className="bg-white">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50" />

        <div className="relative mx-auto max-w-7xl px-6 py-28">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-blue-700">

                <Cookie className="h-4 w-4" />

                Cookie Policy

              </div>

              <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">

                How

                <span className="block text-blue-600">

                  KoniqTech Uses Cookies

                </span>

              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-600">

                This Cookie Policy explains how KoniqTech uses cookies
                and similar technologies across our website,
                AI-powered CRM platform,
                customer portal
                and related services.

              </p>

              <div className="mt-12 flex flex-wrap gap-5">

                <Link
                  href="/privacy-policy"
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
                >

                  Privacy Policy

                  <ArrowRight className="h-5 w-5" />

                </Link>

                <Link
                  href="/contact"
                  className="rounded-2xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
                >

                  Contact Us

                </Link>

              </div>

            </div>

            <div className="rounded-[40px] border bg-white p-8 shadow-2xl">

              <div className="rounded-3xl bg-slate-900 p-8 text-white">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl font-bold">

                    Policy Summary

                  </h3>

                  <Cookie className="h-8 w-8 text-blue-400" />

                </div>

                <div className="mt-10 space-y-5">

                  <SummaryItem
                    title="Authentication Cookies"
                  />

                  <SummaryItem
                    title="Security Protection"
                  />

                  <SummaryItem
                    title="Performance Monitoring"
                  />

                  <SummaryItem
                    title="Preference Storage"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* EFFECTIVE DATE */}
      {/* ====================================================== */}

      <section className="pb-20">

        <div className="mx-auto max-w-6xl px-6">

          <div className="rounded-[36px] bg-blue-50 p-10">

            <div className="flex flex-wrap items-center gap-4">

              <CalendarDays className="h-8 w-8 text-blue-600" />

              <h2 className="text-3xl font-black text-slate-900">

                Effective Date

              </h2>

            </div>

            <p className="mt-6 text-lg leading-8 text-slate-600">

              This Cookie Policy is effective from the date shown on
              this page and may be updated periodically to reflect
              improvements to our platform, legal requirements and
              technology changes.

            </p>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* COOKIE OVERVIEW */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-green-600">

              Cookie Overview

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              What Are Cookies?

            </h2>

            <p className="mx-auto mt-8 max-w-4xl text-xl leading-9 text-slate-600">

              Cookies are small text files stored on your device that
              help websites recognize returning visitors, maintain
              secure login sessions, remember preferences and improve
              website functionality and performance.

            </p>

            <p className="mx-auto mt-8 max-w-4xl text-xl leading-9 text-slate-600">

              KoniqTech uses cookies responsibly to provide secure
              authentication, improve customer experience and deliver
              reliable AI-powered CRM services.

            </p>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* COOKIE TYPES */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-orange-600">

              Types Of Cookies

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Cookies We Use

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Different cookies perform different functions to help
              keep the KoniqTech platform secure, reliable and easy to
              use.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {cookieTypes.map((item) => {

              const Icon = item.icon

              return (

                <div
                  key={item.title}
                  className="rounded-[36px] border bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="w-fit rounded-2xl bg-orange-100 p-4">

                    <Icon className="h-8 w-8 text-orange-600" />

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
      {/* HOW WE USE COOKIES */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Cookie Usage

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              How We Use Cookies

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Cookies help KoniqTech deliver a secure,
              reliable and personalized experience across
              our website and AI-powered CRM platform.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {cookieUsage.map((item) => {

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
      {/* COOKIE CATEGORIES */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-8 lg:grid-cols-3">

            {cookieCategories.map((category) => (

              <div
                key={category.title}
                className="rounded-[36px] border bg-white p-10 shadow-sm"
              >

                <div
                  className={`w-fit rounded-2xl p-4 ${
                    category.color === "green"
                      ? "bg-green-100"
                      : category.color === "blue"
                      ? "bg-blue-100"
                      : "bg-orange-100"
                  }`}
                >

                  <Cookie
                    className={`h-8 w-8 ${
                      category.color === "green"
                        ? "text-green-600"
                        : category.color === "blue"
                        ? "text-blue-600"
                        : "text-orange-600"
                    }`}
                  />

                </div>

                <h3 className="mt-8 text-3xl font-bold text-slate-900">

                  {category.title}

                </h3>

                <p className="mt-5 leading-8 text-slate-600">

                  {category.description}

                </p>

                <div className="mt-8 space-y-4">

                  {category.items.map((item) => (

                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >

                      <CheckCircle2 className="h-5 w-5 text-green-600" />

                      <span className="text-slate-700">

                        {item}

                      </span>

                    </div>

                  ))}

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* THIRD PARTY SERVICES */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-orange-600">

              Third-Party Services

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Trusted Service Providers

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Some cookies are provided by trusted third-party
              services that help KoniqTech securely operate
              its platform.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {thirdPartyServices.map((service) => (

              <div
                key={service.name}
                className="rounded-[36px] border bg-white p-10 shadow-sm"
              >

                <div className="rounded-2xl bg-orange-100 p-4 w-fit">

                  <Globe className="h-8 w-8 text-orange-600" />

                </div>

                <h3 className="mt-8 text-3xl font-bold text-slate-900">

                  {service.name}

                </h3>

                <p className="mt-5 leading-8 text-slate-600">

                  {service.purpose}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

             {/* ====================================================== */}
      {/* COOKIE PREFERENCES */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div>

              <p className="font-semibold uppercase tracking-widest text-green-600">

                Cookie Preferences

              </p>

              <h2 className="mt-4 text-5xl font-black text-slate-900">

                Manage Your
                Cookie Preferences

              </h2>

              <p className="mt-8 text-xl leading-9 text-slate-600">

                You can control or delete cookies through your browser
                settings. Please note that disabling certain cookies
                may affect website functionality, secure login sessions
                and some AI-powered features.

              </p>

              <p className="mt-8 text-lg leading-8 text-slate-600">

                Essential cookies required for authentication and
                platform security cannot always be disabled while
                actively using the KoniqTech CRM platform.

              </p>

            </div>

            <div className="rounded-[40px] bg-green-50 p-10">

              <h3 className="text-3xl font-bold text-slate-900">

                You Can

              </h3>

              <div className="mt-8 space-y-5">

                <div className="flex gap-4">

                  <CheckCircle2 className="mt-1 h-6 w-6 text-green-600" />

                  <p className="text-lg leading-8 text-slate-700">

                    View stored cookies.

                  </p>

                </div>

                <div className="flex gap-4">

                  <CheckCircle2 className="mt-1 h-6 w-6 text-green-600" />

                  <p className="text-lg leading-8 text-slate-700">

                    Delete cookies whenever you choose.

                  </p>

                </div>

                <div className="flex gap-4">

                  <CheckCircle2 className="mt-1 h-6 w-6 text-green-600" />

                  <p className="text-lg leading-8 text-slate-700">

                    Block future cookies.

                  </p>

                </div>

                <div className="flex gap-4">

                  <CheckCircle2 className="mt-1 h-6 w-6 text-green-600" />

                  <p className="text-lg leading-8 text-slate-700">

                    Configure browser privacy settings.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

            {/* ====================================================== */}
      {/* BROWSER CONTROLS */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Browser Controls

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Most Browsers
              Let You Control Cookies

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Modern browsers provide built-in tools for reviewing,
              deleting and managing cookies.

            </p>

          </div>

          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {browserSettings.map((browser) => (

              <div
                key={browser}
                className="rounded-[30px] border bg-white p-8 text-center shadow-sm"
              >

                <Globe className="mx-auto h-10 w-10 text-blue-600" />

                <h3 className="mt-6 text-2xl font-bold text-slate-900">

                  {browser}

                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* GDPR */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="rounded-[40px] bg-blue-50 p-12">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              GDPR Compliance

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Rights For EU Visitors

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              If you are located in the European Economic Area (EEA),
              United Kingdom or another jurisdiction with similar
              privacy regulations, you may have additional rights
              regarding cookies and personal information.

            </p>

            <div className="mt-12 space-y-5">

              {gdprRights.map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-4 rounded-2xl bg-white p-5"
                >

                  <CheckCircle2 className="h-6 w-6 text-blue-600" />

                  <span className="text-lg text-slate-700">

                    {item}

                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* RETENTION & UPDATES */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-8 lg:grid-cols-2">

            <div className="rounded-[36px] bg-white p-10 shadow-sm">

              <h2 className="text-4xl font-black text-slate-900">

                Cookie Retention

              </h2>

              <p className="mt-8 text-lg leading-8 text-slate-600">

                Some cookies exist only while your browser session
                remains active, while others remain stored for a
                longer period to remember preferences and improve
                future visits.

              </p>

              <p className="mt-6 text-lg leading-8 text-slate-600">

                Cookie retention periods depend on the cookie type,
                browser settings and applicable legal requirements.

              </p>

            </div>

            <div className="rounded-[36px] bg-white p-10 shadow-sm">

              <h2 className="text-4xl font-black text-slate-900">

                Policy Updates

              </h2>

              <div className="mt-8 space-y-6">

                {policyUpdates.map((item) => (

                  <div key={item.title}>

                    <h3 className="text-2xl font-bold text-slate-900">

                      {item.title}

                    </h3>

                    <p className="mt-3 leading-8 text-slate-600">

                      {item.description}

                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>


             {/* ====================================================== */}
      {/* CONTACT INFORMATION */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="rounded-[40px] border bg-white p-12 shadow-sm">

            <div className="text-center">

              <p className="font-semibold uppercase tracking-widest text-blue-600">

                Contact Information

              </p>

              <h2 className="mt-4 text-5xl font-black text-slate-900">

                Questions About Cookies?

              </h2>

              <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

                If you have questions regarding cookies,
                browser settings,
                privacy
                or our platform,
                our team is happy to help.

              </p>

            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2">

              <ContactCard
                title="General Email"
                value="info@koniqtech.com"
              />

              <ContactCard
                title="Website"
                value="https://koniqtech.com"
              />

              <ContactCard
                title="Business Hours"
                value="Monday – Friday"
              />

              <ContactCard
                title="Typical Response"
                value="Within 1 Business Day"
              />

            </div>

          </div>

        </div>

      </section>

            {/* ====================================================== */}
      {/* COOKIE FAQ */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-5xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-green-600">

              Frequently Asked Questions

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Cookie Policy FAQ

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Answers to the most common questions about cookies,
              privacy and browser settings.

            </p>

          </div>

          <div className="mt-20 space-y-8">

            {cookieFaqs.map((faq) => (

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
      {/* LEGAL NOTICE */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="rounded-[40px] bg-blue-50 p-12">

            <h2 className="text-5xl font-black text-slate-900">

              Legal Notice

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              This Cookie Policy should be read together with our
              Privacy Policy and Terms & Conditions.
              Together these documents explain how KoniqTech
              collects, protects and processes information while
              delivering secure AI-powered CRM services.

            </p>

            <p className="mt-8 text-lg leading-8 text-slate-600">

              Continued use of our website or platform after updates
              to this Cookie Policy constitutes acceptance of the
              revised policy where permitted by applicable law.

            </p>

            <div className="mt-10 flex flex-wrap gap-5">

              <Link
                href="/privacy-policy"
                className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >

                Privacy Policy

              </Link>

              <Link
                href="/terms-and-conditions"
                className="rounded-2xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
              >

                Terms & Conditions

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

          <div className="rounded-[40px] bg-gradient-to-r from-green-600 via-blue-600 to-indigo-700 px-10 py-24 text-center text-white shadow-xl">

            <Cookie className="mx-auto h-16 w-16 text-green-200" />

            <h2 className="mt-8 text-5xl font-black">

              Experience Secure,
              AI-Powered CRM

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">

              KoniqTech is built with security,
              transparency
              and privacy in mind—helping roofing,
              HVAC,
              plumbing
              and landscaping companies grow with confidence.

            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">

              <Link
                href="/register"
                className="rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
              >

                Start Free Trial

              </Link>

              <Link
                href="/demo"
                className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >

                Book Live Demo

              </Link>

            </div>

          </div>

        </div>

      </section>




    </main>
  )
}

function SummaryItem({
  title
}: {
  title: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-800 px-6 py-5">

      <CheckCircle2 className="h-6 w-6 text-green-400" />

      <span className="text-lg text-slate-200">

        {title}

      </span>

    </div>
  )
}

function ContactCard({
  title,
  value
}: {
  title: string
  value: string
}) {
  return (
    <div className="rounded-[32px] border bg-slate-50 p-8 shadow-sm">

      <h3 className="text-2xl font-bold text-slate-900">

        {title}

      </h3>

      <p className="mt-4 text-lg leading-8 text-slate-600 break-all">

        {value}

      </p>

    </div>
  )
}