import type { Metadata } from "next"
import Link from "next/link"

import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Trees,
  ClipboardCheck,
  Users,
  BarChart3,
  Leaf,
  Wrench,
  Brain,
  Bot,
  Cpu,
  Workflow,
  Smartphone,
  Calendar,
  MessageSquare,
  Mic,
  Bell,
  Plug
} from "lucide-react"

export const metadata: Metadata = {
  title: "Landscaping CRM Software | KoniqTech",
  description:
    "Landscaping CRM software for lawn care, landscape design and maintenance companies. Manage scheduling, crews, estimates, recurring maintenance, invoicing and AI automation."
}

const stats = [
  {
    value: "25K+",
    label: "Jobs Completed"
  },
  {
    value: "96%",
    label: "Customer Retention"
  },
  {
    value: "365",
    label: "Recurring Services"
  },
  {
    value: "AI",
    label: "Route Optimization"
  }
]

const benefits = [
  {
    icon: Trees,
    title: "Landscape Project Management",
    description:
      "Manage landscape installations, hardscaping, irrigation projects and seasonal work from one platform."
  },
  {
    icon: ClipboardCheck,
    title: "Recurring Maintenance",
    description:
      "Automate lawn mowing, fertilization, pruning, irrigation inspections and seasonal maintenance schedules."
  },
  {
    icon: Users,
    title: "Crew Scheduling",
    description:
      "Assign landscaping crews based on availability, equipment and service locations."
  },
  {
    icon: Leaf,
    title: "Property Management",
    description:
      "Maintain complete property history including plant inventory, irrigation systems and maintenance records."
  }
]


const workflowSteps = [
  {
    step: "01",
    title: "Customer Inquiry",
    description:
      "Capture new landscaping requests from your website, phone calls, referrals and marketing campaigns."
  },
  {
    step: "02",
    title: "Property Assessment",
    description:
      "Schedule an on-site visit, inspect the property, capture measurements, photos and customer requirements."
  },
  {
    step: "03",
    title: "Estimate & Proposal",
    description:
      "Create professional estimates with labor, materials, recurring maintenance plans and optional upgrades."
  },
  {
    step: "04",
    title: "Crew Scheduling",
    description:
      "Assign landscaping crews, equipment and vehicles based on availability and project timelines."
  },
  {
    step: "05",
    title: "Project & Maintenance",
    description:
      "Track installations, irrigation work, lawn care, tree services and recurring maintenance schedules."
  },
  {
    step: "06",
    title: "Invoice & Payment",
    description:
      "Generate invoices, accept online payments and automatically update customer records."
  }
]

const workflowBenefits = [
  "Recurring Maintenance",
  "Crew Scheduling",
  "Property Records",
  "GPS Route Optimization",
  "Equipment Tracking",
  "Digital Estimates",
  "Customer Notifications",
  "Online Payments"
]

const landscapingFeatures = [
  {
    icon: Leaf,
    title: "Lawn Care Management",
    description:
      "Manage lawn mowing, fertilization, weed control, aeration and seasonal lawn care services from one platform."
  },
  {
    icon: Trees,
    title: "Landscape & Irrigation",
    description:
      "Track landscape installations, irrigation systems, hardscaping projects and ongoing maintenance."
  },
  {
    icon: Wrench,
    title: "Equipment Management",
    description:
      "Monitor mowers, trimmers, blowers, trailers and landscaping equipment including maintenance schedules."
  },
  {
    icon: BarChart3,
    title: "Inventory Management",
    description:
      "Track plants, mulch, fertilizer, irrigation supplies, tools and warehouse inventory in real time."
  },
  {
    icon: Users,
    title: "Customer Portal",
    description:
      "Allow customers to approve estimates, schedule recurring services, review invoices and communicate online."
  },
  {
    icon: CheckCircle2,
    title: "Digital Work Orders",
    description:
      "Create digital job sheets, upload before-and-after photos, capture signatures and complete work in the field."
  }
]

const operations = [
  {
    title: "Today's Jobs",
    value: "58"
  },
  {
    title: "Active Crews",
    value: "14"
  },
  {
    title: "Recurring Services",
    value: "312"
  },
  {
    title: "Equipment In Use",
    value: "41"
  },
  {
    title: "Customer Satisfaction",
    value: "97%"
  },
  {
    title: "Projects Completed",
    value: "1,842"
  }
]


const aiFeatures = [
  {
    icon: Bot,
    title: "AI Landscaping Assistant",
    description:
      "Answer customer questions, schedule recurring lawn care visits and assist office staff with daily operations."
  },
  {
    icon: Brain,
    title: "AI Route Optimization",
    description:
      "Optimize crew routes automatically to reduce travel time, fuel costs and increase daily job capacity."
  },
  {
    icon: Cpu,
    title: "Predictive Maintenance",
    description:
      "Identify irrigation systems, landscaping equipment and customer properties that require preventive maintenance."
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Automatically assign crews, send reminders, generate invoices and keep customers informed throughout every project."
  }
]

const mobileFeatures = [
  "Today's Schedule",
  "GPS Navigation",
  "Property Information",
  "Crew Assignments",
  "Before & After Photos",
  "Video Uploads",
  "Equipment Tracking",
  "Offline Mode",
  "Digital Signatures",
  "Estimate Creation",
  "Invoice Generation",
  "Real-Time Sync"
]

const integrations = [
  "Google Calendar",
  "Google Maps",
  "QuickBooks",
  "PayPal",
  "Stripe",
  "OpenAI",
  "Twilio",
  "Resend",
  "AWS S3",
  "Cloudflare R2"
]

const landscapingFaq = [
  {
    question: "Can KoniqTech manage both residential and commercial landscaping companies?",
    answer:
      "Yes. KoniqTech supports residential lawn care, commercial landscaping, irrigation services, tree care, seasonal maintenance and large landscape installation projects."
  },
  {
    question: "Can recurring lawn maintenance be automated?",
    answer:
      "Yes. Schedule recurring mowing, fertilization, irrigation inspections, pruning and seasonal services automatically."
  },
  {
    question: "Can landscaping crews use the mobile app?",
    answer:
      "Yes. Crew members can access work orders, customer information, navigation, upload photos, capture signatures and complete jobs directly from the mobile app."
  },
  {
    question: "Can customers approve estimates online?",
    answer:
      "Yes. Customers can review estimates, approve projects, track appointments, pay invoices and communicate through the customer portal."
  },
  {
    question: "Does KoniqTech include AI features?",
    answer:
      "Yes. AI assists with scheduling, route optimization, customer communication, predictive maintenance and workflow automation."
  },
  {
    question: "Can I manage landscaping equipment and inventory?",
    answer:
      "Yes. Track landscaping equipment, irrigation supplies, plants, fertilizers, tools and warehouse inventory in real time."
  }
]

const trustItems = [
  "AI Route Optimization",
  "Recurring Maintenance",
  "Customer Portal",
  "Secure Cloud Platform",
  "Role-Based Access",
  "Crew GPS Tracking",
  "Automatic Backups",
  "Enterprise Support"
]

export default function LandscapingPage() {

  return (

    <main className="bg-white">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50"/>

        <div className="relative mx-auto max-w-7xl px-6 py-28">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-5 py-2 text-green-700">

                <Sparkles className="h-4 w-4"/>

                Landscaping CRM Software

              </div>

              <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">

                Built For

                <span className="block text-green-600">

                  Landscaping Companies

                </span>

              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-600">

                Manage crews,
                recurring maintenance,
                landscaping projects,
                irrigation,
                estimates,
                scheduling,
                invoicing
                and AI automation
                from one modern platform.

              </p>

              <div className="mt-12 flex flex-wrap gap-5">

                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
                >

                  Start Free Trial

                  <ArrowRight className="h-5 w-5"/>

                </Link>

                <Link
                  href="/demo"
                  className="rounded-2xl border border-slate-300 px-8 py-4 font-semibold transition hover:bg-slate-50"
                >

                  Book Demo

                </Link>

              </div>

            </div>

            <div className="rounded-[40px] border bg-white p-8 shadow-2xl">

              <div className="rounded-3xl bg-slate-900 p-8 text-white">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl font-bold">

                    Landscaping Dashboard

                  </h3>

                  <BarChart3 className="h-8 w-8 text-green-400"/>

                </div>

                <div className="mt-10 space-y-5">

                  <DashboardMetric
                    title="Today's Jobs"
                    value="58"
                  />

                  <DashboardMetric
                    title="Active Crews"
                    value="14"
                  />

                  <DashboardMetric
                    title="Recurring Visits"
                    value="312"
                  />

                  <DashboardMetric
                    title="Monthly Revenue"
                    value="$264K"
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

            {stats.map((item)=>(

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
      {/* WHY LANDSCAPING */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-green-600">

              Why Landscaping Companies Choose KoniqTech

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Everything Your Landscaping Business
              Needs In One Platform

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Replace spreadsheets,
              paper schedules,
              manual routing
              and disconnected software
              with one AI-powered operating platform
              built specifically for landscaping companies.

            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-2">

            {benefits.map((item)=>{

              const Icon = item.icon

              return(

                <div
                  key={item.title}
                  className="rounded-[36px] bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="w-fit rounded-2xl bg-green-100 p-4">

                    <Icon className="h-8 w-8 text-green-600"/>

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
{/* LANDSCAPING WORKFLOW */}
{/* ====================================================== */}

  <section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-green-600">

        Landscaping Workflow

      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        Complete Landscaping Workflow

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-600">

        Manage every landscaping project from
        the initial customer inquiry to
        recurring maintenance and final payment
        using one connected platform.

      </p>

    </div>

    <div className="mt-24 space-y-8">

      {workflowSteps.map((step,index)=>(

        <WorkflowCard
          key={step.step}
          step={step.step}
          title={step.title}
          description={step.description}
          last={index===workflowSteps.length-1}
        />

      ))}

    </div>

  </div>

  </section>

   {/* ====================================================== */}
{/* CONNECTED PLATFORM */}
{/* ====================================================== */}

 <section className="bg-slate-900 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid gap-20 lg:grid-cols-2 items-center">

      <div>

        <p className="font-semibold uppercase tracking-widest text-green-400">

          Connected Platform

        </p>

        <h2 className="mt-4 text-5xl font-black text-white">

          Everything Works
          Together

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-300">

          Customer records,
          crews,
          schedules,
          equipment,
          recurring maintenance,
          invoices and payments
          remain synchronized automatically.

        </p>

      </div>

      <div className="grid gap-5 sm:grid-cols-2">

        {workflowBenefits.map((item)=>(

          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl bg-slate-800 p-5"
          >

            <CheckCircle2 className="h-5 w-5 text-green-400"/>

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
   {/* LANDSCAPING FEATURES */}
   {/* ====================================================== */}

   <section className="bg-slate-50 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="font-semibold uppercase tracking-widest text-green-600">

        Complete Landscaping Platform

      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        Everything A Landscaping Company
        Needs

      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-600">

        Manage recurring maintenance,
        landscaping projects,
        irrigation systems,
        equipment,
        inventory,
        crews
        and customer communication
        from one connected platform.

      </p>

    </div>

    <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

      {landscapingFeatures.map((feature)=>{

        const Icon = feature.icon

        return(

          <FeatureCard
            key={feature.title}
            icon={<Icon className="h-8 w-8 text-green-600"/>}
            title={feature.title}
            description={feature.description}
          />

        )

      })}

    </div>

  </div>

  </section>


    {/* ====================================================== */}
   {/* OPERATIONS DASHBOARD */}
   {/* ====================================================== */}

    <section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid items-center gap-20 lg:grid-cols-2">

      <div>

        <p className="font-semibold uppercase tracking-widest text-green-600">

          Live Operations

        </p>

        <h2 className="mt-4 text-5xl font-black text-slate-900">

          Manage Every Landscaping
          Operation In Real Time

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-600">

          Coordinate office staff,
          field crews,
          equipment,
          recurring maintenance,
          customer communication
          and billing from one dashboard.

        </p>

        <div className="mt-10 space-y-5">

          <div className="flex items-center gap-3">

            <CheckCircle2 className="h-6 w-6 text-green-600"/>

            <span>Real-Time Crew Tracking</span>

          </div>

          <div className="flex items-center gap-3">

            <CheckCircle2 className="h-6 w-6 text-green-600"/>

            <span>Recurring Maintenance Scheduling</span>

          </div>

          <div className="flex items-center gap-3">

            <CheckCircle2 className="h-6 w-6 text-green-600"/>

            <span>Equipment & Inventory Monitoring</span>

          </div>

          <div className="flex items-center gap-3">

            <CheckCircle2 className="h-6 w-6 text-green-600"/>

            <span>Instant Estimates & Invoices</span>

          </div>

        </div>

      </div>

      <div className="rounded-[36px] bg-slate-900 p-10">

        <h3 className="text-3xl font-bold text-white">

          Operations Dashboard

        </h3>

        <div className="mt-10 space-y-5">

          {operations.map((item)=>(

            <div
              key={item.title}
              className="flex items-center justify-between rounded-2xl bg-slate-800 px-6 py-5"
            >

              <span className="text-slate-300">

                {item.title}

              </span>

              <span className="text-2xl font-bold text-green-400">

                {item.value}

              </span>

            </div>

          ))}

        </div>

      </div>

    </div>

  </div>

    </section>


    {/* ====================================================== */}
 {/* AI PLATFORM */}
 {/* ====================================================== */}

  <section className="bg-slate-900 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid items-center gap-20 lg:grid-cols-2">

      <div>

        <p className="font-semibold uppercase tracking-widest text-green-400">

          Artificial Intelligence

        </p>

        <h2 className="mt-4 text-5xl font-black text-white">

          AI Built For
          <br/>

          Landscaping Companies

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-300">

          Improve scheduling,
          optimize crew routes,
          automate recurring maintenance,
          communicate with customers
          and simplify daily landscaping operations.

        </p>

        <div className="mt-12 space-y-6">

          {aiFeatures.map((feature)=>{

            const Icon = feature.icon

            return(

              <div
                key={feature.title}
                className="rounded-3xl bg-slate-800 p-6"
              >

                <div className="flex gap-5">

                  <div className="rounded-2xl bg-green-600 p-4">

                    <Icon className="h-7 w-7 text-white"/>

                  </div>

                  <div>

                    <h3 className="text-2xl font-bold text-white">

                      {feature.title}

                    </h3>

                    <p className="mt-3 leading-8 text-slate-300">

                      {feature.description}

                    </p>

                  </div>

                </div>

              </div>

            )

          })}

        </div>

      </div>

      <div className="rounded-[40px] bg-slate-800 p-10">

        <h3 className="text-3xl font-bold text-white">

          AI Automation Center

        </h3>

        <div className="mt-10 space-y-5">

          <AutomationRow
            title="Route Optimization"
            icon={Brain}
          />

          <AutomationRow
            title="Automatic Scheduling"
            icon={Calendar}
          />

          <AutomationRow
            title="Customer Notifications"
            icon={MessageSquare}
          />

          <AutomationRow
            title="Voice Assistant"
            icon={Mic}
          />

          <AutomationRow
            title="Smart Alerts"
            icon={Bell}
          />

        </div>

      </div>

    </div>

  </div>

  </section>



 {/* ====================================================== */}
 {/* MOBILE APP */}
 {/* ====================================================== */}

  <section className="bg-white py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid items-center gap-20 lg:grid-cols-2">

      <div className="rounded-[40px] border bg-slate-50 p-10 shadow-lg">

        <Smartphone className="h-14 w-14 text-green-600"/>

        <h3 className="mt-8 text-3xl font-bold">

          Landscaping Crew App

        </h3>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">

          {mobileFeatures.map((feature)=>(

            <div
              key={feature}
              className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm"
            >

              <CheckCircle2 className="h-5 w-5 text-green-600"/>

              <span>{feature}</span>

            </div>

          ))}

        </div>

      </div>

      <div>

        <p className="font-semibold uppercase tracking-widest text-green-600">

          Mobile Workforce

        </p>

        <h2 className="mt-4 text-5xl font-black">

          Everything Your
          Landscaping Crew Needs

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-600">

          Access schedules,
          customer information,
          property details,
          navigation,
          photos,
          work orders,
          estimates,
          invoices and payments directly from the mobile app.

        </p>

      </div>

    </div>

  </div>

  </section>



  {/* ====================================================== */}
  {/* INTEGRATIONS */}
   {/* ====================================================== */}

  <section className="bg-slate-50 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="text-center">

      <p className="font-semibold uppercase tracking-widest text-green-600">

        Integrations

      </p>

      <h2 className="mt-4 text-5xl font-black">

        Connect Your
        Favorite Tools

      </h2>

      <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

        Connect accounting,
        communication,
        AI,
        mapping,
        cloud storage
        and payment providers
        to streamline your landscaping business.

      </p>

    </div>

    <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

      {integrations.map((item)=>(

        <div
          key={item}
          className="rounded-3xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-lg"
        >

          <Plug className="mx-auto h-10 w-10 text-green-600"/>

          <h3 className="mt-5 text-xl font-bold">

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

<section className="bg-white py-28">

  <div className="mx-auto max-w-5xl px-6">

    <div className="text-center">

      <p className="font-semibold uppercase tracking-widest text-green-600">

        Frequently Asked Questions

      </p>

      <h2 className="mt-4 text-5xl font-black text-slate-900">

        Landscaping CRM Questions

      </h2>

    </div>

    <div className="mt-20 space-y-6">

      {landscapingFaq.map((faq)=>(

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
{/* TRUST */}
{/* ====================================================== */}

<section className="bg-slate-50 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="grid gap-20 lg:grid-cols-2 items-center">

      <div>

        <p className="font-semibold uppercase tracking-widest text-green-600">

          Trusted Landscaping Platform

        </p>

        <h2 className="mt-4 text-5xl font-black text-slate-900">

          Built To Help
          Landscaping Companies Grow

        </h2>

        <p className="mt-8 text-xl leading-9 text-slate-600">

          Replace paperwork,
          manual scheduling,
          disconnected software
          and spreadsheets
          with one AI-powered platform
          built specifically for landscaping companies.

        </p>

      </div>

      <div className="grid gap-5 sm:grid-cols-2">

        {trustItems.map((item)=>(

          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl bg-white p-6 shadow-sm"
          >

            <CheckCircle2 className="h-5 w-5 text-green-600"/>

            <span className="font-medium">

              {item}

            </span>

          </div>

        ))}

      </div>

    </div>

  </div>

</section>

   {/* ====================================================== */}
{/* PRICING CTA */}
{/* ====================================================== */}

<section className="bg-slate-900 py-28">

  <div className="mx-auto max-w-6xl px-6">

    <div className="rounded-[40px] bg-slate-800 p-14">

      <div className="grid gap-12 lg:grid-cols-2 items-center">

        <div>

          <p className="font-semibold uppercase tracking-widest text-green-400">

            Simple Pricing

          </p>

          <h2 className="mt-4 text-5xl font-black text-white">

            Modern Software
            For Modern Landscapers

          </h2>

          <p className="mt-8 text-xl leading-9 text-slate-300">

            Start with a free trial,
            scale as your business grows
            and manage crews,
            maintenance,
            projects and customers
            from one connected platform.

          </p>

        </div>

        <div className="space-y-4">

          <Link
            href="/pricing"
            className="flex h-14 items-center justify-center rounded-2xl bg-green-600 font-semibold text-white transition hover:bg-green-700"
          >

            View Pricing

          </Link>

          <Link
            href="/demo"
            className="flex h-14 items-center justify-center rounded-2xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700"
          >

            Book Demo

          </Link>

          <Link
            href="/register"
            className="flex h-14 items-center justify-center rounded-2xl bg-emerald-600 font-semibold text-white transition hover:bg-emerald-700"
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

<section className="bg-gradient-to-r from-green-600 to-emerald-600 py-28">

  <div className="mx-auto max-w-5xl px-6 text-center text-white">

    <Sparkles className="mx-auto h-16 w-16"/>

    <h2 className="mt-8 text-6xl font-black leading-tight">

      Ready To Grow
      <br/>

      Your Landscaping Business?

    </h2>

    <p className="mx-auto mt-10 max-w-3xl text-xl leading-9 text-green-100">

      Manage crews,
      recurring maintenance,
      landscaping projects,
      irrigation systems,
      customer communication,
      invoicing
      and AI automation
      from one intelligent CRM.

    </p>

    <div className="mt-12 flex flex-wrap justify-center gap-6">

      <Link
        href="/register"
        className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-green-700 transition hover:bg-green-50"
      >

        Start Free Trial

        <ArrowRight className="h-5 w-5"/>

      </Link>

      <Link
        href="/demo"
        className="rounded-2xl border border-white/40 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
      >

        Schedule Demo

      </Link>

    </div>

    <div className="mt-10 flex flex-wrap justify-center gap-8 text-green-100">

      <span>✓ AI Powered</span>

      <span>✓ Route Optimization</span>

      <span>✓ Mobile Workforce</span>

      <span>✓ Built For Landscaping Companies</span>

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

      <div className="text-5xl font-black text-green-600">

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

      <span className="text-2xl font-bold text-green-400">

        {value}

      </span>

    </div>

  )

}

function WorkflowCard({
  step,
  title,
  description,
  last
}:{
  step:string
  title:string
  description:string
  last:boolean
}){

  return(

    <div className="relative flex gap-8">

      <div className="flex flex-col items-center">

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-xl font-black text-white">

          {step}

        </div>

        {!last && (

          <div className="mt-2 h-full w-1 rounded-full bg-green-200"/>

        )}

      </div>

      <div className="flex-1 rounded-[32px] border bg-slate-50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

        <h3 className="text-3xl font-bold text-slate-900">

          {title}

        </h3>

        <p className="mt-5 text-lg leading-8 text-slate-600">

          {description}

        </p>

      </div>

    </div>

  )

}

function FeatureCard({
  icon,
  title,
  description
}:{
  icon:React.ReactNode
  title:string
  description:string
}){

  return(

    <div className="rounded-[36px] bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

      <div className="w-fit rounded-2xl bg-green-100 p-4">

        {icon}

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

function AutomationRow({
  title,
  icon: Icon
}:{
  title:string
  icon:any
}){

  return(

    <div className="flex items-center gap-4 rounded-2xl bg-slate-700 p-5">

      <div className="rounded-xl bg-green-600 p-3">

        <Icon className="h-5 w-5 text-white"/>

      </div>

      <span className="text-lg font-semibold text-white">

        {title}

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

    <div className="rounded-[32px] border bg-slate-50 p-8">

      <h3 className="text-2xl font-bold text-slate-900">

        {question}

      </h3>

      <p className="mt-5 text-lg leading-8 text-slate-600">

        {answer}

      </p>

    </div>

  )

}