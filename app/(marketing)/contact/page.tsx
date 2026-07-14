import type { Metadata } from "next"
import Link from "next/link"

import {
  ArrowRight,
  Sparkles,
  Mail,
  Phone,
  Clock3,
  Globe,
  Headphones,
  Users,
  Building2,
  BarChart3,
  CheckCircle2
} from "lucide-react"

import ContactForm from "./components/ContactForm"



export const metadata: Metadata = {
  title: "Contact KoniqTech | Sales, Support & Demo",
  description:
    "Contact KoniqTech for sales, product demos, support, partnerships or general questions. Our team is ready to help your business grow."
}

const stats = [
  {
    value: "<24h",
    label: "Response Time"
  },
  {
    value: "USA + EU",
    label: "Markets Served"
  },
  {
    value: "24/7",
    label: "Email Support"
  },
  {
    value: "100%",
    label: "Business Focus"
  }
]

const contacts = [
  {
    icon: Mail,
    title: "General Enquiries",
    value: "info@koniqtech.com",
    description:
      "Questions about KoniqTech, partnerships or general enquiries.",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Users,
    title: "Sales Team",
    value: "Book A Demo",
    description:
      "Speak with our product specialists to discover the right solution.",
    color: "bg-orange-100 text-orange-600"
  },
  {
    icon: Headphones,
    title: "Customer Support",
    value: "Fast Assistance",
    description:
      "Need help with the platform? Our support team is ready to assist.",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: Globe,
    title: "Business Hours",
    value: "Online Worldwide",
    description:
      "Serving roofing, HVAC, plumbing and landscaping companies globally.",
    color: "bg-purple-100 text-purple-600"
  }
]


const departments = [
  {
    icon: Users,
    title: "Sales Team",
    color: "bg-orange-100 text-orange-600",
    description:
      "Speak with our CRM specialists to discover how KoniqTech can streamline your field service business.",
    email: "sales@koniqtech.com",
    action: "Book A Demo"
  },
  {
    icon: Headphones,
    title: "Customer Support",
    color: "bg-green-100 text-green-600",
    description:
      "Need technical assistance? Our support specialists are here to help you quickly.",
    email: "support@koniqtech.com",
    action: "Get Support"
  },
  {
    icon: Building2,
    title: "Partnerships",
    color: "bg-blue-100 text-blue-600",
    description:
      "Interested in technology partnerships, integrations or business opportunities?",
    email: "info@koniqtech.com",
    action: "Contact Us"
  }
]

const officeInfo = [
  {
    icon: Globe,
    title: "Primary Market",
    value: "USA & Europe"
  },
  {
    icon: Mail,
    title: "General Email",
    value: "info@koniqtech.com"
  },
  {
    icon: Clock3,
    title: "Response Time",
    value: "Within 24 Hours"
  },
  {
    icon: Users,
    title: "Support",
    value: "Online"
  }
]

const faqs = [
  {
    question: "How quickly will I receive a response?",
    answer:
      "Our team normally replies within one business day. Sales enquiries are usually answered much sooner."
  },
  {
    question: "Can I request a personalized demo?",
    answer:
      "Yes. Every demo is customized for your business, industry and workflow."
  },
  {
    question: "Do you support businesses outside the United States?",
    answer:
      "Yes. KoniqTech serves customers across the USA and Europe."
  },
  {
    question: "Can you help migrate data from my existing CRM?",
    answer:
      "Yes. We assist with importing customers, jobs, estimates and other important business information."
  }
]



export default function ContactPage() {
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

                We'd Love To Hear From You

              </div>

              <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">

                Contact

                <span className="block text-orange-500">

                  KoniqTech

                </span>

              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-600">

                Whether you're looking for a product demo,
                have questions about pricing,
                need technical assistance
                or want to explore partnerships,
                our team is here to help.

              </p>

              <div className="mt-12 flex flex-wrap gap-5">

                <Link
                  href="#contact-form"
                  className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
                >

                  Contact Us

                  <ArrowRight className="h-5 w-5" />

                </Link>

                <Link
                  href="/demo"
                  className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
                >

                  Book Demo

                </Link>

              </div>

            </div>

            <div className="rounded-[40px] border bg-white p-8 shadow-2xl">

              <div className="rounded-3xl bg-slate-900 p-8 text-white">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl font-bold">

                    Contact Center

                  </h3>

                  <Building2 className="h-8 w-8 text-orange-400" />

                </div>

                <div className="mt-10 space-y-5">

                  <DashboardMetric
                    title="Sales"
                    value="Online"
                  />

                  <DashboardMetric
                    title="Support"
                    value="<24h"
                  />

                  <DashboardMetric
                    title="Demo"
                    value="Available"
                  />

                  <DashboardMetric
                    title="Email"
                    value="24/7"
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
      {/* CONTACT INFO */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              Get In Touch

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              We're Ready To Help

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Reach the right team quickly for sales,
              product demonstrations,
              technical support
              or general enquiries.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-2">

            {contacts.map((item) => {

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

                  <p className="mt-4 text-xl font-semibold text-orange-600">

                    {item.value}

                  </p>

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
{/* CONTACT FORM */}
{/* ====================================================== */}

<section
  id="contact-form"
  className="py-28"
>

  <div className="mx-auto max-w-5xl px-6">

    <div className="mb-16 text-center">

      <p className="font-semibold uppercase tracking-widest text-blue-600">

        Send Us A Message

      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        We'd Love To Hear From You

      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-slate-600">

        Fill out the form below and our team will get back to you as soon as possible.

      </p>

    </div>

    <ContactForm />

  </div>

</section>



{/* ====================================================== */}
{/* DEPARTMENTS */}
{/* ====================================================== */}

<section className="bg-slate-50 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-blue-600">

        Talk To The Right Team

      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        Sales, Support &
        Partnerships

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-600">

        Whether you're evaluating KoniqTech,
        need technical assistance,
        or want to discuss partnerships,
        we'll connect you with the right specialists.

      </p>

    </div>

    <div className="mt-20 grid gap-8 lg:grid-cols-3">

      {departments.map((item) => {

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

            <p className="mt-6 text-lg font-semibold text-orange-600">

              {item.email}

            </p>

            <Link
              href="#contact-form"
              className="mt-8 inline-flex rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >

              {item.action}

            </Link>

          </div>

        )

      })}

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* OFFICE */}
{/* ====================================================== */}

<section className="py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid gap-10 lg:grid-cols-2">

      <div>

        <p className="font-semibold uppercase tracking-widest text-green-600">

          Office Information

        </p>

        <h2 className="mt-4 text-5xl font-black text-slate-900">

          Serving Businesses
          Worldwide

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-600">

          KoniqTech is a cloud-based platform serving roofing,
          HVAC,
          plumbing,
          landscaping
          and other field service companies throughout the USA and Europe.

        </p>

      </div>

      <div className="grid gap-6 sm:grid-cols-2">

        {officeInfo.map((item) => {

          const Icon = item.icon

          return (

            <div
              key={item.title}
              className="rounded-[32px] border bg-white p-8 shadow-sm"
            >

              <div className="w-fit rounded-2xl bg-green-100 p-4">

                <Icon className="h-8 w-8 text-green-600" />

              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">

                {item.title}

              </h3>

              <p className="mt-4 text-slate-600">

                {item.value}

              </p>

            </div>

          )

        })}

      </div>

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

        Questions?
        We've Got Answers.

      </h2>

    </div>

    <div className="mt-20 space-y-8">

      {faqs.map((faq) => (

        <div
          key={faq.question}
          className="rounded-[32px] bg-white p-10 shadow-sm"
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

            Why Businesses Trust KoniqTech

          </p>

          <h2 className="mt-6 text-5xl font-black">

            Built For Modern
            Field Service Companies

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">

            KoniqTech is designed specifically for roofing,
            HVAC,
            plumbing,
            landscaping
            and field service businesses looking to simplify operations,
            improve customer satisfaction
            and grow faster with AI-powered automation.

          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">

            <div className="rounded-[32px] bg-white/10 p-8 backdrop-blur">

              <CheckCircle2 className="mx-auto h-10 w-10 text-green-300" />

              <h3 className="mt-5 text-2xl font-bold">

                AI-Powered CRM

              </h3>

              <p className="mt-4 text-blue-100">

                Intelligent automation across your entire business.

              </p>

            </div>

            <div className="rounded-[32px] bg-white/10 p-8 backdrop-blur">

              <CheckCircle2 className="mx-auto h-10 w-10 text-green-300" />

              <h3 className="mt-5 text-2xl font-bold">

                Secure Cloud Platform

              </h3>

              <p className="mt-4 text-blue-100">

                Enterprise-grade security with tenant isolation.

              </p>

            </div>

            <div className="rounded-[32px] bg-white/10 p-8 backdrop-blur">

              <CheckCircle2 className="mx-auto h-10 w-10 text-green-300" />

              <h3 className="mt-5 text-2xl font-bold">

                Industry Focused

              </h3>

              <p className="mt-4 text-blue-100">

                Built specifically for field service businesses.

              </p>

            </div>

          </div>

        </div>

      </section>



            {/* ====================================================== */}
      {/* RESPONSE TIME */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="rounded-[40px] border bg-white p-12 shadow-xl">

            <div className="grid gap-10 lg:grid-cols-2">

              <div>

                <p className="font-semibold uppercase tracking-widest text-green-600">

                  Fast Response

                </p>

                <h2 className="mt-4 text-5xl font-black text-slate-900">

                  We Respond
                  Quickly

                </h2>

                <p className="mt-8 text-xl leading-9 text-slate-600">

                  Every enquiry is reviewed by our team.
                  Whether you're interested in a demo,
                  pricing,
                  support
                  or partnerships,
                  we'll connect you with the right specialist.

                </p>

              </div>

              <div className="grid gap-6 sm:grid-cols-2">

                <StatCard
                  value="<24h"
                  label="Email Response"
                />

                <StatCard
                  value="7 Days"
                  label="Free Trial"
                />

                <StatCard
                  value="30 Min"
                  label="Live Demo"
                />

                <StatCard
                  value="USA & EU"
                  label="Target Market"
                />

              </div>

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* CONTACT CTA */}
      {/* ====================================================== */}

      <section className="pb-28">

        <div className="mx-auto max-w-5xl px-6">

          <div className="rounded-[40px] bg-orange-500 px-10 py-20 text-center text-white shadow-xl">

            <Mail className="mx-auto h-14 w-14" />

            <h2 className="mt-8 text-5xl font-black">

              Have Questions?

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-orange-100">

              Send us a message today and our team will respond
              as quickly as possible.

            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">

              <Link
                href="#contact-form"
                className="rounded-2xl bg-white px-8 py-4 font-semibold text-orange-600 transition hover:bg-orange-50"
              >

                Send Message

              </Link>

              <Link
                href="/demo"
                className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >

                Book Demo

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

              Ready To Grow
              Your Business?

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-green-50">

              Join businesses using KoniqTech to manage customers,
              automate workflows,
              schedule technicians
              and deliver outstanding customer experiences.

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

      <span className="text-2xl font-bold text-orange-400">

        {value}

      </span>

    </div>
  )
}