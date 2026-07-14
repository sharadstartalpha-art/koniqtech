import type { Metadata } from "next"
import Link from "next/link"

import {
  ArrowRight,
  BookOpen,
  FileCode2,
  GraduationCap,
  Layers3,
  Sparkles,
  Workflow,
  ShieldCheck,
  BarChart3,
  CheckCircle2
} from "lucide-react"

export const metadata: Metadata = {
  title: "Documentation | KoniqTech",
  description:
    "Official KoniqTech documentation for CRM, AI platform, APIs, integrations, authentication, billing, mobile apps and developer resources."
}

const stats = [
  {
    value: "150+",
    label: "Documentation Pages"
  },
  {
    value: "40+",
    label: "API Endpoints"
  },
  {
    value: "25+",
    label: "Developer Guides"
  },
  {
    value: "24/7",
    label: "Documentation Access"
  }
]

const categories = [
  {
    icon: GraduationCap,
    title: "Getting Started",
    description:
      "Create your account, configure your organization, invite users and launch your CRM in minutes."
  },
  {
    icon: Layers3,
    title: "CRM Modules",
    description:
      "Complete guides for leads, jobs, dispatching, estimates, invoices, customers, reports and more."
  },
  {
    icon: Sparkles,
    title: "AI Platform",
    description:
      "Learn how to use AI Quotes, Voice AI, AI Dispatch, AI Email Writer and Reporting AI."
  },
  {
    icon: FileCode2,
    title: "Developer APIs",
    description:
      "REST APIs, authentication, webhooks, SDKs and integration examples for developers."
  },
  {
    icon: Workflow,
    title: "Integrations",
    description:
      "Connect PayPal, Resend, Cloudflare R2, calendars, email providers and third-party services."
  },
  {
    icon: ShieldCheck,
    title: "Security",
    description:
      "Authentication, permissions, tenant isolation, compliance and security best practices."
  }
]

const gettingStarted = [
  {
    step: "01",
    title: "Create Your Organization",
    description:
      "Register your company, verify your email address and create your secure KoniqTech workspace."
  },
  {
    step: "02",
    title: "Invite Your Team",
    description:
      "Add managers, technicians, dispatchers, sales representatives and accountants with role-based permissions."
  },
  {
    step: "03",
    title: "Configure Your CRM",
    description:
      "Import customers, create pipelines, configure job workflows and customize company settings."
  },
  {
    step: "04",
    title: "Start Growing",
    description:
      "Manage leads, dispatch jobs, automate workflows and use AI to improve productivity."
  }
]

const authenticationDocs = [
  {
    title: "User Authentication",
    description:
      "Secure login, password management and account verification."
  },
  {
    title: "Organization Management",
    description:
      "Create organizations, invite users and manage permissions."
  },
  {
    title: "Role-Based Access",
    description:
      "Configure secure access for owners, managers, technicians and staff."
  },
  {
    title: "Security Best Practices",
    description:
      "Protect accounts using secure authentication and recommended security settings."
  }
]

const crmModules = [
  "Dashboard",
  "Leads",
  "Customers",
  "Jobs",
  "Scheduling",
  "Dispatch",
  "Estimates",
  "Invoices",
  "Payments",
  "Reports",
  "Inventory",
  "Customer Portal"
]

const aiModules = [
  "AI Quote Generator",
  "Voice AI",
  "Dispatch AI",
  "Sales AI",
  "Reporting AI",
  "AI Email Writer"
]

const apiOverview = [
  {
    title: "REST APIs",
    description:
      "Access CRM data securely using modern REST endpoints."
  },
  {
    title: "Authentication",
    description:
      "Authenticate API requests securely using API credentials."
  },
  {
    title: "Webhooks",
    description:
      "Receive real-time notifications when important events occur."
  },
  {
    title: "Developer Examples",
    description:
      "Ready-to-use examples for integrating with external systems."
  }
]

const integrations = [
  "PayPal Business",
  "Resend Email",
  "Cloudflare R2",
  "Google Calendar",
  "Microsoft Outlook",
  "OpenAI",
  "Webhook Integrations",
  "REST API"
]



const developerResources = [
  {
    icon: FileCode2,
    title: "REST API Reference",
    description:
      "Comprehensive endpoint documentation including authentication, pagination, filtering and response examples."
  },
  {
    icon: Workflow,
    title: "Webhook Events",
    description:
      "Receive real-time notifications whenever important events occur inside your KoniqTech workspace."
  },
  {
    icon: BookOpen,
    title: "Developer Guides",
    description:
      "Step-by-step tutorials for authentication, integrations and production deployments."
  },
  {
    icon: ShieldCheck,
    title: "Security Guides",
    description:
      "Learn authentication, permissions, API security and tenant isolation best practices."
  }
]

const sdkResources = [
  {
    language: "REST API",
    status: "Available"
  },
  {
    language: "JavaScript",
    status: "Coming Soon"
  },
  {
    language: "TypeScript",
    status: "Coming Soon"
  },
  {
    language: "Python",
    status: "Coming Soon"
  },
  {
    language: "PHP",
    status: "Coming Soon"
  },
  {
    language: "C# / .NET",
    status: "Coming Soon"
  }
]

const webhookEvents = [
  "Lead Created",
  "Customer Created",
  "Job Scheduled",
  "Job Completed",
  "Invoice Paid",
  "Estimate Accepted",
  "Subscription Updated",
  "User Added"
]

const codeExamples = [
  {
    title: "Authentication",
    description: "Authenticate securely using API credentials."
  },
  {
    title: "Create Customers",
    description: "Create customers programmatically."
  },
  {
    title: "Manage Jobs",
    description: "Create, update and complete jobs."
  },
  {
    title: "Receive Webhooks",
    description: "Process real-time platform events."
  }
]

const bestPractices = [
  "Use HTTPS for every API request.",
  "Store API credentials securely.",
  "Verify webhook signatures.",
  "Implement retry logic.",
  "Respect API rate limits.",
  "Keep SDKs and integrations updated."
]

const supportResources = [
  {
    title: "Documentation",
    description:
      "Browse detailed implementation guides."
  },
  {
    title: "Developer Support",
    description:
      "Contact our technical team for integration assistance."
  },
  {
    title: "API Status",
    description:
      "Monitor API availability and infrastructure health."
  },
  {
    title: "Release Notes",
    description:
      "Stay informed about new platform features and improvements."
  }
]


const documentationFaqs = [
  {
    question: "How often is the documentation updated?",
    answer:
      "Documentation is updated regularly whenever new CRM features, AI capabilities, APIs or integrations are released."
  },
  {
    question: "Do I need programming experience to use KoniqTech?",
    answer:
      "No. Business users can use KoniqTech without coding, while developers can use our APIs, webhooks and integration guides."
  },
  {
    question: "Are API examples included?",
    answer:
      "Yes. Our documentation includes authentication examples, API requests, webhooks and integration walkthroughs."
  },
  {
    question: "Where can I report documentation issues?",
    answer:
      "Please contact our support team if you find outdated information or would like additional documentation."
  },
  {
    question: "Does KoniqTech provide developer support?",
    answer:
      "Yes. Our technical team can assist with API integrations, authentication and implementation questions."
  },
  {
    question: "Can I request new documentation?",
    answer:
      "Absolutely. We continually expand our documentation based on customer and developer feedback."
  }
]

const trustItems = [
  "Production-ready Documentation",
  "Enterprise Security Guides",
  "Modern REST APIs",
  "Webhook Documentation",
  "AI Platform Guides",
  "Regular Documentation Updates"
]



export default function DocsPage() {
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

                <BookOpen className="h-4 w-4" />

                KoniqTech Documentation

              </div>

              <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">

                Everything You Need

                <span className="block text-blue-600">

                  To Master KoniqTech

                </span>

              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-600">

                Browse official documentation covering CRM modules,
                AI features, APIs, integrations, security,
                deployment guides and developer resources.

              </p>

              <div className="mt-12 flex flex-wrap gap-5">

                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
                >

                  Start Free Trial

                  <ArrowRight className="h-5 w-5" />

                </Link>

                <Link
                  href="/contact"
                  className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
                >

                  Contact Support

                </Link>

              </div>

            </div>

            <div className="rounded-[40px] border bg-white p-8 shadow-2xl">

              <div className="rounded-3xl bg-slate-900 p-8 text-white">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl font-bold">

                    Documentation Center

                  </h3>

                  <BarChart3 className="h-8 w-8 text-blue-400" />

                </div>

                <div className="mt-10 space-y-5">

                  <DashboardMetric
                    title="Guides"
                    value="150+"
                  />

                  <DashboardMetric
                    title="API Reference"
                    value="40+"
                  />

                  <DashboardMetric
                    title="AI Articles"
                    value="25+"
                  />

                  <DashboardMetric
                    title="Updated"
                    value="Daily"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* DOCUMENTATION STATS */}
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
      {/* DOCUMENTATION CATEGORIES */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-green-600">

              Documentation Categories

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Explore Every Part
              Of The Platform

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Whether you're an owner,
              technician,
              administrator
              or developer,
              our documentation helps you get the most
              from KoniqTech.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {categories.map((item) => {

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
      {/* GETTING STARTED */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-green-600">

              Getting Started

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Launch Your CRM
              In Minutes

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Follow these simple steps to set up your
              KoniqTech workspace and start managing
              your field service business.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {gettingStarted.map((item)=>(

              <GettingStartedCard
                key={item.step}
                {...item}
              />

            ))}

          </div>

        </div>

      </section>

            {/* ====================================================== */}
      {/* AUTHENTICATION */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Authentication

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Secure Access
              Documentation

            </h2>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {authenticationDocs.map((item)=>(

              <DocumentationCard
                key={item.title}
                {...item}
              />

            ))}

          </div>

        </div>

      </section>



            {/* ====================================================== */}
      {/* CRM & AI */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-12 lg:grid-cols-2">

            <div className="rounded-[40px] border bg-white p-10 shadow-sm">

              <h2 className="text-4xl font-black text-slate-900">

                CRM Documentation

              </h2>

              <div className="mt-10 space-y-4">

                {crmModules.map((item)=>(

                  <ModuleRow
                    key={item}
                    title={item}
                  />

                ))}

              </div>

            </div>

            <div className="rounded-[40px] border bg-white p-10 shadow-sm">

              <h2 className="text-4xl font-black text-slate-900">

                AI Documentation

              </h2>

              <div className="mt-10 space-y-4">

                {aiModules.map((item)=>(

                  <ModuleRow
                    key={item}
                    title={item}
                  />

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* API & INTEGRATIONS */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-12 lg:grid-cols-2">

            <div>

              <h2 className="text-5xl font-black text-slate-900">

                API Overview

              </h2>

              <div className="mt-12 space-y-8">

                {apiOverview.map((item)=>(

                  <DocumentationCard
                    key={item.title}
                    {...item}
                  />

                ))}

              </div>

            </div>

            <div>

              <h2 className="text-5xl font-black text-slate-900">

                Integrations

              </h2>

              <div className="mt-12 space-y-5">

                {integrations.map((item)=>(

                  <ModuleRow
                    key={item}
                    title={item}
                  />

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>


             {/* ====================================================== */}
      {/* DEVELOPER RESOURCES */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Developer Resources

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Everything Developers Need

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Build powerful integrations using modern APIs,
              webhooks and comprehensive developer documentation.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {developerResources.map((item)=>{

              const Icon=item.icon

              return(

                <div
                  key={item.title}
                  className="rounded-[36px] bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="w-fit rounded-2xl bg-blue-100 p-4">

                    <Icon className="h-8 w-8 text-blue-600"/>

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
      {/* SDKS & WEBHOOKS */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-12 lg:grid-cols-2">

            <div className="rounded-[40px] border bg-white p-10 shadow-sm">

              <h2 className="text-4xl font-black text-slate-900">

                SDKs

              </h2>

              <div className="mt-10 space-y-5">

                {sdkResources.map((sdk)=>(

                  <SDKRow
                    key={sdk.language}
                    {...sdk}
                  />

                ))}

              </div>

            </div>

            <div className="rounded-[40px] border bg-white p-10 shadow-sm">

              <h2 className="text-4xl font-black text-slate-900">

                Webhook Events

              </h2>

              <div className="mt-10 space-y-4">

                {webhookEvents.map((item)=>(

                  <ModuleRow
                    key={item}
                    title={item}
                  />

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* CODE EXAMPLES */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-12 lg:grid-cols-2">

            <div>

              <h2 className="text-5xl font-black text-slate-900">

                Code Examples

              </h2>

              <div className="mt-12 space-y-8">

                {codeExamples.map((item)=>(

                  <DocumentationCard
                    key={item.title}
                    {...item}
                  />

                ))}

              </div>

            </div>

            <div>

              <h2 className="text-5xl font-black text-slate-900">

                Best Practices

              </h2>

              <div className="mt-12 space-y-5">

                {bestPractices.map((item)=>(

                  <ModuleRow
                    key={item}
                    title={item}
                  />

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* SUPPORT RESOURCES */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-green-600">

              Support Resources

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              We're Here To Help

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Whether you're building integrations,
              exploring APIs or deploying your CRM,
              our documentation and support resources are here to help.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {supportResources.map((item)=>(

              <DocumentationCard
                key={item.title}
                {...item}
              />

            ))}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* FAQ */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-5xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Frequently Asked Questions

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Documentation FAQ

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Everything you need to know about our documentation,
              APIs, integrations and developer resources.

            </p>

          </div>

          <div className="mt-20 space-y-8">

            {documentationFaqs.map((faq)=>(

              <FaqCard
                key={faq.question}
                {...faq}
              />

            ))}

          </div>

        </div>

      </section>

            {/* ====================================================== */}
      {/* TRUST */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="rounded-[40px] bg-gradient-to-r from-blue-50 via-white to-green-50 p-12">

            <div className="text-center">

              <ShieldCheck className="mx-auto h-16 w-16 text-green-600"/>

              <h2 className="mt-8 text-5xl font-black text-slate-900">

                Built For Developers
                And Businesses

              </h2>

              <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

                Whether you're integrating APIs,
                building automations or running your
                business,
                KoniqTech provides reliable documentation
                and enterprise-grade guidance.

              </p>

            </div>

            <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {trustItems.map((item)=>(

                <TrustCard
                  key={item}
                  title={item}
                />

              ))}

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* DEVELOPER SUPPORT */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="rounded-[40px] bg-white p-14 text-center shadow-xl">

            <BookOpen className="mx-auto h-16 w-16 text-blue-600"/>

            <h2 className="mt-8 text-5xl font-black text-slate-900">

              Need Technical Help?

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Our documentation covers most scenarios,
              but if you need implementation assistance,
              our team is ready to help.

            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">

              <Link
                href="/contact"
                className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >

                Contact Support

              </Link>

              <Link
                href="/status"
                className="rounded-2xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
              >

                System Status

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

          <div className="rounded-[40px] bg-gradient-to-r from-green-600 via-blue-600 to-orange-500 px-10 py-24 text-center text-white shadow-xl">

            <BookOpen className="mx-auto h-16 w-16 text-white"/>

            <h2 className="mt-8 text-5xl font-black">

              Ready To Build
              With KoniqTech?

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">

              Explore our AI-powered CRM,
              integrate powerful APIs,
              automate your workflows
              and grow your field service business.

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
                className="rounded-2xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
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

function StatCard({
  value,
  label
}: {
  value: string
  label: string
}) {
  return (
    <div className="rounded-[32px] border bg-white p-8 text-center shadow-sm">

      <div className="text-5xl font-black text-blue-600">

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

      <span className="flex items-center gap-2 font-bold text-green-400">

        <CheckCircle2 className="h-5 w-5" />

        {value}

      </span>

    </div>
  )
}

function GettingStartedCard({
  step,
  title,
  description
}:{
  step:string
  title:string
  description:string
}){
  return(

    <div className="rounded-[36px] border bg-white p-10 shadow-sm">

      <div className="text-6xl font-black text-green-600">

        {step}

      </div>

      <h3 className="mt-8 text-3xl font-bold text-slate-900">

        {title}

      </h3>

      <p className="mt-5 leading-8 text-slate-600">

        {description}

      </p>

    </div>

  )
}

function DocumentationCard({
  title,
  description
}:{
  title:string
  description:string
}){
  return(

    <div className="rounded-[32px] border bg-white p-10 shadow-sm">

      <BookOpen className="h-10 w-10 text-blue-600"/>

      <h3 className="mt-8 text-2xl font-bold text-slate-900">

        {title}

      </h3>

      <p className="mt-5 leading-8 text-slate-600">

        {description}

      </p>

    </div>

  )
}

function ModuleRow({
  title
}:{
  title:string
}){

  return(

    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 px-6 py-4">

      <CheckCircle2 className="h-6 w-6 text-green-600"/>

      <span className="font-semibold text-slate-800">

        {title}

      </span>

    </div>

  )

}

function SDKRow({
  language,
  status
}:{
  language:string
  status:string
}){

  const isAvailable=status==="Available"

  return(

    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-6 py-5">

      <span className="font-semibold text-slate-900">

        {language}

      </span>

      <span
        className={`rounded-full px-4 py-2 text-sm font-semibold ${
          isAvailable
            ? "bg-green-100 text-green-700"
            : "bg-orange-100 text-orange-700"
        }`}
      >

        {status}

      </span>

    </div>

  )

}

function FaqCard({
  question,
  answer
}:{
  question:string
  answer:string
}){
  return(

    <div className="rounded-[32px] border bg-white p-10 shadow-sm">

      <h3 className="text-2xl font-bold text-slate-900">

        {question}

      </h3>

      <p className="mt-5 leading-8 text-slate-600">

        {answer}

      </p>

    </div>

  )
}

function TrustCard({
  title
}:{
  title:string
}){

  return(

    <div className="flex items-center gap-4 rounded-[28px] bg-white p-8 shadow-sm">

      <div className="rounded-2xl bg-green-100 p-3">

        <CheckCircle2 className="h-6 w-6 text-green-600"/>

      </div>

      <span className="font-semibold text-slate-800">

        {title}

      </span>

    </div>

  )

}