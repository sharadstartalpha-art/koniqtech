
"use client"
import Link from "next/link"
import { useState } from "react"

import {
  
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  Building2,
  Star,
   Home,
  Thermometer,
  Droplets,
  Trees,
  Briefcase,
  ArrowRight
} from "lucide-react"



const plans = [
  {
    name: "Starter",
    monthly: 99,
    yearly: 79,
    description:
      "Perfect for small service businesses.",
    color: "gray",
    button: "Start Free Trial",
    features: [
      "Up to 5 Employees",
      "Unlimited Customers",
      "Unlimited Leads",
      "Scheduling",
      "Job Management",
      "Invoices",
      "Reports",
      "Mobile App",
      "Email Support"
    ]
  },
  {
    name: "Professional",
    monthly: 199,
    yearly: 159,
    popular: true,
    description:
      "Best choice for growing companies.",
    color: "orange",
    button: "Start Free Trial",
    features: [
      "Everything in Starter",
      "Unlimited Employees",
      "Dispatch Center",
      "Inventory",
      "Fleet",
      "AI Assistant",
      "AI Quotes",
      "SMS Automation",
      "Customer Portal",
      "Priority Support"
    ]
  },
  {
    name: "Enterprise",
    monthly: null,
    yearly: null,
    description:
      "For multi-location organizations.",
    color: "blue",
    button: "Contact Sales",
    features: [
      "Everything in Professional",
      "Multiple Branches",
      "White Label",
      "Dedicated Success Manager",
      "Custom Integrations",
      "Advanced Permissions",
      "Enterprise SLA",
      "SSO",
      "Custom Onboarding"
    ]
  }
]


const comparisonRows = [
  {
    category: "CRM",
    items: [
      ["Lead Management", true, true, true],
      ["Customer CRM", true, true, true],
      ["Estimates", true, true, true],
      ["Quotes", true, true, true],
      ["Contracts", true, true, true],
      ["Sales Pipeline", true, true, true],
    ]
  },
  {
    category: "Operations",
    items: [
      ["Scheduling", true, true, true],
      ["Dispatch Center", false, true, true],
      ["Job Management", true, true, true],
      ["Inventory", false, true, true],
      ["Fleet Management", false, true, true],
      ["Employee Management", false, true, true],
    ]
  },
  {
    category: "Artificial Intelligence",
    items: [
      ["AI Assistant", false, true, true],
      ["AI Quote Generator", false, true, true],
      ["Voice AI", false, true, true],
      ["Predictive Analytics", false, true, true],
      ["AI Reports", false, true, true],
      ["Workflow Automation", false, true, true],
    ]
  },
  {
    category: "Customer Experience",
    items: [
      ["Customer Portal", false, true, true],
      ["Mobile App", true, true, true],
      ["SMS Automation", false, true, true],
      ["Email Campaigns", false, true, true],
      ["Online Payments", true, true, true],
      ["Digital Signatures", true, true, true],
    ]
  },
  {
    category: "Integrations",
    items: [
      ["Google Calendar", true, true, true],
      ["PayPal", true, true, true],
      ["Stripe", true, true, true],
      ["QuickBooks", false, true, true],
      ["OpenAI", false, true, true],
      ["REST API", false, true, true],
    ]
  },
  {
    category: "Support",
    items: [
      ["Email Support", true, true, true],
      ["Priority Support", false, true, true],
      ["Dedicated Success Manager", false, false, true],
      ["White Label", false, false, true],
      ["Custom Integrations", false, false, true],
      ["SLA", false, false, true],
    ]
  }
]


const industryPlans = [
  {
    icon: Home,
    title: "Roofing CRM",
    description:
      "Built for residential and commercial roofing companies.",
    price: "From $199/mo",
    features: [
      "Roof Measurements",
      "Insurance Workflow",
      "Material Tracking",
      "Crew Scheduling",
      "Progress Photos"
    ]
  },
  {
    icon: Thermometer,
    title: "HVAC CRM",
    description:
      "Manage installations, maintenance and service agreements.",
    price: "From $199/mo",
    features: [
      "Equipment History",
      "Maintenance Plans",
      "Warranty Tracking",
      "Recurring Service",
      "Technician Dispatch"
    ]
  },
  {
    icon: Droplets,
    title: "Plumbing CRM",
    description:
      "Streamline plumbing service operations from lead to payment.",
    price: "From $199/mo",
    features: [
      "Emergency Dispatch",
      "Parts Tracking",
      "Job History",
      "Photo Uploads",
      "Digital Signatures"
    ]
  },
  {
    icon: Trees,
    title: "Landscaping CRM",
    description:
      "Manage recurring maintenance, seasonal work and crews.",
    price: "From $199/mo",
    features: [
      "Recurring Visits",
      "Route Optimization",
      "Property Management",
      "Equipment Tracking",
      "Seasonal Scheduling"
    ]
  }
]

const addons = [
  {
    title: "AI Voice Agent",
    description: "24/7 AI receptionist that answers calls and books appointments.",
    price: "Custom"
  },
  {
    title: "SMS Credits",
    description: "Pay only for the SMS messages you send.",
    price: "Usage Based"
  },
  {
    title: "Email Campaigns",
    description: "Bulk marketing emails with analytics.",
    price: "Included / Scalable"
  },
  {
    title: "Additional Storage",
    description: "Expand document and image storage.",
    price: "Flexible"
  },
  {
    title: "Custom Integrations",
    description: "Connect KoniqTech with your existing software.",
    price: "Quote"
  },
  {
    title: "White Label",
    description: "Brand the platform with your own company identity.",
    price: "Enterprise"
  }
]

const enterpriseServices = [
  "Dedicated Success Manager",
  "Migration Assistance",
  "Data Import",
  "Custom API Development",
  "Single Sign-On (SSO)",
  "Priority SLA Support",
  "Private Onboarding",
  "Security Review",
  "Custom Training",
  "Enterprise Billing",
  "Advanced Reporting",
  "Multi-location Deployment"
]


const pricingFaq = [
  {
    question: "Is there a free trial?",
    answer:
      "Yes. Every new account can start with a free trial so you can explore KoniqTech before subscribing."
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. There are no long-term contracts. You can cancel your subscription at any time."
  },
  {
    question: "Can I change plans later?",
    answer:
      "Absolutely. Upgrade or downgrade your subscription whenever your business needs change."
  },
  {
    question: "Are software updates included?",
    answer:
      "Yes. All plans receive product improvements, security updates and new features."
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes. Annual billing provides discounted pricing compared to monthly billing."
  },
  {
    question: "Can I use KoniqTech on mobile devices?",
    answer:
      "Yes. Technicians and office staff can securely access KoniqTech from supported mobile devices."
  }
]

const migrationFeatures = [
  "CSV Customer Import",
  "Lead Import",
  "Invoice Import",
  "Job Import",
  "Employee Import",
  "Document Upload",
  "Training Sessions",
  "Onboarding Assistance"
]

const securityItems = [
  "Encrypted Data",
  "TLS/HTTPS",
  "Role-Based Access",
  "Audit Logs",
  "Daily Backups",
  "Multi-Tenant Isolation",
  "Secure Authentication",
  "Continuous Monitoring"
]



const testimonials = [
  {
    name: "Customer Name",
    company: "Roofing Company",
    text:
      "Replace this placeholder with a real customer testimonial after onboarding your first client.",
    rating: 5
  },
  {
    name: "Customer Name",
    company: "HVAC Contractor",
    text:
      "Describe measurable improvements such as faster scheduling, better dispatch or higher customer satisfaction.",
    rating: 5
  },
  {
    name: "Customer Name",
    company: "Plumbing Business",
    text:
      "Highlight real business outcomes once you have customer permission to publish them.",
    rating: 5
  }
]

const salesBenefits = [
  "Free Product Demo",
  "Implementation Guidance",
  "Migration Assistance",
  "Personalized Pricing",
  "Custom Integrations",
  "Enterprise Consultation"
]

export default function PricingPage() {

  const [annual,setAnnual] = useState(false)

  return (

    <main className="bg-white">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-blue-50" />

        <div className="relative mx-auto max-w-7xl px-6 py-24">

          <div className="mx-auto max-w-3xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2 text-orange-600">

              <Sparkles className="h-4 w-4"/>

              Simple Pricing

            </div>

            <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">

              Pricing That
              <span className="block text-orange-500">

                Grows With You

              </span>

            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Everything you need to manage leads,
              dispatch technicians, automate work,
              invoice customers and grow your field
              service business.

            </p>

          </div>

          {/* Toggle */}

          <div className="mt-16 flex justify-center">

            <div className="flex items-center rounded-full border bg-white p-2 shadow-sm">

              <button
                onClick={()=>setAnnual(false)}
                className={`rounded-full px-6 py-3 font-semibold transition ${
                  !annual
                    ? "bg-orange-500 text-white"
                    : "text-slate-600"
                }`}
              >

                Monthly

              </button>

              <button
                onClick={()=>setAnnual(true)}
                className={`rounded-full px-6 py-3 font-semibold transition ${
                  annual
                    ? "bg-orange-500 text-white"
                    : "text-slate-600"
                }`}
              >

                Annual

                <span className="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">

                  Save 20%

                </span>

              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* PRICING CARDS */}
      {/* ====================================================== */}

      <section className="pb-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-10 lg:grid-cols-3">

            {plans.map(plan=>(

              <PricingCard
                key={plan.name}
                annual={annual}
                {...plan}
              />

            ))}

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* TRUST */}
      {/* ====================================================== */}

      <section className="border-t border-b bg-slate-50">

        <div className="mx-auto max-w-7xl px-6 py-10">

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

            <TrustItem
              icon={ShieldCheck}
              title="Enterprise Security"
            />

            <TrustItem
              icon={BadgeCheck}
              title="99.9% Uptime"
            />

            <TrustItem
              icon={Building2}
              title="Built For Contractors"
            />

            <TrustItem
              icon={Star}
              title="Premium Support"
            />

          </div>

        </div>

      </section>


{/* ====================================================== */}
{/* FEATURE COMPARISON */}
{/* ====================================================== */}

<section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        Compare Plans

      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        Choose The Plan
        <br />

        That's Right For You

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-600">

        Every plan includes unlimited customers,
        secure cloud hosting and continuous updates.

      </p>

    </div>

    <div className="mt-20 overflow-x-auto rounded-[32px] border shadow-sm">

      <table className="min-w-full bg-white">

        <thead className="bg-slate-900 text-white">

          <tr>

            <th className="px-8 py-6 text-left">

              Features

            </th>

            <th className="px-6 py-6 text-center">

              Starter

            </th>

            <th className="bg-orange-500 px-6 py-6 text-center">

              Professional

            </th>

            <th className="px-6 py-6 text-center">

              Enterprise

            </th>

          </tr>

        </thead>

        <tbody>

          {comparisonRows.map((group)=>(

            <ComparisonCategory
              key={group.category}
              category={group.category}
              items={group.items}
            />

          ))}

        </tbody>

      </table>

    </div>

  </div>

</section>

{/* ====================================================== */}
{/* INCLUDED */}
{/* ====================================================== */}

<section className="bg-slate-50 py-24">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        Included With Every Plan

      </p>

      <h2 className="mt-4 text-5xl font-black">

        Every Subscription Includes

      </h2>

    </div>

    <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

      <IncludedCard title="Unlimited Customers" />

      <IncludedCard title="Cloud Hosting" />

      <IncludedCard title="Daily Backups" />

      <IncludedCard title="Free Updates" />

      <IncludedCard title="SSL Security" />

      <IncludedCard title="Role Permissions" />

      <IncludedCard title="Multi-Tenant Platform" />

      <IncludedCard title="Mobile Access" />

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* INDUSTRY SOLUTIONS */}
{/* ====================================================== */}

<section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        Industry Solutions

      </p>

      <h2 className="mt-4 text-5xl font-black">

        Built For Your Industry

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-600">

        Every industry includes specialized workflows,
        reports and automation tailored to the way your
        business operates.

      </p>

    </div>

    <div className="mt-20 grid gap-8 md:grid-cols-2">

      {industryPlans.map((plan)=>{

        const Icon = plan.icon

        return(

          <div
            key={plan.title}
            className="rounded-[36px] border bg-slate-50 p-10 transition hover:-translate-y-2 hover:shadow-xl"
          >

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-orange-100 p-4">

                <Icon className="h-8 w-8 text-orange-500"/>

              </div>

              <div>

                <h3 className="text-3xl font-bold">

                  {plan.title}

                </h3>

                <p className="mt-2 text-orange-500 font-semibold">

                  {plan.price}

                </p>

              </div>

            </div>

            <p className="mt-6 text-slate-600 leading-8">

              {plan.description}

            </p>

            <div className="mt-8 space-y-3">

              {plan.features.map((feature)=>(

                <div
                  key={feature}
                  className="flex items-center gap-3"
                >

                  <CheckCircle2 className="h-5 w-5 text-green-600"/>

                  <span>{feature}</span>

                </div>

              ))}

            </div>

          </div>

        )

      })}

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* ADD-ONS */}
{/* ====================================================== */}

<section className="bg-slate-50 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        Optional Add-ons

      </p>

      <h2 className="mt-4 text-5xl font-black">

        Expand As You Grow

      </h2>

    </div>

    <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

      {addons.map((addon)=>(

        <div
          key={addon.title}
          className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-lg"
        >

          <Briefcase className="h-10 w-10 text-orange-500"/>

          <h3 className="mt-6 text-2xl font-bold">

            {addon.title}

          </h3>

          <p className="mt-5 leading-8 text-slate-600">

            {addon.description}

          </p>

          <div className="mt-8 inline-flex rounded-full bg-orange-100 px-4 py-2 font-semibold text-orange-600">

            {addon.price}

          </div>

        </div>

      ))}

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* ENTERPRISE SERVICES */}
{/* ====================================================== */}

<section className="bg-slate-900 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid items-center gap-20 lg:grid-cols-2">

      <div>

        <p className="font-semibold uppercase tracking-widest text-orange-400">

          Enterprise Services

        </p>

        <h2 className="mt-4 text-5xl font-black text-white">

          More Than
          <br />

          Software

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-300">

          Our enterprise team helps you deploy,
          migrate and scale KoniqTech across
          your organization.

        </p>

      </div>

      <div className="rounded-[36px] bg-slate-800 p-10">

        <div className="grid gap-5">

          {enterpriseServices.map((service)=>(

            <div
              key={service}
              className="flex items-center gap-4 rounded-2xl bg-slate-700 p-5"
            >

              <CheckCircle2 className="h-5 w-5 text-green-400"/>

              <span className="text-slate-200">

                {service}

              </span>

            </div>

          ))}

        </div>

        <Link
          href="/contact"
          className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
        >

          Contact Enterprise Sales

          <ArrowRight className="h-5 w-5"/>

        </Link>

      </div>

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* FAQ */}
{/* ====================================================== */}

<section className="bg-white py-28">

  <div className="mx-auto max-w-5xl px-6">

    <div className="text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        Frequently Asked Questions

      </p>

      <h2 className="mt-4 text-5xl font-black">

        Everything You Need
        <br />

        Before Getting Started

      </h2>

    </div>

    <div className="mt-20 space-y-6">

      {pricingFaq.map((faq)=>(

        <FaqCard
          key={faq.question}
          question={faq.question}
          answer={faq.answer}
        />

      ))}

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* BILLING & MIGRATION */}
{/* ====================================================== */}

<section className="bg-slate-50 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid gap-10 lg:grid-cols-2">

      <div className="rounded-[36px] bg-white p-10 shadow-sm">

        <h3 className="text-3xl font-bold">

          Billing

        </h3>

        <div className="mt-10 space-y-5">

          <BillingRow title="Monthly Billing" />

          <BillingRow title="Annual Billing Discount" />

          <BillingRow title="Upgrade Anytime" />

          <BillingRow title="Downgrade Anytime" />

          <BillingRow title="Online Payments" />

          <BillingRow title="Automatic Renewal" />

          <BillingRow title="Invoice History" />

        </div>

      </div>

      <div className="rounded-[36px] bg-white p-10 shadow-sm">

        <h3 className="text-3xl font-bold">

          Migration

        </h3>

        <div className="mt-10 space-y-5">

          {migrationFeatures.map((item)=>(

            <div
              key={item}
              className="flex items-center gap-3"
            >

              <CheckCircle2 className="h-5 w-5 text-green-600"/>

              <span>{item}</span>

            </div>

          ))}

        </div>

      </div>

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* SECURITY */}
{/* ====================================================== */}

<section className="bg-slate-900 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid items-center gap-20 lg:grid-cols-2">

      <div>

        <p className="font-semibold uppercase tracking-widest text-orange-400">

          Security

        </p>

        <h2 className="mt-4 text-5xl font-black text-white">

          Your Data
          <br />

          Matters

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-300">

          KoniqTech is designed with security,
          tenant isolation and controlled access
          to help protect your business data.

        </p>

      </div>

      <div className="grid gap-5">

        {securityItems.map((item)=>(

          <div
            key={item}
            className="flex items-center gap-4 rounded-2xl bg-slate-800 p-5"
          >

            <ShieldCheck className="h-6 w-6 text-green-400"/>

            <span className="text-slate-200">

              {item}

            </span>

          </div>

        ))}

      </div>

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* TESTIMONIALS */}
{/* ====================================================== */}

<section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-orange-500">

        Customer Feedback

      </p>

      <h2 className="mt-4 text-5xl font-black">

        Hear From
        <br />

        Growing Businesses

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-600">

        Replace these sample testimonials with
        real customer stories as you grow.

      </p>

    </div>

    <div className="mt-20 grid gap-8 lg:grid-cols-3">

      {testimonials.map((item)=>(

        <TestimonialCard
          key={item.company}
          {...item}
        />

      ))}

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* CONTACT SALES */}
{/* ====================================================== */}

<section className="bg-slate-50 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid items-center gap-16 lg:grid-cols-2">

      <div>

        <p className="font-semibold uppercase tracking-widest text-orange-500">

          Enterprise Sales

        </p>

        <h2 className="mt-4 text-5xl font-black">

          Need Something
          <br />

          More?

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-600">

          Talk with our team about enterprise
          deployments, custom integrations,
          onboarding and tailored pricing.

        </p>

        <div className="mt-10 space-y-4">

          {salesBenefits.map((item)=>(

            <div
              key={item}
              className="flex items-center gap-3"
            >

              <CheckCircle2 className="h-5 w-5 text-green-600"/>

              <span>{item}</span>

            </div>

          ))}

        </div>

      </div>

      <div className="rounded-[36px] bg-white p-10 shadow-xl">

        <h3 className="text-3xl font-bold">

          Talk To Sales

        </h3>

        <p className="mt-4 text-slate-600">

          We'll help you choose the right
          solution for your business.

        </p>

        <div className="mt-10 space-y-4">

          <Link
            href="/demo"
            className="flex h-14 items-center justify-center rounded-2xl bg-orange-500 font-semibold text-white transition hover:bg-orange-600"
          >

            Schedule Demo

          </Link>

          <Link
            href="/contact"
            className="flex h-14 items-center justify-center rounded-2xl border border-slate-300 font-semibold transition hover:bg-slate-50"
          >

            Contact Sales

          </Link>

          <Link
            href="/register"
            className="flex h-14 items-center justify-center rounded-2xl bg-slate-900 font-semibold text-white transition hover:bg-black"
          >

            Start Free Trial

          </Link>

        </div>

      </div>

    </div>

  </div>

</section>



{/* ====================================================== */}
{/* FINAL CTA */}
{/* ====================================================== */}

<section className="bg-gradient-to-r from-orange-500 to-orange-600 py-28">

  <div className="mx-auto max-w-5xl px-6 text-center text-white">

    <h2 className="text-6xl font-black leading-tight">

      Ready To Grow
      <br />

      Your Service Business?

    </h2>

    <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-orange-100">

      Start your free trial and discover how
      KoniqTech helps manage customers,
      scheduling, dispatch, AI automation,
      invoicing and business growth.

    </p>

    <div className="mt-12 flex flex-wrap justify-center gap-6">

      <Link
        href="/register"
        className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-orange-600 transition hover:bg-orange-100"
      >

        Start Free Trial

        <ArrowRight className="h-5 w-5"/>

      </Link>

      <Link
        href="/demo"
        className="rounded-2xl border border-white/40 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
      >

        Book Demo

      </Link>

    </div>

    <div className="mt-10 flex flex-wrap justify-center gap-8 text-orange-100">

      <span>✓ Free Trial</span>

      <span>✓ Cancel Anytime</span>

      <span>✓ Secure Cloud Platform</span>

      <span>✓ Built For Contractors</span>

    </div>

  </div>

</section>




    </main>

  )

}

function PricingCard({
  annual,
  name,
  monthly,
  yearly,
  description,
  features,
  button,
  popular=false
}:any){

  const price =
    annual
      ? yearly
      : monthly

  return(

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

      {popular &&(

        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white">

          MOST POPULAR

        </div>

      )}

      <h2 className="text-3xl font-bold">

        {name}

      </h2>

      <p className="mt-5 text-slate-600">

        {description}

      </p>

      <div className="mt-8">

        {price ? (

          <>

            <span className="text-6xl font-black">

              ${price}

            </span>

            <span className="ml-2 text-slate-500">

              /month

            </span>

          </>

        ):(
          <span className="text-5xl font-black">

            Custom

          </span>
        )}

      </div>

      <button className="mt-10 w-full rounded-2xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600">

        {button}

      </button>

      <div className="mt-10 space-y-5">

        {features.map((item:string)=>(

          <div
            key={item}
            className="flex items-center gap-3"
          >

            <CheckCircle2 className="h-5 w-5 text-green-600"/>

            <span>

              {item}

            </span>

          </div>

        ))}

      </div>

    </div>

  )

}

function TrustItem({
  icon:Icon,
  title
}:any){

  return(

    <div className="flex items-center gap-4">

      <div className="rounded-2xl bg-orange-100 p-4">

        <Icon className="h-6 w-6 text-orange-500"/>

      </div>

      <span className="text-lg font-semibold text-slate-700">

        {title}

      </span>

    </div>

  )

}

function ComparisonCategory({
  category,
  items
}:{
  category:string
  items:any[]
}){

  return(

    <>

      <tr className="bg-slate-100">

        <td
          colSpan={4}
          className="px-8 py-4 text-lg font-bold text-slate-900"
        >

          {category}

        </td>

      </tr>

      {items.map(([name,starter,pro,enterprise])=>(

        <tr
          key={name}
          className="border-t"
        >

          <td className="px-8 py-5 font-medium">

            {name}

          </td>

          <ComparisonCell enabled={starter} />

          <ComparisonCell enabled={pro} />

          <ComparisonCell enabled={enterprise} />

        </tr>

      ))}

    </>

  )

}

function ComparisonCell({
  enabled
}:{
  enabled:boolean
}){

  return(

    <td className="text-center">

      {enabled ? (

        <CheckCircle2
          className="mx-auto h-6 w-6 text-green-600"
        />

      ) : (

        <span className="text-slate-300 text-2xl">

          —

        </span>

      )}

    </td>

  )

}

function IncludedCard({
  title
}:{
  title:string
}){

  return(

    <div className="rounded-3xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-lg">

      <CheckCircle2 className="mx-auto h-10 w-10 text-green-600"/>

      <h3 className="mt-6 text-xl font-bold text-slate-900">

        {title}

      </h3>

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

    <div className="rounded-3xl border bg-slate-50 p-8">

      <h3 className="text-2xl font-bold text-slate-900">

        {question}

      </h3>

      <p className="mt-5 leading-8 text-slate-600">

        {answer}

      </p>

    </div>

  )

}

function BillingRow({
  title
}:{
  title:string
}){

  return(

    <div className="flex items-center gap-3">

      <CheckCircle2 className="h-5 w-5 text-green-600"/>

      <span className="text-slate-700">

        {title}

      </span>

    </div>

  )

}


function TestimonialCard({
  name,
  company,
  text,
  rating
}:{
  name:string
  company:string
  text:string
  rating:number
}){

  return(

    <div className="rounded-[36px] border bg-slate-50 p-10 transition hover:-translate-y-2 hover:shadow-xl">

      <div className="flex gap-1">

        {Array.from({length:rating}).map((_,i)=>(

          <Star
            key={i}
            className="h-5 w-5 fill-yellow-400 text-yellow-400"
          />

        ))}

      </div>

      <p className="mt-8 leading-8 text-slate-600">

        "{text}"

      </p>

      <div className="mt-10">

        <h4 className="text-xl font-bold">

          {name}

        </h4>

        <p className="text-slate-500">

          {company}

        </p>

      </div>

    </div>

  )

}